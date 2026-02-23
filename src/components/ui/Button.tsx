import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  secondary: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
  ghost: "bg-transparent text-zinc-900 hover:bg-zinc-100",
};

export function Button({ className, variant = "primary", ...props }: Props) {
  return (
    <button
      className={[base, variants[variant], className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
