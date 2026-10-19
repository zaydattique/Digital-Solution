import { createHash } from "node:crypto";
import { Router } from "express";
import sharp from "sharp";
import { verifyAdminKey } from "./site.routes.js";

type CloudinaryResponse = {
  secure_url?: string;
  eager?: { secure_url?: string; format?: string }[];
  error?: { message?: string };
};

export function createMediaRouter() {
  const router = Router();
  router.post("/", async (req, res) => {
    if (!verifyAdminKey(req.get("X-Admin-Key"))) {
      res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authorized" } }); return;
    }
    const mime = req.get("Content-Type")?.split(";")[0];
    const image = ["image/jpeg", "image/png", "image/webp"].includes(mime ?? "");
    const video = ["video/mp4", "video/webm"].includes(mime ?? "");
    if (!image && !video) {
      res.status(415).json({ success: false, error: { code: "UNSUPPORTED_MEDIA", message: "Only JPEG, PNG, WebP, MP4 and WebM files are accepted." } }); return;
    }
    if (!Buffer.isBuffer(req.body) || req.body.length < 12 || req.body.length > (image ? 8 : 24) * 1024 * 1024) {
      res.status(413).json({ success: false, error: { code: "INVALID_MEDIA_SIZE", message: "Invalid file size." } }); return;
    }
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME, apiKey = process.env.CLOUDINARY_API_KEY, secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !/^[a-zA-Z0-9_-]+$/.test(cloudName) || !apiKey || !secret) {
      res.status(503).json({ success: false, error: { code: "MEDIA_STORAGE_UNCONFIGURED", message: "Media storage is not configured." } }); return;
    }
    try {
      let bytes: Buffer = req.body;
      const format: "image" | "video" = video ? "video" : "image";
      if (image) {
        const meta = await sharp(bytes, { limitInputPixels: 40_000_000, failOn: "error" }).metadata();
        if (!["jpeg", "png", "webp"].includes(meta.format ?? "")) throw new Error("Image bytes do not match an allowed format");
        bytes = await sharp(bytes, { limitInputPixels: 40_000_000 }).rotate().resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toBuffer();
      } else {
        // Validate container magic before forwarding to the trusted transcode provider.
        const isMp4 = mime === "video/mp4" && bytes.toString("ascii", 4, 8) === "ftyp";
        const isWebm = mime === "video/webm" && bytes.subarray(0, 4).toString("hex") === "1a45dfa3";
        if (!isMp4 && !isWebm) throw new Error("Invalid video container");
      }
      const timestamp = String(Math.floor(Date.now() / 1000));
      const params = [
        "folder=havocx-agency",
        ...(video ? ["eager=f_webm,q_auto"] : []),
        `timestamp=${timestamp}`,
      ];
      params.sort();
      const signature = createHash("sha1").update(params.join("&") + secret).digest("hex");
      const body = new FormData();
      body.set("api_key", apiKey);
      body.set("timestamp", timestamp);
      body.set("folder", "havocx-agency");
      if (video) body.set("eager", "f_webm,q_auto");
      body.set("signature", signature);
      const payload = new Uint8Array(bytes);
      body.set("file", new Blob([payload], { type: image ? "image/webp" : mime! }), image ? "upload.webp" : mime === "video/mp4" ? "upload.mp4" : "upload.webm");
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${format}/upload`, {
        method: "POST", body, signal: AbortSignal.timeout(85_000),
      });
      const parsed: CloudinaryResponse = await response.json() as CloudinaryResponse;
      if (!response.ok || parsed.error) throw new Error("Media provider rejected processing request");
      const url = video ? parsed.eager?.find((v) => v.format === "webm" || v.secure_url?.includes(".webm"))?.secure_url : parsed.secure_url;
      if (!url || !url.startsWith("https://") || (video && !url.includes(".webm")) || (image && !url.includes(".webp"))) {
        throw new Error("Verified WebP/WebM output was not returned by the media provider");
      }
      res.set("Cache-Control", "no-store");
      res.status(201).json({ success: true, data: { url, format: video ? "webm" : "webp", bytes: bytes.length } });
    } catch {
      res.status(422).json({ success: false, error: { code: "MEDIA_PROCESSING_FAILED", message: "Media could not be validated and converted." } });
    }
  });
  return router;
}
