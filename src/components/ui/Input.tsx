import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={[
        "h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm outline-none transition-shadow placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-900/10",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
