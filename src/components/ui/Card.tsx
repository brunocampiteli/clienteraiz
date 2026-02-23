import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  return (
    <div
      className={[
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: Props) {
  return (
    <div className={["mb-3 flex items-start justify-between", className].filter(Boolean).join(" ")} {...props} />
  );
}

export function CardTitle({ className, ...props }: Props) {
  return (
    <div
      className={["text-sm font-medium text-zinc-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardValue({ className, ...props }: Props) {
  return (
    <div
      className={["mt-1 text-2xl font-semibold tracking-tight text-zinc-900", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
