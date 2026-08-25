"""One-off generator for Phase 1 route stubs. Safe to delete once every route
has real content. Run: python scripts/gen-stubs.py"""

import json
import os

ROUTES = [
    dict(
        path="yurts", title="Yurts", phase="Phase 4",
        meta_title="Yurts",
        desc="The Theyurts range — yurts designed and manufactured in India for resorts, glamping sites, retreats, farm stays and private land.",
        intro="The range, with sizes, plans, materials and specifications for each. Product information is being prepared with the workshop and will be published here rather than approximated.",
        covers=["The range", "Sizes and floor plans", "Specifications", "Materials", "Customisation options", "Request a quote"],
        trail=None,
    ),
    dict(
        path="applications", title="Applications", phase="Phase 4",
        meta_title="Applications",
        desc="How yurts are used — resort accommodation, glamping, farm stays, wellness retreats, yoga spaces, eco tourism, event spaces, cafes and private homes.",
        intro="A yurt changes depending on what you are building. Each application is written as its own case for the people who commission it, not as a card in a grid.",
        covers=["Resorts", "Glamping", "Farm stays", "Wellness retreats", "Yoga and meditation", "Eco tourism", "Event spaces", "Cafes and restaurants", "Private homes", "Studios and workspaces"],
        trail=None,
    ),
    dict(
        path="experiences", title="Experiences", phase="Phases 6 and 7",
        meta_title="Experiences",
        desc="Configure a yurt in 3D and walk through a finished interior in 360 degrees.",
        intro="Two ways to see a yurt before it exists: a configurator that builds one to your specification, and a 360 walkthrough of a finished interior. Both are being built around assets currently in production.",
        covers=["3D yurt builder", "Size, exterior and roof", "Doors, windows and flooring", "Interior packages", "Configuration summary and enquiry", "VR and 360 walkthrough"],
        trail=None,
    ),
    dict(
        path="projects", title="Projects", phase="Phase 5",
        meta_title="Projects",
        desc="Gallery and inspiration. Completed Theyurts installations will be published here as they are finished.",
        intro="Theyurts is a new company. Rather than dress up other people's work as our own, this page opens as a gallery of reference and inspiration, and becomes a record of completed installations as they are handed over.",
        covers=["Gallery and inspiration", "Installations, once complete", "Location and type", "Size and configuration", "Photography and video", "Project notes"],
        trail=None,
    ),
    dict(
        path="journal", title="Journal", phase="Phase 5",
        meta_title="Journal",
        desc="Writing on yurts, glamping, hospitality, wellness, farm stays, eco tourism, architecture and sustainable building in India.",
        intro="Notes on building with yurts, and on the businesses people build around them. Written to be useful to someone deciding whether this works on their land.",
        covers=["Yurts and construction", "Glamping and hospitality", "Wellness and retreats", "Farm stays and eco tourism", "Architecture and design", "Business and industry"],
        trail=None,
    ),
    dict(
        path="about", title="About", phase="Phase 4",
        meta_title="About",
        desc="Theyurts designs, manufactures and installs premium yurts across India.",
        intro="Who we are, how we build, and what we are trying to make. Company details, the workshop, materials and the people involved are being written with the founders.",
        covers=["The company", "How we build", "Materials", "Craftsmanship", "Quality", "Sustainability", "Team"],
        trail=None,
    ),
    dict(
        path="process", title="Build process", phase="Phase 4",
        meta_title="Build process",
        desc="How a Theyurts yurt is made — design, materials, manufacturing, customisation, quality, transport, installation and handover.",
        intro="Eight stages, from a first conversation about a site to the day it is handed over. Documented with photography from the workshop as the first structures are built.",
        covers=["01 Design", "02 Material selection", "03 Manufacturing", "04 Customisation", "05 Quality check", "06 Transportation", "07 Installation", "08 Handover"],
        trail=[("Build process", "/process")],
    ),
    dict(
        path="why-theyurts", title="Why a yurt", phase="Phase 4",
        meta_title="Why a yurt",
        desc="Modular construction, faster installation, customisation and relocatability — what a yurt offers compared with conventional building.",
        intro="The honest case for building this way, and the situations where it is the wrong answer. Technical claims will be published only once they come from the workshop.",
        covers=["Modular construction", "Installation time", "Customisation", "Weather and insulation", "Durability", "Relocatability", "Support across India"],
        trail=[("Why a yurt", "/why-theyurts")],
    ),
    dict(
        path="glamping-business", title="Starting a glamping business", phase="Phase 4",
        meta_title="Starting a glamping business",
        desc="Land, site planning, guest experience and expansion — what to consider before building glamping accommodation in India.",
        intro="Written for landowners and operators weighing up a first site. What to look at, what to plan for, and what to ask before committing. No projections, no promised returns.",
        covers=["Land and access", "Site planning", "Investment considerations", "Guest experience", "Operations", "Expanding a site", "Book a consultation"],
        trail=[("Starting a glamping business", "/glamping-business")],
    ),
    dict(
        path="resources", title="Resources", phase="Phase 5",
        meta_title="Resources",
        desc="Catalogues, specifications, brochures and guides for yurts and glamping structures.",
        intro="Documents to download once they are finalised — the product catalogue, technical specifications, and guides for buyers and operators.",
        covers=["Product catalogue", "Specifications", "Brochures", "Yurt buyer's guide", "Glamping business guide", "Technical documents"],
        trail=[("Resources", "/resources")],
    ),
    dict(
        path="faq", title="Frequently asked", phase="Phase 5",
        meta_title="Frequently asked",
        desc="Questions about construction, installation, customisation, materials, maintenance, weather, delivery and support.",
        intro="Answers to what people actually ask. Every answer here will come from the workshop — the page stays short until it can be accurate.",
        covers=["Construction", "Installation", "Pricing", "Customisation", "Materials", "Maintenance and lifespan", "Weather", "Transport and delivery", "Warranty and support"],
        trail=[("Frequently asked", "/faq")],
    ),
    dict(
        path="contact", title="Contact", phase="Phase 8",
        meta_title="Contact",
        desc="Speak to Theyurts about yurts, glamping structures and accommodation projects anywhere in India.",
        intro="Phone, email, WhatsApp and the workshop address, plus consultation booking. Contact details are published here as soon as they are confirmed.",
        covers=["General enquiry", "Book a consultation", "WhatsApp", "Phone and email", "Workshop location"],
        trail=None,
    ),
    dict(
        path="enquire", title="Enquire", phase="Phase 8",
        meta_title="Enquire",
        desc="Tell Theyurts about your site and your project, and we will come back to you.",
        intro="Where the land is, what you want to put on it, and roughly when. That is enough to start. The full enquiry form is being built.",
        covers=["Your project", "Site location", "Type and scale", "Timeline", "Request a quote"],
        trail=None,
    ),
    dict(
        path="privacy", title="Privacy", phase="Phase 8",
        meta_title="Privacy",
        desc="How Theyurts handles the information you send through this website.",
        intro="This notice will be published before the enquiry forms go live. It is being drafted against what the site actually collects, rather than copied from elsewhere.",
        covers=None,
        trail=[("Privacy", "/privacy")],
    ),
    dict(
        path="terms", title="Terms", phase="Phase 8",
        meta_title="Terms",
        desc="Terms of use for the Theyurts website.",
        intro="To be published alongside the privacy notice.",
        covers=None,
        trail=[("Terms", "/terms")],
    ),
]

TEMPLATE = """import {{ pageMetadata }} from "@/lib/seo";
import {{ PageStub }} from "@/components/site/PageStub";

export const metadata = pageMetadata({{
  title: {meta_title},
  description: {desc},
  path: "/{path}",
}});

export default function Page() {{
  return (
    <PageStub
      title={title}
      phase={phase}
      intro={intro}
{covers_prop}{trail_prop}    />
  );
}}
"""


def j(value):
    """JSON-encodes to a valid TS string literal — double quoted, escapes handled."""
    return json.dumps(value, ensure_ascii=False)


NL = chr(10)

for r in ROUTES:
    covers_prop = ""
    if r["covers"]:
        inner = NL.join(f"        {j(item)}," for item in r["covers"])
        covers_prop = f"      covers={{[{NL}{inner}{NL}      ]}}{NL}"

    trail_prop = ""
    if r["trail"]:
        items = ", ".join(
            f"{{ label: {j(label)}, href: {j(href)} }}" for label, href in r["trail"]
        )
        trail_prop = f"      trail={{[{items}]}}{NL}"

    body = TEMPLATE.format(
        meta_title=j(r["meta_title"]),
        desc=j(r["desc"]),
        path=r["path"],
        title=j(r["title"]),
        phase=j(r["phase"]),
        intro=j(r["intro"]),
        covers_prop=covers_prop,
        trail_prop=trail_prop,
    )

    d = os.path.join("app", r["path"])
    os.makedirs(d, exist_ok=True)
    with open(os.path.join(d, "page.tsx"), "w", encoding="utf-8", newline=NL) as f:
        f.write(body)
    print("wrote", d)
