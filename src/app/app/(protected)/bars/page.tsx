"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { bars, pointsHistory } from "@/lib/mockUserData";

function formatCurrency(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function IconStar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
    </svg>
  );
}

function IconPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0Z" />
    </svg>
  );
}

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607Z" />
    </svg>
  );
}

const categories = ["Todos", "Boteco", "Pub", "Choperia"];

export default function AppBarsPage() {
  const [q, setQ] = React.useState("");
  const [category, setCategory] = React.useState("Todos");

  const visitedBarIds = React.useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const isInCurrentMonth = (iso: string) => {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return false;
      return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
    };
    return new Set(pointsHistory.filter((p) => isInCurrentMonth(p.date)).map((p) => p.barId));
  }, []);

  const filtered = React.useMemo(() => {
    let list = bars;
    const query = q.trim().toLowerCase();
    if (query) {
      list = list.filter((b) => b.name.toLowerCase().includes(query) || b.city.toLowerCase().includes(query));
    }
    if (category !== "Todos") {
      list = list.filter((b) => b.category === category);
    }
    return list;
  }, [q, category]);

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cr-dark-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar bar, cidade..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-12 w-full rounded-xl border border-cr-dark-200 bg-white pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-cr-dark-400 focus:ring-2 focus:ring-cr-yellow-600/30 focus:border-cr-yellow-600"
        />
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={[
              "flex-shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer uppercase tracking-wider",
              category === cat
                ? "bg-cr-yellow-600 text-cr-dark-800 shadow-sm"
                : "bg-cr-dark-100 text-cr-dark-600 hover:bg-cr-dark-200",
            ].join(" ")}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-xs font-semibold text-cr-dark-400 uppercase tracking-wider">
        {filtered.length} bar{filtered.length !== 1 ? "es" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* Bar Cards */}
      <div className="space-y-3">
        {filtered.map((b) => {
          const visited = visitedBarIds.has(b.id);
          return (
            <Link key={b.id} href={`/app/bars/${b.id}`} className="block">
              <div className="group overflow-hidden rounded-2xl border border-cr-dark-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-cr-yellow-600/30">
                <div className="relative h-36 w-full bg-cr-cream-200">
                  <Image
                    src={b.imageUrl}
                    alt={b.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    fill
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cr-dark-800/50 to-transparent" />

                  <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-cr-dark-800/85 px-2.5 py-1 text-xs font-bold text-cr-yellow-600 backdrop-blur-sm">
                    <IconStar className="h-3.5 w-3.5" />
                    {b.rating}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-cr-dark-800/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
                    <IconPin className="h-3 w-3" />
                    {b.distanceKm.toFixed(1)} km
                  </div>

                  {visited && (
                    <div className="absolute bottom-3 left-3">
                      <Badge variant="success" className="!bg-cr-green-700 !text-white !ring-0 shadow-sm">
                        Visitado este mes
                      </Badge>
                    </div>
                  )}

                  <div className="absolute bottom-3 right-3 rounded-full bg-cr-yellow-600 px-2.5 py-0.5 text-[10px] font-bold text-cr-dark-800 uppercase tracking-wider">
                    {b.category}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-base font-bold text-cr-dark-800">{b.name}</div>
                      <div className="mt-0.5 text-xs text-cr-dark-400">
                        {b.neighborhood} • {b.city}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-cr-dark-400 uppercase tracking-wider">A partir de</div>
                      <div className="text-sm font-bold text-cr-green-700">{formatCurrency(b.minimumSpend)}</div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-cr-dark-400">
                    <span>🕒 {b.openingHours.split("•")[0].trim()}</span>
                    <span>•</span>
                    <span>🎁 {b.prizes.length} premio{b.prizes.length > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-sm font-bold text-cr-dark-600">Nenhum bar encontrado</div>
          <div className="text-xs text-cr-dark-400 mt-1">Tente buscar com outros termos</div>
        </div>
      )}
    </div>
  );
}
