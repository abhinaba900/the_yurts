import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getApplications } from "@/sanity/lib/content";
import { applicationsFallback } from "@/data/applications";
import { PageHeader } from "@/components/page/PageHeader";
import { CmsImage } from "@/components/page/CmsImage";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { ArrowLink } from "@/components/primitives/ArrowLink";
import { Section } from "@/components/primitives/Section";

import { ApplicationsShowcase } from "@/components/applications/ApplicationsShowcase";

export const metadata = pageMetadata({
  title: "Yurt Uses: Resorts, Glamping and Retreats",
  description:
    "Where a yurt works — resort rooms, glamping units, wellness retreats, farm stays, event spaces, cafés, studios and private homes on land across India.",
  path: "/applications",
});

export default async function ApplicationsPage() {
  const cms = await getApplications();
  const useCms = cms.length > 0;

  const entries = useCms
    ? cms.map((item) => ({
        name: item.title,
        slug: item.slug,
        line: item.line,
        body: item.summary,
        heroImage: item.heroImage,
        media: undefined,
        considerations: undefined,
      }))
    : applicationsFallback.map((item) => ({
        name: item.name,
        slug: item.slug,
        line: item.line,
        body: item.body,
        heroImage: null,
        media: item.media,
        considerations: item.considerations,
      }));

  return (
    <>
      <PageHeader
        eyebrow="Applications"
        title="What people build with them."
        lead="A yurt changes depending on what has to happen inside it. These are the uses we build for, and what each one actually has to solve."
        aside={
          <div className="border-t border-line pt-5">
            <p className="font-sans text-small text-text-muted">
              From commercial high-rate keys to off-grid wellness sanctuaries and event pavilions.
            </p>
            <div className="mt-6">
              <ArrowLink href="/enquire">Discuss your site requirements</ArrowLink>
            </div>
          </div>
        }
      />

      <div className="u-container pb-(--spacing-section-lg)">
        <ApplicationsShowcase entries={entries} />
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Something else</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                Not on the list?
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                These are the uses that come up most. They are not the only ones a
                circular room is good for — tell us what you have in mind.
              </p>
              <div className="mt-9 flex flex-col items-start gap-4">
                <ArrowLink href="/enquire">Start an enquiry</ArrowLink>
                <ArrowLink href="/yurts">See the range</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
