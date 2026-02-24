import * as React from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={[
        "h-10 w-full rounded-lg border border-cr-brown-100 bg-white px-3 text-sm outline-none transition-all placeholder:text-cr-brown-400 focus:ring-2 focus:ring-cr-green-600/20 focus:border-cr-green-600",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
