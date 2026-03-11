import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "accent" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer uppercase tracking-wide";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-cr-yellow-600 text-cr-dark-800 hover:bg-cr-yellow-500 shadow-md hover:shadow-lg active:scale-[0.97] ring-1 ring-cr-yellow-700/20",
  secondary:
    "bg-cr-dark-800 text-cr-cream-100 hover:bg-cr-dark-700 border border-cr-dark-600",
  ghost:
    "bg-transparent text-cr-dark-600 hover:bg-cr-cream-200",
  accent:
    "bg-cr-burgundy-800 text-white hover:bg-cr-burgundy-700 shadow-md hover:shadow-lg active:scale-[0.97]",
  danger:
    "bg-red-600 text-white hover:bg-red-500 shadow-md",
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
