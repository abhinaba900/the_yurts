import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/site/PageStub";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description: "Terms of use for the Theyurts website.",
  path: "/terms",
});

export default function Page() {
  return (
    <PageStub
      title="Terms"
      phase="Phase 8"
      intro="To be published alongside the privacy notice."
      trail={[{ label: "Terms", href: "/terms" }]}
    />
  );
}
