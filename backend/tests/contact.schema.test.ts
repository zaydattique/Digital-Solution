import { describe, expect, it } from "vitest";
import { contactRequestSchema } from "../src/schemas/contact.schema.js";
import { validContactRequest } from "./fixtures.js";

describe("contactRequestSchema", () => {
  it("trims and accepts a valid payload", () => {
    const result = contactRequestSchema.parse({
      ...validContactRequest,
      name: "  Test User  ",
    });

    expect(result.name).toBe("Test User");
  });

  it("rejects invalid email, phone, missing fields, and unknown fields", () => {
    const result = contactRequestSchema.safeParse({
      ...validContactRequest,
      email: "invalid",
      phone: "+92 300",
      unknown: "field",
    });

    expect(result.success).toBe(false);
  });

  it("limits unbounded message input", () => {
    const result = contactRequestSchema.safeParse({
      ...validContactRequest,
      message: "x".repeat(5_001),
    });

    expect(result.success).toBe(false);
  });
});

describe("service CMS key validation", () => {
  it("accepts published service fields but never arbitrary or escaped keys", async () => {
    const { isEditableServiceSetting } = await import("../src/routes/site.routes.js");
    expect(isEditableServiceSetting("service.technical-seo.title")).toBe(true);
    expect(isEditableServiceSetting("service.ai-agents-copilots.imageUrl")).toBe(true);
    expect(isEditableServiceSetting("service.ux-ui-design.heroSubtitle")).toBe(true);
    expect(isEditableServiceSetting("service.technical-seo.badField")).toBe(false);
    expect(isEditableServiceSetting("service\\\\.technical-seo\\\\.title")).toBe(false);
    expect(isEditableServiceSetting("service.../title")).toBe(false);
  });
});
