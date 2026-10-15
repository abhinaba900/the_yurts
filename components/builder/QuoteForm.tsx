"use client";

import { useActionState, useId, useState } from "react";
import { submitEnquiry } from "@/app/actions/enquiry";
import type { EnquiryState } from "@/lib/enquiry";
import { buyerCategories, shippingTypes } from "@/data/pricing";
import { cn } from "@/lib/cn";
import { Metadata } from "@/components/primitives/Metadata";

/**
 * The builder's own quote request: who is asking, where it is going, and how
 * they want it shipped — sent with the whole order summary.
 *
 * It posts through the site's one enquiry action, so it is stored and emailed
 * exactly like every other enquiry, and validated on the server the same way.
 * The fields a yurt quote needs and a general enquiry does not (address,
 * buyer category, shipping terms) are folded into the message, after the
 * visitor's own words and before the order summary.
 */

const initialState: EnquiryState = { status: "idle" };

const input =
  "h-11 w-full border border-line bg-surface-alt/60 px-3 font-sans text-small text-text " +
  "placeholder:text-text-muted placeholder:opacity-70 outline-none transition-colors duration-(--duration-quick) " +
  "hover:border-line-strong focus:border-accent-text aria-[invalid=true]:border-accent-text";

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p role="alert" className="mt-1.5 font-sans text-small text-accent-text">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function QuoteForm({
  configuration,
  summary,
}: {
  /** The encoded selection, so the record links back to the builder. */
  configuration: string;
  /** The order summary as plain text. */
  summary: string;
}) {
  const [state, formAction, pending] = useActionState(submitEnquiry, initialState);
  const [values, setValues] = useState({
    first: "",
    last: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pin: "",
    category: "",
    shipping: "",
    requirement: "",
    consent: true,
  });
  const [tried, setTried] = useState(false);
  const set = (key: keyof typeof values) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) =>
    setValues((current) => ({
      ...current,
      [key]: event.target.type === "checkbox" ? (event.target as HTMLInputElement).checked : event.target.value,
    }));

  const address = [values.street, values.city, values.state, values.pin, "India"]
    .filter(Boolean)
    .join(", ");

  // What the server does not check but a quote cannot do without.
  const local = {
    first: values.first.trim().length >= 2 ? undefined : "Please tell us what to call you.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
      ? undefined
      : "We need an email address to reply to.",
    street: values.street.trim() ? undefined : "We need an address to quote delivery.",
    city: values.city.trim() ? undefined : "Which city?",
    category: values.category ? undefined : "Choose the one that fits best.",
    shipping: values.shipping ? undefined : "Choose how you would like it shipped.",
  };
  const localOk = Object.values(local).every((value) => !value);
  const server = state.errors ?? {};

  const message = [
    values.requirement.trim() || "Please send me a quote for this yurt.",
    "",
    `Buyer category: ${values.category}`,
    `Shipping type: ${values.shipping}`,
    `Address: ${address}`,
    `Receive other communications: ${values.consent ? "Yes" : "No"}`,
    "",
    summary,
  ].join("\n");

  if (state.status === "success") {
    return (
      <div className="border border-accent-text p-5">
        <Metadata className="text-accent-text">Sent</Metadata>
        <p className="mt-3 font-display text-display-sm">{state.message}</p>
        <p className="mt-3 font-sans text-small text-text-muted">
          Your configuration and price summary are with us. We reply ourselves,
          usually within a working day, with a firm quote and shipping.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        setTried(true);
        if (!localOk) event.preventDefault();
      }}
      className="relative border border-line p-4 sm:p-5"
    >
      <h3 className="font-sans text-body text-text">Shipping information</h3>
      <p className="mt-1 font-sans text-small text-text-muted">
        Fill in your details and we will send you an accurate quote.
      </p>

      <input type="hidden" name="kind" value="configuration" />
      <input type="hidden" name="name" value={`${values.first} ${values.last}`.trim()} />
      <input type="hidden" name="email" value={values.email} />
      <input type="hidden" name="phone" value={values.phone ? `+91 ${values.phone}` : ""} />
      <input type="hidden" name="interest" value={values.category} />
      <input type="hidden" name="location" value={address} />
      <input type="hidden" name="message" value={message} />
      <input type="hidden" name="configuration" value={configuration} />
      <input type="hidden" name="sourcePath" value="/experiences/builder" />
      {/* Pinned inside the form: the panel scrolls, and a field positioned
          against anything outside that scroll box escapes it and stretches
          the page below the footer. */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0 [clip-path:inset(50%)]">
        <label htmlFor="quote-company">Company</label>
        <input id="quote-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <p role="alert" className="mt-4 border-l-2 border-accent-text pl-3 font-sans text-small text-text">
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Field label="First name" error={(tried ? local.first : undefined) ?? server.name}>
          {(id) => (
            <input id={id} className={input} autoComplete="given-name" value={values.first} onChange={set("first")} aria-invalid={!!server.name} />
          )}
        </Field>
        <Field label="Last name">
          {(id) => <input id={id} className={input} autoComplete="family-name" value={values.last} onChange={set("last")} />}
        </Field>
        <Field label="Email" error={(tried ? local.email : undefined) ?? server.email} className="col-span-2">
          {(id) => (
            <input id={id} type="email" className={input} autoComplete="email" value={values.email} onChange={set("email")} aria-invalid={!!server.email} />
          )}
        </Field>
        <Field label="Mobile number" error={server.phone} className="col-span-2">
          {(id) => (
            <div className="flex">
              <span className="grid h-11 place-items-center border border-r-0 border-line bg-surface-alt px-3 font-sans text-small text-text-muted">
                +91
              </span>
              <input id={id} type="tel" inputMode="tel" className={input} autoComplete="tel-national" value={values.phone} onChange={set("phone")} aria-invalid={!!server.phone} />
            </div>
          )}
        </Field>
        <Field label="Street address" error={tried ? local.street : undefined} className="col-span-2">
          {(id) => (
            <input id={id} className={input} autoComplete="street-address" value={values.street} onChange={set("street")} aria-invalid={tried && !!local.street} />
          )}
        </Field>
        <Field label="City" error={tried ? local.city : undefined}>
          {(id) => <input id={id} className={input} autoComplete="address-level2" value={values.city} onChange={set("city")} aria-invalid={tried && !!local.city} />}
        </Field>
        <Field label="State">
          {(id) => <input id={id} className={input} autoComplete="address-level1" value={values.state} onChange={set("state")} />}
        </Field>
        <Field label="PIN code">
          {(id) => <input id={id} inputMode="numeric" className={input} autoComplete="postal-code" value={values.pin} onChange={set("pin")} />}
        </Field>
        <Field label="Country">
          {(id) => <input id={id} className={cn(input, "text-text-muted")} value="India" readOnly />}
        </Field>
      </div>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
          Buyer category
        </legend>
        <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1">
          {buyerCategories.map((category) => (
            <label key={category} className="flex cursor-pointer items-center gap-2.5 py-1.5 font-sans text-small text-text">
              <input
                type="radio"
                name="buyer-category"
                checked={values.category === category}
                onChange={() => setValues((current) => ({ ...current, category }))}
                className="size-4 accent-[var(--color-accent-text)]"
              />
              {category}
            </label>
          ))}
        </div>
        {tried && local.category ? (
          <p role="alert" className="mt-1 font-sans text-small text-accent-text">{local.category}</p>
        ) : null}
      </fieldset>

      <fieldset className="mt-6 border-0 p-0">
        <legend className="font-sans text-[0.625rem] uppercase tracking-[0.12em] text-text-muted">
          Shipping type
        </legend>
        <div className="mt-2 grid gap-1.5">
          {shippingTypes.map((type) => (
            <label
              key={type.id}
              className={cn(
                "flex cursor-pointer items-start gap-2.5 border px-3 py-2 transition-colors duration-(--duration-quick)",
                values.shipping === type.id ? "border-accent-text bg-surface-alt" : "border-line hover:border-line-strong",
              )}
            >
              <input
                type="radio"
                name="shipping-type"
                checked={values.shipping === type.id}
                onChange={() => setValues((current) => ({ ...current, shipping: type.id }))}
                className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent-text)]"
              />
              <span>
                <span className="block font-sans text-small text-text">{type.label}</span>
                <span className="block font-sans text-small text-text-muted">{type.note}</span>
              </span>
            </label>
          ))}
        </div>
        {tried && local.shipping ? (
          <p role="alert" className="mt-1 font-sans text-small text-accent-text">{local.shipping}</p>
        ) : null}
      </fieldset>

      <Field label="Tell us what you're imagining" className="mt-6" error={server.message}>
        {(id) => (
          <textarea
            id={id}
            rows={3}
            className={cn(input, "h-auto py-2.5")}
            placeholder="Your site, timeline, anything this builder could not show."
            value={values.requirement}
            onChange={set("requirement")}
          />
        )}
      </Field>

      <label className="mt-4 flex cursor-pointer items-start gap-2.5 font-sans text-small text-text-muted">
        <input
          type="checkbox"
          checked={values.consent}
          onChange={set("consent")}
          className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent-text)]"
        />
        I agree to receive other communications from Theyurts.
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-3 bg-accent-text px-6 font-sans text-meta uppercase text-surface transition-colors duration-(--duration-quick) hover:bg-cream disabled:opacity-60"
      >
        {pending ? "Sending…" : "Submit for a quote"}
      </button>
    </form>
  );
}
