import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cr-green-800 text-white hover:bg-cr-green-700 shadow-sm hover:shadow-md active:scale-[0.98]",
  secondary:
    "bg-cr-cream-200 text-cr-brown-800 hover:bg-cr-cream-300 border border-cr-brown-100",
  ghost:
    "bg-transparent text-cr-brown-700 hover:bg-cr-cream-200",
  accent:
    "bg-cr-gold-600 text-white hover:bg-cr-gold-500 shadow-sm hover:shadow-md active:scale-[0.98]",
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
