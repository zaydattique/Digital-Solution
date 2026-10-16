import type { DemoRequest } from "../db/schema.js";
import type { ContactRepository } from "../repositories/contact.repository.js";
import type { ContactRequest } from "../schemas/contact.schema.js";
import type { EmailService } from "./email.service.js";
import { logger } from "../utils/logger.js";

export interface ContactSubmissionResult {
  record: DemoRequest;
  notificationSent: boolean;
}

export interface ContactService {
  submit(payload: ContactRequest): Promise<ContactSubmissionResult>;
}

export class DefaultContactService implements ContactService {
  constructor(
    private readonly repository: ContactRepository,
    private readonly notifications: EmailService,
  ) {}

  async submit(payload: ContactRequest): Promise<ContactSubmissionResult> {
    // Persist before notifying. A notification cannot substitute for a saved lead.
    const record = await this.repository.create(payload);
    let notificationSent = false;
    try {
      await this.notifications.sendContactNotification(payload);
      notificationSent = true;
    } catch (emailError) {
      logger.error("Contact notification email failed", { error: emailError });
    }

    return { record, notificationSent };
  }
}
