import { pageMetadata } from "@/lib/seo";
import { getResources } from "@/sanity/lib/content";
import { formatBytes } from "@/lib/format";
import { PageHeader } from "@/components/page/PageHeader";
import { CmsImage } from "@/components/page/CmsImage";
import { EmptyState } from "@/components/page/EmptyState";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Resources",
  description:
    "Catalogues, specifications, brochures and guides for yurts, glamping structures and outdoor hospitality projects.",
  path: "/resources",
});

/** What the client has said will live here, shown while the files are prepared. */
const planned = [
  { title: "Product catalogue", note: "The full range with specifications." },
  { title: "Technical specifications", note: "Structural and material detail per yurt." },
  { title: "Yurt buyer's guide", note: "What to work out before commissioning one." },
  { title: "Glamping business guide", note: "Land, site planning and phasing a first site." },
];

export default async function ResourcesPage() {
  const resources = await getResources();

  const grouped = Object.entries(
    resources.reduce<Record<string, typeof resources>>((acc, item) => {
      (acc[item.category ?? "Other"] ??= []).push(item);
      return acc;
    }, {}),
  );

  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Documents to take away."
        lead="Catalogues, specifications and guides, as PDFs. Some ask for an email first so we know who to follow up with."
        trail={[{ label: "Resources", href: "/resources" }]}
      />

      <div className="u-container pb-(--spacing-section-lg)">
        {resources.length > 0 ? (
          <div className="space-y-16">
            {grouped.map(([category, items]) => (
              <section key={category}>
                <div className="u-grid">
                  <div className="col-span-4 md:col-span-6 lg:col-span-3">
                    <Metadata as="h2" className="text-accent-text">
                      {category}
                    </Metadata>
                  </div>

                  <ul className="col-span-4 mt-6 md:col-span-6 lg:col-span-8 lg:col-start-5 lg:mt-0">
                    {items.map((item) => (
                      <Reveal
                        key={item._id}
                        kind="up"
                        as="li"
                        className="border-t border-line last:border-b"
                      >
                        <a
                          id={item.slug}
                          href={
                            item.gated
                              ? `/enquire?resource=${item.slug}`
                              : (item.fileUrl ?? "#")
                          }
                          {...(item.gated ? {} : { download: true })}
                          className="group flex items-start gap-6 py-6"
                        >
                          {item.coverImage ? (
                            <span className="hidden w-24 shrink-0 sm:block">
                              <CmsImage
                                image={item.coverImage}
                                ratio="portrait"
                                sizes="96px"
                                width={240}
                              />
                            </span>
                          ) : null}

                          <span className="flex-1">
                            <span className="block font-display text-display-sm">
                              {item.title}
                            </span>
                            {item.description ? (
                              <span className="mt-2 block u-measure font-sans text-small text-text-muted">
                                {item.description}
                              </span>
                            ) : null}
                          </span>

                          <span className="shrink-0 pt-1 text-right">
                            <span className="block font-sans text-meta uppercase text-text-muted transition-colors duration-(--duration-quick) group-hover:text-accent-text">
                              {item.gated ? "Request" : "Download"}
                            </span>
                            <span className="mt-1 block font-sans text-meta uppercase text-text-muted opacity-70">
                              {item.gated ? "PDF" : `PDF · ${formatBytes(item.fileSize)}`}
                            </span>
                          </span>
                        </a>
                      </Reveal>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <>
            <EmptyState
              label="Nothing to download yet"
              title="The documents are being written."
              body="A catalogue is only useful once the specifications in it are real. Rather than publish a brochure of estimates, we are waiting until the figures come from the workshop — and in the meantime you can get any of it from us directly."
              action={{ href: "/enquire", label: "Ask for what you need" }}
            />

            <div className="mt-16">
              <Metadata className="text-accent-text">In preparation</Metadata>
              <ul className="mt-6">
                {planned.map((item, i) => (
                  <li
                    key={item.title}
                    className="flex items-baseline gap-5 border-t border-line py-5 last:border-b"
                  >
                    <span className="font-sans text-meta uppercase text-text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-display-sm">
                        {item.title}
                      </span>
                      <span className="mt-1 block font-sans text-small text-text-muted">
                        {item.note}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>

      <Section surface="alt" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-5">
              <Metadata className="text-accent-text">Rather just ask</Metadata>
              <p className="mt-5 font-display text-display-md">
                Tell us what you need and we will send it.
              </p>
            </div>
            <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
              <p className="u-measure font-sans text-body text-text-muted">
                A drawing, a material detail, a figure for a feasibility study.
                If it exists, you can have it; if it does not, you will be told
                that rather than sent an approximation.
              </p>
              <div className="mt-8">
                <ArrowLink href="/enquire">Ask for a document</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
