"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { hasAdminSession } from "../actions";
import { getSiteDocument } from "@/src/lib/site-content";
import type { SiteIdentity, HomeContent } from "@/src/lib/site-defaults";

type MediaResponse = {
  public_id: string;
  version: number;
  signature: string;
  resource_type: "image" | "video";
  bytes: number;
  eager?: Array<{ secure_url?: string; format?: string }>;
};

function sameHex(left: string, right: string) {
  if (!/^[0-9a-f]{40}$/i.test(left) || !/^[0-9a-f]{40}$/i.test(right)) return false;
  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}
async function writeRecord(key: string, value: object) {
  const base = process.env.BACKEND_URL;
  const secret = process.env.CMS_INTERNAL_TOKEN;
  if (!base || !secret) return false;
  try {
    const response = await fetch(new URL(`api/v1/admin/content/${key}`, base.endsWith("/") ? base : base + "/"), {
      method: "PUT", cache: "no-store", signal: AbortSignal.timeout(8000),
      headers: { "Content-Type": "application/json", "x-cms-internal-token": secret },
      body: JSON.stringify({ value }),
    });
    return response.ok;
  } catch { return false; }
}
export async function publishConvertedMedia(form: FormData): Promise<void> {
  if (!(await hasAdminSession())) redirect("/admin?status=unauthorized");
  const raw = form.get("response"), slot = form.get("slot"), alt = form.get("alt");
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (typeof raw !== "string" || raw.length > 10_000 || typeof slot !== "string" || typeof alt !== "string"
    || alt.length > 180 || !cloudName || !secret) redirect("/admin?key=media&status=invalid-media");
  if (!["logo", "favicon", "ogImage", "heroImage", "video"].includes(slot)) redirect("/admin?key=media&status=invalid-media");
  let data: MediaResponse;
  try { data = JSON.parse(raw) as MediaResponse; } catch { redirect("/admin?key=media&status=invalid-media"); }
  if (!data || !data.public_id?.startsWith("havocx/site/") || !Number.isSafeInteger(data.version)
      || typeof data.signature !== "string" || !Number.isSafeInteger(data.bytes) || data.bytes < 1) {
    redirect("/admin?key=media&status=invalid-media");
  }
  const expected = createHash("sha1").update(`public_id=${data.public_id}&version=${data.version}${secret}`).digest("hex");
  if (!sameHex(expected, data.signature)) redirect("/admin?key=media&status=invalid-media");
  const type = data.resource_type;
  const format = type === "image" ? "webp" : type === "video" ? "webm" : "";
  if (!format || (slot === "video" && type !== "video") || (slot !== "video" && type !== "image")) {
    redirect("/admin?key=media&status=invalid-media");
  }
  const url = data.eager?.find((item) => item.format === format || item.secure_url?.endsWith("." + format))?.secure_url;
  if (!url) redirect("/admin?key=media&status=conversion-pending");
  let parsed: URL;
  try { parsed = new URL(url); } catch { redirect("/admin?key=media&status=invalid-media"); }
  if (parsed.protocol !== "https:" || parsed.hostname !== "res.cloudinary.com" ||
      !parsed.pathname.startsWith(`/${cloudName}/${type}/upload/`) || !parsed.pathname.endsWith("." + format) ||
      !parsed.pathname.includes(data.public_id)) redirect("/admin?key=media&status=invalid-media");

  const media = await getSiteDocument<{ assets: Record<string, unknown> }>("media");
  const assets = media.assets && typeof media.assets === "object" ? media.assets : {};
  const nextMedia = { assets: { ...assets, [data.public_id]: { url, format, type, alt, bytes: data.bytes, slot } } };
  if (!(await writeRecord("media", nextMedia))) redirect("/admin?key=media&status=save-failed");
  if (slot === "logo" || slot === "favicon" || slot === "ogImage") {
    const identity = await getSiteDocument<SiteIdentity>("identity");
    const field = slot === "logo" ? "logoUrl" : slot === "favicon" ? "faviconUrl" : "ogImageUrl";
    if (!(await writeRecord("identity", { ...identity, [field]: url }))) redirect("/admin?key=media&status=save-failed");
  }
  if (slot === "heroImage") {
    const home = await getSiteDocument<HomeContent>("home");
    const heroImages = Array.isArray(home.heroImages) ? home.heroImages : [];
    if (!(await writeRecord("home", { ...home, heroImages: [...heroImages, { src: url, alt, position: "center center" }] }))) {
      redirect("/admin?key=media&status=save-failed");
    }
  }
  revalidatePath("/", "layout");
  redirect("/admin?key=media&status=media-saved");
}
