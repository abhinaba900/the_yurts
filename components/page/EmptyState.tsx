import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * Shown where content will go but does not exist yet.
 *
 * Says plainly what is missing and offers the reader the thing they would have
 * done next anyway. It is not an error, and it does not apologise — a new
 * company having no case studies is a fact, not a fault.
 */
export function EmptyState({
  label,
  title,
  body,
  action,
}: {
  label: string;
  title: string;
  body: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="border-t border-line py-(--spacing-block-lg)">
      <div className="u-grid">
        <div className="col-span-4 md:col-span-6 lg:col-span-5">
          <Metadata className="text-accent-text">{label}</Metadata>
          <p className="mt-5 font-display text-display-md">{title}</p>
        </div>
        <div className="col-span-4 mt-6 md:col-span-6 lg:col-span-5 lg:col-start-7 lg:mt-2">
          <p className="u-measure font-sans text-body text-text-muted">{body}</p>
          {action ? (
            <div className="mt-8">
              <ArrowLink href={action.href}>{action.label}</ArrowLink>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
