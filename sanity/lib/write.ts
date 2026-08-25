import "server-only";
import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

/**
 * Write client, used only by the enquiry action.
 *
 * Separate from the read client because it needs a token with write access, and
 * that token must never be bundled anywhere near the browser. `server-only`
 * makes importing this from a client component a build error rather than a
 * silent leak.
 */

const writeToken = process.env.SANITY_API_WRITE_TOKEN ?? "";

export const canWriteToSanity = isSanityConfigured && writeToken.length > 0;

const writeClient = canWriteToSanity
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      token: writeToken,
      useCdn: false,
    })
  : null;

/** Resolves a product slug to its document id, for the reference field. */
async function productIdForSlug(slug: string): Promise<string | null> {
  if (!writeClient || !slug) return null;
  try {
    return await writeClient.fetch<string | null>(
      `*[_type == "product" && slug.current == $slug][0]._id`,
      { slug },
    );
  } catch {
    return null;
  }
}

export async function createEnquiryDocument(fields: {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  location: string;
  message: string;
  productSlug: string;
  configuration: string;
  sourcePath: string;
}): Promise<boolean> {
  if (!writeClient) return false;

  const productId = await productIdForSlug(fields.productSlug);

  try {
    await writeClient.create({
      _type: "enquiry",
      name: fields.name,
      email: fields.email,
      phone: fields.phone || undefined,
      enquiryType: fields.enquiryType,
      location: fields.location || undefined,
      message: fields.message || undefined,
      configuration: fields.configuration || undefined,
      sourcePath: fields.sourcePath || undefined,
      submittedAt: new Date().toISOString(),
      status: "New",
      ...(productId
        ? { product: { _type: "reference", _ref: productId } }
        : {}),
    });
    return true;
  } catch (error) {
    console.error(
      "[enquiry] could not write to Sanity:",
      error instanceof Error ? error.message : error,
    );
    return false;
  }
}
