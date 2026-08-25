import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { getProjects } from "@/sanity/lib/content";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/page/PageHeader";
import { CmsImage } from "@/components/page/CmsImage";
import { Media } from "@/components/primitives/Media";
import { Metadata } from "@/components/primitives/Metadata";
import { Reveal } from "@/components/primitives/Reveal";
import { Section } from "@/components/primitives/Section";
import { ArrowLink } from "@/components/primitives/ArrowLink";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Completed Theyurts installations, published as they are handed over — location, type, configuration and photography.",
  path: "/projects",
});

/**
 * Projects.
 *
 * Theyurts has not completed an installation yet, so with no published projects
 * this page is honest about that and functions as reference and inspiration.
 * The layout is the one it will use as a project index, so it becomes case
 * studies without being redesigned — and without ever having implied that
 * somebody else's work was ours.
 */
export default async function ProjectsPage() {
  const projects = await getProjects();
  const hasProjects = projects.length > 0;

  return (
    <>
      <PageHeader
        eyebrow={hasProjects ? "Projects" : "Gallery"}
        title={hasProjects ? "Where they went." : "Reference, for now."}
        lead={
          hasProjects
            ? "Installations we have completed, with the site, the configuration and what it was built for."
            : "We are a new company and have not finished an installation yet. When we have, this page becomes the record of them. Until then it is what we are working towards."
        }
        aside={
          hasProjects ? undefined : (
            <div className="border-t border-line pt-5">
              <p className="font-sans text-small text-text-muted">
                Plenty of sites will show you photographs of yurts they had no
                part in building. We would rather show you an empty page and
                then fill it with our own.
              </p>
              <div className="mt-6">
                <ArrowLink href="/enquire">Be one of the first</ArrowLink>
              </div>
            </div>
          )
        }
      />

      <div className="u-container pb-(--spacing-section-lg)">
        {hasProjects ? (
          <ul className="u-grid gap-y-14">
            {projects.map((project, i) => (
              <Reveal
                key={project._id}
                kind="media"
                delay={Math.min(i, 4) * 0.05}
                as="li"
                className={
                  i % 3 === 0
                    ? "col-span-4 md:col-span-6 lg:col-span-8"
                    : "col-span-4 md:col-span-3 lg:col-span-4"
                }
              >
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="overflow-hidden">
                    <CmsImage
                      image={project.heroImage}
                      ratio={i % 3 === 0 ? "landscape" : "portrait"}
                      sizes={
                        i % 3 === 0
                          ? "(min-width: 1024px) 64vw, 100vw"
                          : "(min-width: 1024px) 32vw, 45vw"
                      }
                      pendingLabel={`${project.slug}.jpg`}
                      className="transition-transform duration-(--duration-slow) ease-(--ease-out-soft) group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                    <h2 className="font-display text-display-sm">{project.title}</h2>
                    {project.completedAt ? (
                      <span className="shrink-0 font-sans text-meta uppercase text-text-muted">
                        {new Date(project.completedAt).getFullYear()}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-sans text-meta uppercase text-text-muted">
                    {[project.projectType, project.location].filter(Boolean).join(" · ")}
                  </p>
                </Link>
              </Reveal>
            ))}
          </ul>
        ) : (
          <>
            <div className="u-grid gap-y-10">
              <Reveal kind="media" className="col-span-4 md:col-span-6 lg:col-span-7">
                <Media id="home.gallery-1" sizes="(min-width: 1024px) 56vw, 100vw" />
              </Reveal>
              <Reveal
                kind="media"
                delay={0.08}
                className="col-span-2 md:col-span-3 lg:col-span-4 lg:col-start-9 lg:mt-20"
              >
                <Media id="home.gallery-2" sizes="(min-width: 1024px) 32vw, 45vw" />
              </Reveal>
              <Reveal
                kind="media"
                delay={0.12}
                className="col-span-2 md:col-span-3 lg:col-span-3 lg:col-start-3"
              >
                <Media id="home.gallery-3" sizes="(min-width: 1024px) 24vw, 45vw" />
              </Reveal>
              <Reveal
                kind="media"
                delay={0.16}
                className="col-span-4 md:col-span-6 lg:col-span-5 lg:col-start-7"
              >
                <Media id="home.range-event" sizes="(min-width: 1024px) 40vw, 100vw" />
              </Reveal>
            </div>

            <div className="mt-20 border-t border-line pt-10">
              <div className="u-grid">
                <div className="col-span-4 md:col-span-6 lg:col-span-5">
                  <Metadata className="text-accent-text">What goes here</Metadata>
                  <p className="mt-5 font-display text-display-md">
                    Each installation, in full.
                  </p>
                </div>
                <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-6 lg:col-start-7 lg:mt-2">
                  <ul className="grid gap-x-10 sm:grid-cols-2">
                    {[
                      "Location and site",
                      "Type and configuration",
                      "Size and specification",
                      "Photography and video",
                      "Floor plans",
                      "What the client wanted",
                    ].map((item) => (
                      <li
                        key={item}
                        className="border-t border-line py-3 font-sans text-small text-text-muted"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-8 u-measure font-sans text-body text-text-muted">
                    Published with the client&rsquo;s agreement, once the
                    structure is standing and has been through a season.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <Section tone="light" space="lg">
        <div className="u-container">
          <div className="u-grid">
            <div className="col-span-4 md:col-span-6 lg:col-span-6">
              <Metadata className="text-accent-text">Early</Metadata>
              <p className="mt-5 font-display text-display-lg u-optical-left">
                The first projects matter most.
              </p>
            </div>
            <div className="col-span-4 mt-8 md:col-span-6 lg:col-span-5 lg:col-start-8 lg:mt-3">
              <p className="u-measure font-sans text-lead text-text-muted">
                Being early means we have time for your site, and every structure
                we put up now is one we will be judged on for years.
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
