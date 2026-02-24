import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: Props) {
  return (
    <div
      className={[
        "rounded-2xl border border-cr-brown-100 bg-white p-5 shadow-sm",
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
      className={["text-sm font-medium text-cr-brown-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function CardValue({ className, ...props }: Props) {
  return (
    <div
      className={["mt-1 text-2xl font-bold tracking-tight text-cr-brown-900 font-display", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
