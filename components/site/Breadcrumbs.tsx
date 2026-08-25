import Link from "next/link";
import { breadcrumbSchema } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";

export type Crumb = { label: string; href: string };

/**
 * Breadcrumbs. Used on pages that sit below the top level — product detail,
 * application detail, journal entries. Emits BreadcrumbList schema alongside.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const full: Crumb[] = [{ label: "Home", href: "/" }, ...trail];

  return (
    <>
      <JsonLd schema={breadcrumbSchema(full)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {full.map((crumb, i) => {
            const last = i === full.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-3">
                {last ? (
                  <span
                    aria-current="page"
                    className="font-sans text-meta uppercase text-text-muted"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="u-tap font-sans text-meta uppercase text-text transition-colors duration-(--duration-quick) hover:text-accent-text"
                  >
                    {crumb.label}
                  </Link>
                )}
                {last ? null : (
                  <span aria-hidden className="text-text-muted opacity-50">
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
