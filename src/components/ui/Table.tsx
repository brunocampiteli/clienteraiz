import * as React from "react";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Table({ className, ...props }: Props) {
  return (
    <div className={["overflow-x-auto rounded-xl", className].filter(Boolean).join(" ")}>
      <table className="min-w-full border-separate border-spacing-0" {...props} />
    </div>
  );
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={["bg-cr-brown-50 text-left text-[11px] font-bold uppercase tracking-wider text-cr-brown-500", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={["divide-y divide-cr-brown-100/70", className].filter(Boolean).join(" ")} {...props} />;
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={["hover:bg-cr-gold-50/40 transition-colors duration-150", className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}

export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={["px-3 py-3.5 first:pl-4 last:pr-4 border-b border-cr-brown-200/60 whitespace-nowrap", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={["px-3 py-3.5 text-sm text-cr-brown-800 first:pl-4 last:pr-4", className]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
