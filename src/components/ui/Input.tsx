import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={[
        "h-11 w-full rounded-xl border border-cr-dark-200 bg-white px-4 text-sm font-medium outline-none transition-all placeholder:text-cr-dark-400 focus:ring-2 focus:ring-cr-yellow-600/30 focus:border-cr-yellow-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
