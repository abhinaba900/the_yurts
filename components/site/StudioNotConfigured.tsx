/**
 * Shown at /studio before Sanity is connected. Deliberately plain — it is an
 * instruction to a developer, not a page of the website.
 */
export function StudioNotConfigured() {
  return (
    <main className="u-container flex min-h-dvh flex-col justify-center py-24">
      <div className="u-measure">
        <p className="font-sans text-meta uppercase text-text-muted">
          Studio &middot; Not connected
        </p>
        <h1 className="mt-5 font-display text-display-md">
          Sanity is not configured yet.
        </h1>
        <p className="mt-6 font-sans text-body text-text-muted">
          The site runs without it — content sections stay empty until a dataset
          exists. To connect one:
        </p>
        <ol className="mt-8 space-y-4">
          {[
            "Create a project at sanity.io/manage.",
            "Copy .env.example to .env.local and fill in NEXT_PUBLIC_SANITY_PROJECT_ID.",
            "Add http://localhost:3000 and the production domain to the project's CORS origins, with credentials allowed.",
            "Restart the dev server and return to /studio.",
          ].map((step, i) => (
            <li
              key={step}
              className="flex gap-4 border-t border-line pt-4 font-sans text-body"
            >
              <span className="font-sans text-meta uppercase text-accent-text">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
