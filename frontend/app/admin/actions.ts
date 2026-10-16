"use server";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const COOKIE = "havocx_admin_session";
const KEYS = new Set(["identity", "home", "media"]);
function configured() {
  return Boolean(
    process.env.CMS_ADMIN_PASSWORD_HASH?.match(/^[a-f0-9]{64}$/i) &&
    process.env.CMS_ADMIN_SESSION_SECRET && process.env.CMS_ADMIN_SESSION_SECRET.length >= 32 &&
    process.env.CMS_INTERNAL_TOKEN && process.env.CMS_INTERNAL_TOKEN.length >= 32,
  );
}
function signature(data: string) {
  return createHmac("sha256", process.env.CMS_ADMIN_SESSION_SECRET!).update(data).digest("hex");
}
function equalHex(a: string, b: string) {
  if (!/^[a-f0-9]{64}$/i.test(a) || !/^[a-f0-9]{64}$/i.test(b)) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}
export async function hasAdminSession(): Promise<boolean> {
  if (!configured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expiry, sig, more] = token.split(".");
  if (more || !/^\d+$/.test(expiry ?? "") || !sig) return false;
  if (Number(expiry) < Date.now() || Number(expiry) > Date.now() + 8 * 3600_000) return false;
  return equalHex(sig, signature(expiry));
}
export async function adminLogin(form: FormData): Promise<void> {
  if (!configured()) redirect("/admin?status=unconfigured");
  const password = form.get("password");
  if (typeof password !== "string" || password.length > 512) redirect("/admin?status=invalid");
  const hash = createHash("sha256").update(password).digest("hex");
  if (!equalHex(hash, process.env.CMS_ADMIN_PASSWORD_HASH!)) redirect("/admin?status=invalid");
  const expiry = String(Date.now() + 8 * 3600_000);
  (await cookies()).set(COOKIE, `${expiry}.${signature(expiry)}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: "/admin", maxAge: 8 * 3600,
  });
  redirect("/admin");
}
export async function adminLogout(): Promise<void> {
  (await cookies()).delete(COOKIE);
  redirect("/admin");
}
export async function saveSiteDocument(form: FormData): Promise<void> {
  if (!(await hasAdminSession())) redirect("/admin?status=unauthorized");
  const key = form.get("key");
  const raw = form.get("json");
  if (typeof key !== "string" || !KEYS.has(key) || typeof raw !== "string" || raw.length > 100_000) {
    redirect("/admin?status=invalid");
  }
  let value: unknown;
  try { value = JSON.parse(raw); } catch { redirect(`/admin?key=${key}&status=invalid-json`); }
  if (!value || typeof value !== "object" || Array.isArray(value)) redirect(`/admin?key=${key}&status=invalid-json`);
  const base = process.env.BACKEND_URL;
  if (!base) redirect(`/admin?key=${key}&status=backend-unavailable`);
  let saved = false;
  try {
    const res = await fetch(new URL(`api/v1/admin/content/${key}`, base.endsWith("/") ? base : base + "/"), {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-cms-internal-token": process.env.CMS_INTERNAL_TOKEN! },
      body: JSON.stringify({ value }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    saved = res.ok;
  } catch { /* Keep errors opaque; do not leak private server URLs. */ }
  if (!saved) redirect(`/admin?key=${key}&status=save-failed`);
  revalidatePath("/", "layout");
  redirect(`/admin?key=${key}&status=saved`);
}
