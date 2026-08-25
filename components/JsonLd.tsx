/**
 * Renders a JSON-LD block. Server component — no client-side cost.
 * Schemas are built from site config, never from user input.
 */
export function JsonLd({ schema }: { schema: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
