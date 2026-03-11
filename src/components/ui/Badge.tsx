import * as React from "react";

type Variant = "success" | "warning" | "danger" | "neutral" | "gold" | "burgundy";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  success: "bg-cr-green-100 text-cr-green-800 ring-cr-green-300",
  warning: "bg-cr-yellow-100 text-cr-yellow-900 ring-cr-yellow-300",
  danger: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-cr-dark-100 text-cr-dark-600 ring-cr-dark-200",
  gold: "bg-cr-yellow-100 text-cr-yellow-900 ring-cr-yellow-400",
  burgundy: "bg-cr-burgundy-100 text-cr-burgundy-800 ring-cr-burgundy-300",
};

export function Badge({ className, variant = "neutral", ...props }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset uppercase tracking-wide",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
