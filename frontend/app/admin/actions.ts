"use server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { backendAddress } from "@/src/lib/site";

const COOKIE = "havocx-admin";
function sign(value: string, secret: string) { return createHmac("sha256", secret).update(value).digest("hex"); }
function check(candidate: string, expected: string) {
  const a = Buffer.from(sign(candidate, expected));
  const b = Buffer.from(sign(expected, expected));
  return a.length === b.length && timingSafeEqual(a, b);
}
export async function isAdminAuthenticated() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const session = (await cookies()).get(COOKIE)?.value;
  if (!secret || secret.length < 32 || !session) return false;
  const [expiry, signature, other] = session.split(".");
  if (other || !/^\d{10,13}$/.test(expiry ?? "") || !/^[0-9a-f]{64}$/.test(signature ?? "") || Number(expiry) < Date.now()) return false;
  const expected = Buffer.from(sign(expiry, secret), "hex");
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}

export async function logIn(form: FormData) {
  const password = form.get("password");
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (typeof password !== "string" || !expected || expected.length < 16 || !secret || secret.length < 32 || !check(password, expected)) {
    redirect("/admin/login?error=invalid");
  }
  const expires = Date.now() + 12 * 60 * 60 * 1000;
  const value = `${expires}.${sign(String(expires), secret)}`;
  (await cookies()).set(COOKIE, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/admin", maxAge: 43200 });
  redirect("/admin");
}
export async function logOut() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}
export async function saveSetting(form: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin/login");
  const key = form.get("key"), value = form.get("value");
  if (typeof key !== "string" || typeof value !== "string" || value.length > 3000) throw new Error("Invalid setting");
  const endpoint = backendAddress(`api/v1/site/${encodeURIComponent(key)}`);
  const token = process.env.INTERNAL_CMS_TOKEN;
  if (!endpoint || !token) throw new Error("Site content service is not configured");
  const response = await fetch(endpoint, {
    method: "PUT", headers: { "Content-Type": "application/json", "X-Admin-Key": token },
    body: JSON.stringify({ value }), cache: "no-store",
  });
  if (!response.ok) throw new Error("Unable to save content. Please check the field value.");
  revalidatePath("/", "layout");
  redirect("/admin?saved=1");
}

export async function uploadMedia(form: FormData) {
  if (!await isAdminAuthenticated()) redirect("/admin/login");
  const key = form.get("key"), file = form.get("file");
  const allowed = ["brand.logoUrl", "brand.faviconUrl", "brand.ogImageUrl", "home.heroImageUrl", "home.heroVideoUrl"];
  if (typeof key !== "string" || !allowed.includes(key) || !(file instanceof File)) throw new Error("Invalid upload");
  const mime = file.type;
  const image = ["image/jpeg", "image/png", "image/webp"].includes(mime);
  const video = ["video/mp4", "video/webm"].includes(mime);
  if ((!image && !video) || (video && key !== "home.heroVideoUrl") || (image && key === "home.heroVideoUrl") || file.size > (image ? 8 : 24) * 1024 * 1024) {
    throw new Error("Unsupported or oversized media");
  }
  const endpoint = backendAddress("api/v1/media");
  const token = process.env.INTERNAL_CMS_TOKEN;
  if (!endpoint || !token) throw new Error("Media API not configured");
  const uploaded = await fetch(endpoint, {
    method: "POST", headers: { "X-Admin-Key": token, "Content-Type": mime },
    body: await file.arrayBuffer(), cache: "no-store", signal: AbortSignal.timeout(95_000),
  });
  if (!uploaded.ok) throw new Error("Media upload or conversion failed");
  const result = await uploaded.json() as { data?: { url?: string } };
  const url = result.data?.url;
  if (!url || !url.startsWith("https://")) throw new Error("Media provider did not return a secure URL");
  const saved = await fetch(backendAddress(`api/v1/site/${encodeURIComponent(key)}`)!, {
    method: "PUT", headers: { "X-Admin-Key": token, "Content-Type": "application/json" },
    body: JSON.stringify({ value: url }), cache: "no-store",
  });
  if (!saved.ok) throw new Error("Media converted but publishing URL failed; retry saving the URL manually");
  revalidatePath("/", "layout");
  redirect("/admin?uploaded=1");
}
