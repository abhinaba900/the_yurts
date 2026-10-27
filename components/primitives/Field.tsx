import { cn } from "@/lib/cn";

/**
 * Form fields are quiet boxes: an elevated surface, a boundary that clears 3:1
 * against its section, and an olive ring on focus. Labels are visible, sentence
 * case and sit 0.5rem above the control.
 */

const control =
  "block w-full min-h-12 rounded-(--radius-control) border border-field bg-surface-elevated " +
  "px-4 py-3 font-sans text-body text-text placeholder:text-text-muted placeholder:opacity-75 " +
  "outline-none transition-[border-color,box-shadow] duration-(--duration-quick) ease-(--ease-out-soft) " +
  "hover:border-text focus:border-accent focus:shadow-[0_0_0_0.1875rem_color-mix(in_oklab,var(--color-accent)_22%,transparent)] " +
  "aria-[invalid=true]:border-error";

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
          className="font-sans text-small font-medium text-text"
        >
          {label}
        </label>
        {optional ? (
          <span className="font-sans text-small text-text-muted">
            Optional
          </span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 font-sans text-small font-medium text-error"
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
          className={cn(
            control,
            "appearance-none pr-10 cursor-pointer",
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
        >
          ↓
        </span>
      </div>
    </FieldShell>
  );
}
