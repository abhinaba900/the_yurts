"use server";

import { headers } from "next/headers";
import { parseEnquiry, formatEnquiry, kindLabels, type EnquiryState } from "@/lib/enquiry";
import { canWriteToSanity, createEnquiryDocument } from "@/sanity/lib/write";
import { canSendEmail, sendEnquiryEmail } from "@/lib/email";

/**
 * Handles every enquiry on the site.
 *
 * THE RULE THAT MATTERS: this never reports success unless the enquiry actually
 * landed somewhere a human will see it. A form that says "thanks, we'll be in
 * touch" while dropping the message on the floor is worse than no form —
 * the visitor stops looking for another way to reach you, and the lead is gone
 * with no trace that it ever existed.
 *
 * So the outcome depends on what actually happened:
 *
 *   - Stored in Sanity, or emailed, or both  → success
 *   - Both configured but both failed        → error, try again
 *   - Neither configured                     → error saying so plainly
 *
 * The last case is the state this site is in until the client sets
 * SANITY_API_WRITE_TOKEN or the Resend variables. See .env.example.
 */
export async function submitEnquiry(
  _previous: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const { data, errors } = parseEnquiry(formData);

  // Honeypot. A real person never fills a field they cannot see, so anything
  // that does is a bot — and it gets a success page rather than a hint that it
  // was spotted.
  if (typeof formData.get("company") === "string" && formData.get("company")) {
    return { status: "success", message: "Thank you — your enquiry is with us." };
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some details need another look.",
      errors,
      values: data,
    };
  }

  // Recorded so a reply can reference where the person actually was.
  const referer = (await headers()).get("referer") ?? "";
  const sourcePath = data.sourcePath || referer;

  const summary = formatEnquiry({ ...data, sourcePath });

  const [stored, emailed] = await Promise.all([
    createEnquiryDocument({
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiryType: kindLabels[data.kind],
      location: data.location,
      message: data.message,
      productSlug: data.product,
      configuration: data.configuration,
      sourcePath,
    }),
    sendEnquiryEmail({
      subject: `${kindLabels[data.kind]} — ${data.name}`,
      body: summary,
      replyTo: data.email,
    }),
  ]);

  if (stored || emailed) {
    return {
      status: "success",
      message:
        data.kind === "consultation"
          ? "Thank you — we will be in touch to arrange a time."
          : "Thank you — your enquiry is with us and we will reply shortly.",
    };
  }

  const nothingConfigured = !canWriteToSanity && !canSendEmail;

  return {
    status: "error",
    values: data,
    message: nothingConfigured
      ? "This form cannot send yet — the site is not connected to its inbox. Nothing has been recorded, so please get in touch directly rather than waiting for a reply."
      : "Something went wrong sending that, and we would rather tell you than pretend otherwise. Please try again, or contact us directly.",
  };
}
