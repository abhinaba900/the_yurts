"use client";

import { useActionState, useEffect, useRef, useSyncExternalStore } from "react";
import { submitVisitRequest } from "@/app/actions/visit";
import { visitPurposes } from "@/data/experienceCentre";
import { formatVisitDate, timeOptions, todayInIndia, type VisitState } from "@/lib/visit";
import { TextField, TextArea, SelectField } from "@/components/primitives/Field";
import { Button } from "@/components/primitives/Button";
import { Metadata } from "@/components/primitives/Metadata";
import { ArrowLink } from "@/components/primitives/ArrowLink";

/**
 * The Experience Centre visit request.
 *
 * Built the same way as the site's EnquiryForm: a plain <form> posting to a
 * server action, so it validates and submits without JavaScript, with
 * `useActionState` adding pending state and inline errors on top.
 *
 * It records a request — the copy never says "booked", because nothing is
 * until someone at the centre confirms it.
 */

const initialState: VisitState = { status: "idle" };

const noopSubscribe = () => () => {};

export function VisitRequestForm({
  phone,
  confirmation,
}: {
  /** The number to call instead — the site's published contact number. */
  phone: string | null;
  confirmation: string;
}) {
  const [state, formAction, pending] = useActionState(submitVisitRequest, initialState);

  // A fast double click can submit twice before `pending` has re-rendered the
  // button as disabled. The ref closes that gap; it reopens when a result
  // comes back.
  const inFlight = useRef(false);
  useEffect(() => {
    inFlight.current = false;
  }, [state]);

  // Read on the client so the earliest selectable day is today, not the day
  // the page was built. The server checks the same rule regardless.
  const minDate = useSyncExternalStore(noopSubscribe, () => todayInIndia(), () => undefined);

  // Move focus to the outcome so it is announced and the visitor is not left
  // at a button that no longer exists.
  const outcomeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "idle") outcomeRef.current?.focus();
  }, [state]);

  const values = state.values ?? {};
  const errors = state.errors ?? {};
  const tel = phone ? `tel:${phone.replace(/\s/g, "")}` : null;

  if (state.status === "success") {
    return (
      <div
        ref={outcomeRef}
        tabIndex={-1}
        role="status"
        className="border-t border-line pt-8 outline-none"
      >
        <Metadata className="text-accent-text">Request received</Metadata>
        <p className="mt-5 u-measure font-display text-display-md">{state.message}</p>
        {values.date ? (
          <p className="mt-6 u-measure font-sans text-body text-text">
            You asked for {formatVisitDate(values.date)}
            {values.time ? `, ${values.time.toLowerCase()}` : ""}.
          </p>
        ) : null}
        <p className="mt-3 u-measure font-sans text-body text-text-muted">
          {confirmation}
        </p>
        <div className="mt-9 flex flex-col items-start gap-4">
          <ArrowLink href="/yurts">See the range before you come</ArrowLink>
          <ArrowLink href="/floor-plans">Browse floor plans</ArrowLink>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      onSubmit={(event) => {
        if (inFlight.current) event.preventDefault();
        else inFlight.current = true;
      }}
      aria-describedby="visit-form-note"
    >
      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="visit-company">Company</label>
        <input id="visit-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {state.status === "error" && state.message ? (
        <div
          ref={outcomeRef}
          tabIndex={-1}
          role="alert"
          className="mb-10 border-t-2 border-accent pt-4 outline-none"
        >
          <Metadata className="text-accent-text">Not sent</Metadata>
          <p className="mt-3 u-measure font-sans text-body text-text">{state.message}</p>
          {tel && !state.errors ? (
            <a
              href={tel}
              className="mt-3 inline-block border-b border-line-strong font-sans text-body text-text transition-colors hover:border-accent hover:text-accent-text"
            >
              {phone}
            </a>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
        <TextField
          id="name"
          label="Full name"
          autoComplete="name"
          required
          aria-required
          placeholder="Your full name"
          defaultValue={values.name ?? ""}
          error={errors.name}
        />
        <TextField
          id="phone"
          label="Phone number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          aria-required
          placeholder="Including country code"
          hint="We'll call to confirm a time."
          defaultValue={values.phone ?? ""}
          error={errors.phone}
        />
        <TextField
          id="email"
          label="Email address"
          type="email"
          autoComplete="email"
          optional
          placeholder="you@company.com"
          defaultValue={values.email ?? ""}
          error={errors.email}
          className="md:col-span-2"
        />
        <TextField
          id="date"
          label="Preferred date"
          type="date"
          required
          aria-required
          min={minDate}
          defaultValue={values.date ?? ""}
          error={errors.date}
          hint="A preference — we'll confirm what's possible."
        />
        <SelectField
          id="time"
          label="Preferred time"
          optional
          defaultValue={values.time ?? ""}
        >
          <option value="" className="bg-surface-alt text-text-muted">
            No preference
          </option>
          {timeOptions.map((option) => (
            <option key={option} value={option} className="bg-surface-alt text-text">
              {option}
            </option>
          ))}
        </SelectField>
        <SelectField
          id="purpose"
          label="What brings you to Theyurts?"
          optional
          className="md:col-span-2"
          defaultValue={values.purpose ?? ""}
        >
          <option value="" className="bg-surface-alt text-text-muted">
            Select one
          </option>
          {visitPurposes.map((option) => (
            <option key={option} value={option} className="bg-surface-alt text-text">
              {option}
            </option>
          ))}
        </SelectField>
        <TextArea
          id="details"
          label="Additional details"
          optional
          className="md:col-span-2"
          rows={5}
          placeholder="Your site, how many structures, who will come with you."
          defaultValue={values.details ?? ""}
        />

        <div className="md:col-span-2">
          <Button
            variant="solid"
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className="w-full sm:w-auto"
          >
            {pending ? "Sending…" : "Request a visit"}
          </Button>
          <p
            id="visit-form-note"
            className="mt-6 u-measure font-sans text-small text-text-muted"
          >
            {confirmation} We use what you send only to arrange your visit.
          </p>
        </div>
      </div>
    </form>
  );
}
