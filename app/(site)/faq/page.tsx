import { pageMetadata } from "@/lib/seo";
import { getFaqs } from "@/sanity/lib/content";
import { faqData } from "@/data/faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/page/PageHeader";
import { Prose } from "@/components/page/Prose";
import { FaqBrowser, type FaqGroup } from "@/components/page/FaqBrowser";
import { Metadata } from "@/components/primitives/Metadata";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Frequently asked",
  description:
    "Questions about how yurts are built, installed, customised and maintained — construction, materials, weather, transport, lifespan, pricing and support.",
  path: "/faq",
});

export default async function FaqPage() {
  const sanityFaqs = await getFaqs();
  const hasSanity = sanityFaqs.length > 0;

  const groups: FaqGroup[] = hasSanity
    ? Object.entries(
        sanityFaqs.reduce<Record<string, typeof sanityFaqs>>((acc, item) => {
          (acc[item.category] ??= []).push(item);
          return acc;
        }, {}),
      ).map(([title, items]) => ({
        title,
        items: items.map((item) => ({
          id: item._id,
          question: item.question,
          answer: <Prose value={item.answer} />,
        })),
      }))
    : faqData.map((group) => ({
        title: group.title,
        items: group.items.map((item) => ({
          id: `${group.title}-${item.question}`,
          question: item.question,
          answer: (
            <p className="font-sans text-body text-text-muted leading-relaxed">
              {item.answer}
            </p>
          ),
        })),
      }));

  const allItems = hasSanity
    ? sanityFaqs.map((item) => ({
        name: item.question,
        answer: item.answer
          .map((block) =>
            "children" in block && Array.isArray(block.children)
              ? block.children
                  .map((child) => ("text" in child ? child.text : ""))
                  .join("")
              : "",
          )
          .filter(Boolean)
          .join(" "),
      }))
    : faqData.flatMap((g) =>
        g.items.map((item) => ({
          name: item.question,
          answer: item.answer,
        })),
      );

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.name,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      {schema ? <JsonLd schema={schema} /> : null}

      <PageHeader
        eyebrow="Questions"
        title="What people ask."
        lead="Comprehensive answers on yurt construction, site preparation, weather resilience, customisation, and installation across India."
        trail={[{ label: "Frequently asked", href: "/faq" }]}
      />

      <div className="u-container pb-(--spacing-section-lg)">
        <FaqBrowser groups={groups} />
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Still wondering</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                Ask the awkward one.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Cost, durability, whether it suits your site at all. You will get
                a straight answer, including where the answer is that we do not
                know yet.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/contact">Book a consultation</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
