import { pageMetadata } from "@/lib/seo";
import { PageStub } from "@/components/site/PageStub";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Theyurts handles the information you send through this website.",
  path: "/privacy",
});

export default function Page() {
  return (
    <PageStub
      title="Privacy"
      phase="Phase 8"
      intro="This notice will be published before the enquiry forms go live. It is being drafted against what the site actually collects, rather than copied from elsewhere."
      trail={[{ label: "Privacy", href: "/privacy" }]}
    />
  );
}
