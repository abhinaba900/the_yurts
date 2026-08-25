import { cn } from "@/lib/cn";

/**
 * Form fields are hairlines, not boxes. A tracked label sits above the rule;
 * the rule thickens to the accent on focus. Nothing is enclosed.
 */

const control =
  "w-full bg-transparent border-0 border-b border-line pb-3 pt-2 " +
  "font-sans text-lead text-text placeholder:text-text-muted placeholder:opacity-60 " +
  "outline-none transition-colors duration-(--duration-quick) ease-(--ease-out-soft) " +
  "hover:border-line-strong focus:border-accent " +
  "aria-[invalid=true]:border-accent";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
};

function FieldShell({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("group", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="font-sans text-meta uppercase text-text-muted"
        >
          {label}
        </label>
        {optional ? (
          <span className="font-sans text-meta uppercase text-text-muted opacity-60">
            Optional
          </span>
        ) : null}
      </div>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 font-sans text-small text-accent-text"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-2 font-sans text-small text-text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type BaseProps = Omit<FieldShellProps, "children">;

export function TextField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  ...props
}: BaseProps & React.ComponentPropsWithoutRef<"input">) {
  return (
    <FieldShell {...{ id, label, hint, error, optional, className }}>
      <input
        id={id}
        name={props.name ?? id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={control}
        {...props}
      />
    </FieldShell>
  );
}

export function TextArea({
  id,
  label,
  hint,
  error,
  optional,
  className,
  rows = 4,
  ...props
}: BaseProps & React.ComponentPropsWithoutRef<"textarea">) {
  return (
    <FieldShell {...{ id, label, hint, error, optional, className }}>
      <textarea
        id={id}
        name={props.name ?? id}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(control, "resize-none")}
        {...props}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  hint,
  error,
  optional,
  className,
  children,
  ...props
}: BaseProps & React.ComponentPropsWithoutRef<"select">) {
  return (
    <FieldShell {...{ id, label, hint, error, optional, className }}>
      <div className="relative">
        <select
          id={id}
          name={props.name ?? id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(control, "appearance-none pr-8")}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-0 bottom-3.5 text-text-muted"
        >
          ↓
        </span>
      </div>
    </FieldShell>
  );
}
