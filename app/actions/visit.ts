"use server";

import { formatVisit, formatVisitDate, parseVisit, type VisitState } from "@/lib/visit";
import { canWriteToSanity, createEnquiryDocument } from "@/sanity/lib/write";
import { canSendEmail, sendEnquiryEmail } from "@/lib/email";

/**
 * Handles visit requests from /experience-centre.
 *
 * Same rule as the enquiry action: success is only reported when the request
 * actually landed in the Studio or an inbox. It goes through the same two
 * channels, so connecting SANITY_API_WRITE_TOKEN or the Resend variables for
 * enquiries connects this form too. See .env.example.
 *
 * INTEGRATION POINT — this records a request; the team confirms the time by
 * hand. To connect a real scheduling system later, call it here once the
 * request is validated, and only then change the confirmation copy to say a
 * visit is booked.
 */
export async function submitVisitRequest(
  _previous: VisitState,
  formData: FormData,
): Promise<VisitState> {
  // Honeypot — see app/actions/enquiry.ts.
  if (typeof formData.get("company") === "string" && formData.get("company")) {
    return { status: "success", message: "Thank you — your visit request is with us." };
  }

  const { data, errors } = parseVisit(formData);

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Some details need another look.",
      errors,
      values: data,
    };
  }

  const sourcePath = "/experience-centre";
  const summary = formatVisit(data, sourcePath);

  const [stored, emailed] = await Promise.all([
    createEnquiryDocument({
      name: data.name,
      email: data.email,
      phone: data.phone,
      enquiryType: "Experience Centre visit",
      location: "",
      message: summary,
      productSlug: "",
      configuration: "",
      sourcePath,
    }),
    sendEnquiryEmail({
      subject: `Experience Centre visit request — ${data.name} — ${formatVisitDate(data.date)}`,
      body: summary,
      replyTo: data.email || undefined,
    }),
  ]);

  if (stored || emailed) {
    return {
      status: "success",
      message: "Thank you — your visit request is with us.",
      values: { date: data.date, time: data.time },
    };
  }

  const nothingConfigured = !canWriteToSanity && !canSendEmail;

  return {
    status: "error",
    values: data,
    message: nothingConfigured
      ? "This form cannot send yet — the site is not connected to its inbox. Nothing has been recorded, so please call us instead of waiting for a reply."
      : "Something went wrong sending that, and we would rather tell you than pretend otherwise. Please try again, or call us.",
  };
}
