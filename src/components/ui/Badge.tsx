import * as React from "react";

type Variant = "success" | "warning" | "danger" | "neutral" | "gold";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  success: "bg-cr-green-50 text-cr-green-800 ring-cr-green-200",
  warning: "bg-cr-gold-50 text-cr-gold-800 ring-cr-gold-200",
  danger: "bg-red-50 text-red-700 ring-red-200",
  neutral: "bg-cr-cream-200 text-cr-brown-700 ring-cr-brown-200",
  gold: "bg-cr-gold-100 text-cr-gold-900 ring-cr-gold-300",
};

export function Badge({ className, variant = "neutral", ...props }: Props) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        variants[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
