import * as React from "react";

type Variant = "success" | "warning" | "danger" | "neutral";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  warning: "bg-amber-50 text-amber-700 ring-amber-100",
  danger: "bg-rose-50 text-rose-700 ring-rose-100",
  neutral: "bg-zinc-50 text-zinc-700 ring-zinc-100",
};

export function Badge({ className, variant = "neutral", ...props }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
