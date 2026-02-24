import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Table({ className, ...props }: Props) {
  return (
    <div className={["overflow-x-auto rounded-lg", className].filter(Boolean).join(" ")}>
      <table className="min-w-full border-separate border-spacing-0" {...props} />
    </div>
  );
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={["bg-cr-cream-100 text-left text-xs font-semibold text-cr-brown-600", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={["divide-y divide-cr-brown-100", className].filter(Boolean).join(" ")} {...props} />;
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={["hover:bg-cr-cream-50 transition-colors", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={["px-3 py-3 first:pl-4 last:pr-4 border-b border-cr-brown-200", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={["px-3 py-3 text-sm text-cr-brown-900 first:pl-4 last:pr-4", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
