"use client";

import { useActionState, useMemo } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import { groups } from "@/data/configurator";
import { decodeSelection, resolveSelection, summarise } from "@/lib/configurator";
import type { EnquiryKind, EnquiryState } from "@/lib/enquiry";
import { TextField, TextArea, SelectField } from "@/components/primitives/Field";
import { Button } from "@/components/primitives/Button";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * The site's enquiry form.
 *
 * A plain <form> with a server action, so it submits and validates with
 * JavaScript disabled. `useActionState` adds the pending state and inline errors
 * on top of that rather than being what makes it work.
 *
 * Prefilled values come from the server, not from reading `window.location`, so
 * a configuration or product carried in the URL survives a no-JS submission.
 */

const initialState: EnquiryState = { status: "idle" };

const interests = [
  "Resort or hotel",
  "Glamping site",
  "Farm stay",
  "Wellness retreat",
  "Yoga or meditation space",
  "Event space",
  "Café or restaurant",
  "Private residence",
  "Studio or workspace",
  "Something else",
];

export function EnquiryForm({
  kind = "general",
  product = "",
  configuration = "",
  resource = "",
  sourcePath = "",
}: {
  kind?: EnquiryKind;
  product?: string;
  configuration?: string;
  resource?: string;
  sourcePath?: string;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);

  // Show the visitor what their configuration actually says, rather than
  // sending an opaque string on their behalf.
  const configSummary = useMemo(() => {
    if (!configuration) return null;
    const decoded = decodeSelection(configuration);
    if (Object.keys(decoded).length === 0) return null;
    return summarise(resolveSelection(decoded, groups), groups);
  }, [configuration]);

  const values = state.values ?? {};
  const errors = state.errors ?? {};

  if (state.status === "success") {
    return (
      <div className="border-t border-line pt-8">
        <Metadata className="text-accent-text">Sent</Metadata>
        <p className="mt-5 u-measure font-display text-display-md">
          {state.message}
        </p>
        <p className="mt-6 u-measure font-sans text-body text-text-muted">
          We read everything that comes in and reply to it ourselves. If it is
          urgent, say so in a follow-up and it will move up the pile.
        </p>
        <div className="mt-9 flex flex-col items-start gap-4">
          <ArrowLink href="/yurts">See the range</ArrowLink>
          <ArrowLink href="/journal">Read the Journal</ArrowLink>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      {/* Context travels with the enquiry. */}
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="product" value={product} />
      <input type="hidden" name="configuration" value={configuration} />
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="sourcePath" value={sourcePath} />

      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <div
          role="alert"
          className="mb-10 border-t-2 border-accent pt-4"
        >
          <Metadata className="text-accent-text">Not sent</Metadata>
          <p className="mt-3 u-measure font-sans text-body text-text">
            {state.message}
          </p>
        </div>
      ) : null}

      {configSummary ? (
        <div className="mb-12 border-t border-line pt-5">
          <Metadata className="text-accent-text">Your configuration</Metadata>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
            {configSummary.map((row) => (
              <div key={row.group} className="flex items-baseline gap-2">
                <dt className="font-sans text-meta uppercase text-text-muted">
                  {row.label}
                </dt>
                <dd className="font-sans text-small">{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 font-sans text-small text-text-muted">
            This is sent with your enquiry.{" "}
            <a
              href={`/experiences/builder?c=${configuration}`}
              className="border-b border-line-strong transition-colors hover:border-accent hover:text-accent-text"
            >
              Change it
            </a>
          </p>
        </div>
      ) : null}

      {product ? (
        <div className="mb-12 border-t border-line pt-5">
          <Metadata className="text-accent-text">About</Metadata>
          <p className="mt-3 font-display text-display-sm capitalize">
            {product.replace(/-/g, " ")}
          </p>
        </div>
      ) : null}

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        <TextField
          id="name"
          label="Name"
          autoComplete="name"
          required
          placeholder="Your full name"
          defaultValue={values.name ?? ""}
          error={errors.name}
        />
        <TextField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          defaultValue={values.email ?? ""}
          error={errors.email}
        />
        <TextField
          id="phone"
          label="Phone"
          type="tel"
          autoComplete="tel"
          optional
          placeholder="Including country code"
          defaultValue={values.phone ?? ""}
          error={errors.phone}
        />

        {kind === "brochure" ? null : (
          <SelectField
            id="interest"
            label="What it is for"
            defaultValue={values.interest ?? ""}
          >
            <option value="" className="bg-surface-alt text-text-muted">
              Select one
            </option>
            {interests.map((option) => (
              <option key={option} value={option} className="bg-surface-alt text-text">
                {option}
              </option>
            ))}
          </SelectField>
        )}

        <TextField
          id="location"
          label="Site location"
          className="md:col-span-2"
          optional={kind !== "consultation"}
          required={kind === "consultation"}
          placeholder="District and state — roughly is fine"
          defaultValue={values.location ?? ""}
          error={errors.location}
        />

        {kind === "brochure" ? null : (
          <TextArea
            id="message"
            label="About the project"
            className="md:col-span-2"
            rows={6}
            required
            placeholder="The land, the access, how many structures, roughly when."
            hint="Anything you already know helps. Nothing has to be settled."
            defaultValue={values.message ?? ""}
            error={errors.message}
          />
        )}

        <div className="md:col-span-2">
          <Button variant="solid" type="submit" disabled={pending}>
            {pending ? "Sending…" : submitLabel(kind)}
          </Button>
          <p className="mt-6 u-measure font-sans text-small text-text-muted">
            We use what you send here to reply to you and nothing else. No list,
            no newsletter unless you ask for one.
          </p>
        </div>
      </div>
    </form>
  );
}

function submitLabel(kind: EnquiryKind) {
  switch (kind) {
    case "quote":
      return "Request a quote";
    case "consultation":
      return "Book a consultation";
    case "brochure":
      return "Send me the document";
    case "configuration":
      return "Send this configuration";
    default:
      return "Send enquiry";
  }
}
