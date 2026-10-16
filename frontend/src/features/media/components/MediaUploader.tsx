"use client";

import { useState } from "react";
import { publishConvertedMedia } from "@/app/admin/media/actions";

type Signature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  eager: string;
  resourceType: "image" | "video";
};
export function MediaUploader() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [slot, setSlot] = useState("heroImage");

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const file = form.get("file");
      const alt = form.get("alt");
      if (!(file instanceof File) || !file.size) throw new Error("Choose an image or video.");
      const type: Signature["resourceType"] = file.type.startsWith("video/") ? "video" : "image";
      if (!["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm", "video/quicktime"].includes(file.type)) {
        throw new Error("Only JPG, PNG, WebP, MP4, WebM or MOV are supported.");
      }
      if (file.size > (type === "video" ? 50 : 10) * 1024 * 1024) throw new Error("File exceeds the configured upload limit.");
      if ((slot === "video") !== (type === "video")) throw new Error("Choose the matching video or image destination.");
      if (slot === "heroImage" && (!alt || typeof alt !== "string" || !alt.trim())) throw new Error("A descriptive alt text is required for hero images.");
      const signed = await fetch("/admin/media/sign", {
        method: "POST", credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      if (!signed.ok) throw new Error("Media uploads are not configured or admin session expired.");
      const cfg = await signed.json() as Signature;
      const payload = new FormData();
      payload.set("file", file);
      payload.set("api_key", cfg.apiKey);
      payload.set("timestamp", String(cfg.timestamp));
      payload.set("signature", cfg.signature);
      payload.set("folder", cfg.folder);
      payload.set("eager", cfg.eager);
      const result = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cfg.cloudName)}/${cfg.resourceType}/upload`, {
        method: "POST", body: payload,
      });
      const response: unknown = await result.json();
      if (!result.ok || !response || typeof response !== "object") throw new Error("Media service rejected the upload.");
      setMessage("Upload received. Verifying the WebP/WebM conversion before publishing.");
      const commit = new FormData();
      commit.set("slot", slot);
      commit.set("alt", String(alt ?? "").trim());
      commit.set("response", JSON.stringify(response));
      await publishConvertedMedia(commit);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="ds-admin-media" aria-labelledby="media-upload-title">
      <h2 id="media-upload-title">Upload and optimize media</h2>
      <p>Files upload directly to your configured media processor. Images must produce WebP; videos must produce WebM before their URLs are published. Originals are not used by the website.</p>
      <form onSubmit={upload}>
        <label htmlFor="media-slot">Where should it appear?</label>
        <select id="media-slot" name="slot" value={slot} onChange={(e) => setSlot(e.target.value)}>
          <option value="logo">Brand logo</option>
          <option value="favicon">Favicon</option>
          <option value="ogImage">Social preview image</option>
          <option value="heroImage">Homepage hero image</option>
          <option value="video">Video library</option>
        </select>
        <label htmlFor="media-file">Image or video</label>
        <input id="media-file" name="file" type="file" required accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime" />
        <label htmlFor="media-alt">Alt text</label>
        <input id="media-alt" name="alt" type="text" maxLength={180} placeholder="Describe the visual when it conveys information" />
        <button type="submit" disabled={busy}>{busy ? "Processing..." : "Upload and publish optimized file"}</button>
      </form>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
