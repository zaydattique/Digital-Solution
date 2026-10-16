import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { hasAdminSession } from "../../actions";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret || !/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
    return NextResponse.json({ error: "Media processor not configured" }, { status: 503 });
  }
  const body: unknown = await request.json().catch(() => null);
  const type = body && typeof body === "object" && "type" in body ? body.type : null;
  if (type !== "image" && type !== "video") return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "havocx/site";
  const eager = type === "image" ? "f_webp,q_auto" : "f_webm,vc_vp9,ac_opus,q_auto";
  const signedString = `eager=${eager}&folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(signedString + secret).digest("hex");
  return NextResponse.json({
    cloudName, apiKey, timestamp, folder, eager, signature, resourceType: type,
  }, { headers: { "Cache-Control": "no-store" } });
}
