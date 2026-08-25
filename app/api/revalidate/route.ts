import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → cache revalidation.
 *
 * Publishing in the Studio revalidates only the tags for the document that
 * changed, so the site updates in seconds without a rebuild and without putting
 * the Sanity API in front of every visitor.
 *
 * Setup (Sanity → API → Webhooks):
 *   URL      POST https://theyurts.in/api/revalidate
 *   Dataset  production
 *   Trigger  Create, Update, Delete
 *   Payload  { "_type": _type, "slug": slug.current }
 *   Secret   must match SANITY_REVALIDATE_SECRET
 *
 * The signature is verified before anything is revalidated. Without a secret set
 * the route refuses every request rather than allowing unauthenticated cache
 * busting.
 */

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

type Payload = { _type?: string; slug?: string };

export async function POST(request: NextRequest) {
  if (!SECRET) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not set." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<Payload>(request, SECRET);

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature." }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "No document type in payload." }, { status: 400 });
    }

    const tags = [body._type];
    if (body.slug) tags.push(`${body._type}:${body.slug}`);

    // Next 16 requires a cache-life argument. `{ expire: 0 }` purges
    // immediately rather than allowing a stale-while-revalidate window — a
    // correction published in the Studio should be live, not served stale.
    for (const tag of tags) revalidateTag(tag, { expire: 0 });

    return NextResponse.json({ revalidated: true, tags });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[revalidate]", message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
