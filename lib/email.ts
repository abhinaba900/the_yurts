import "server-only";

/**
 * Notification email, sent through Resend's REST API.
 *
 * Called directly with fetch rather than through the SDK — it is one POST, and
 * a dependency that exists to wrap one POST is a dependency to keep patched for
 * no reason.
 *
 * Returns false rather than throwing. The caller decides what a failed send
 * means; it must never be the reason a visitor sees an error after their
 * enquiry has already been recorded.
 */

const apiKey = process.env.RESEND_API_KEY ?? "";
const from = process.env.ENQUIRY_FROM_EMAIL ?? "";
const to = process.env.ENQUIRY_TO_EMAIL ?? "";

export const canSendEmail = Boolean(apiKey && from && to);

export async function sendEnquiryEmail({
  subject,
  body,
  replyTo,
}: {
  subject: string;
  body: string;
  replyTo?: string;
}): Promise<boolean> {
  if (!canSendEmail) return false;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: to.split(",").map((address) => address.trim()),
        subject,
        text: body,
        // So hitting reply in the inbox goes to the person who enquired.
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      console.error("[enquiry] Resend rejected the send:", response.status);
      return false;
    }

    return true;
  } catch (error) {
    console.error(
      "[enquiry] could not send notification email:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
