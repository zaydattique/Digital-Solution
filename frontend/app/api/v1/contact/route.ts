import { createHmac } from "node:crypto";
import { isIP } from "node:net";
import { backendAddress } from "@/src/lib/site";

// Public exception to the private backend: contact submissions only.
// This is not a generic /api/* proxy and never forwards cookies or admin credentials.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 32 * 1024;
const MAX_FIELDS = 7;
const allowedFields = ["name", "email", "phone", "company", "service", "subService", "message"] as const;

function error(status: number, code: string, message: string): Response {
  return Response.json(
    { success: false, error: { code, message } },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  // Browsers normally include Origin for JSON POST. Reject cross-origin requests;
  // scripts and curl without Origin remain subject to backend validation/rate limits.
  if (origin) {
    let parsed: URL;
    try { parsed = new URL(origin); } catch {
      return error(403, "ORIGIN_NOT_ALLOWED", "Cross-origin contact requests are not allowed.");
    }
    if (!host || parsed.host.toLowerCase() !== host.toLowerCase() || (parsed.protocol !== "https:" && parsed.protocol !== "http:")) {
      return error(403, "ORIGIN_NOT_ALLOWED", "Cross-origin contact requests are not allowed.");
    }
  }

  const type = request.headers.get("content-type") ?? "";
  if (!/^application\/json(?:\s*;|\s*$)/i.test(type)) {
    return error(415, "UNSUPPORTED_CONTENT_TYPE", "Send the contact request as JSON.");
  }
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BYTES) {
    return error(413, "BODY_TOO_LARGE", "The contact request is too large.");
  }

  let raw: string;
  try { raw = await request.text(); } catch {
    return error(400, "INVALID_BODY", "Unable to read the request.");
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BYTES) {
    return error(413, "BODY_TOO_LARGE", "The contact request is too large.");
  }

  let payload: unknown;
  try { payload = JSON.parse(raw); } catch {
    return error(400, "INVALID_JSON", "Invalid request JSON.");
  }
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return error(400, "INVALID_BODY", "Expected contact form fields.");
  }
  const fields = Object.keys(payload);
  if (fields.length !== MAX_FIELDS || fields.some((key) => !allowedFields.includes(key as typeof allowedFields[number]))) {
    return error(400, "INVALID_BODY", "The contact request has unexpected or missing fields.");
  }
  const values = payload as Record<string, unknown>;
  if (allowedFields.some((key) => typeof values[key] !== "string")) {
    return error(400, "INVALID_BODY", "Contact fields must be text.");
  }

  const endpoint = backendAddress("api/v1/contact");
  if (!endpoint) return error(503, "CONTACT_UNAVAILABLE", "The contact form is temporarily unavailable.");

  try {
    // Vercel overwrites its forwarded IP headers at the trusted ingress. Sign a hash,
    // never the raw address, so the private backend can rate-limit per visitor.
    const secret = process.env.INTERNAL_CMS_TOKEN;
    const forwarded = process.env.VERCEL
      ? request.headers.get("x-vercel-forwarded-for")
      : request.headers.get("x-forwarded-for");
    const clientIP = forwarded?.split(",")[0]?.trim();
    const upstreamHeaders = new Headers({ "Content-Type": "application/json" });
    if (secret && secret.length >= 32 && clientIP && isIP(clientIP)) {
      const visitor = createHmac("sha256", secret).update(clientIP).digest("hex");
      const issuedAt = String(Math.floor(Date.now() / 1000));
      const proof = createHmac("sha256", secret).update(`${visitor}.${issuedAt}`).digest("hex");
      upstreamHeaders.set("X-HavocX-Visitor", visitor);
      upstreamHeaders.set("X-HavocX-Issued-At", issuedAt);
      upstreamHeaders.set("X-HavocX-Signature", proof);
    }
    // Only the vetted contact payload and signed visitor identifier reach the private backend.
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: upstreamHeaders,
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    const data: unknown = await upstream.json();
    if (!data || typeof data !== "object" || !("success" in data)) {
      return error(502, "BAD_GATEWAY", "The contact service returned an invalid response.");
    }
    const headers = new Headers({ "Cache-Control": "no-store" });
    for (const name of ["ratelimit-limit", "ratelimit-remaining", "retry-after", "x-request-id"]) {
      const value = upstream.headers.get(name);
      if (value) headers.set(name, value);
    }
    return Response.json(data, { status: upstream.status, headers });
  } catch {
    return error(503, "CONTACT_UNAVAILABLE", "The contact form is temporarily unavailable.");
  }
}
