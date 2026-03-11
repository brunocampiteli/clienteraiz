"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { bars } from "@/lib/mockUserData";

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

function IconClock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0Z" />
    </svg>
  );
}

function IconCamera(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0Z" />
    </svg>
  );
}

function IconArrowLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function AppBarDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const bar = bars.find((b) => b.id === id);

  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const [checkinOpen, setCheckinOpen] = React.useState(false);
  const [checkinFile, setCheckinFile] = React.useState<File | null>(null);
  const [checkinPreview, setCheckinPreview] = React.useState<string | null>(null);
  const [checkinSubmitting, setCheckinSubmitting] = React.useState(false);
  const [instagramHandle, setInstagramHandle] = React.useState("");

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => { URL.revokeObjectURL(url); };
  }, [file]);

  React.useEffect(() => {
    if (!checkinFile) {
      setCheckinPreview(null);
      return;
    }
    const url = URL.createObjectURL(checkinFile);
    setCheckinPreview(url);
    return () => { URL.revokeObjectURL(url); };
  }, [checkinFile]);

  if (!bar) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl mb-3">🍺</div>
        <div className="text-lg font-display text-cr-dark-800 tracking-wider">BAR NAO ENCONTRADO</div>
        <div className="mt-1 text-sm text-cr-dark-500">Esse bar nao existe ou foi removido.</div>
        <Link href="/app/bars" className="mt-4">
          <Button variant="secondary">Voltar para bares</Button>
        </Link>
      </div>
    );
  }

  const barSafe = bar;
  const mapsQuery = encodeURIComponent(`${barSafe.address}, ${barSafe.neighborhood}, ${barSafe.city}`);

  async function submitReceipt() {
    if (!file) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setOpen(false);
      setFile(null);
      router.push(`/app/points?barId=${barSafe.id}&receiptSent=1`);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitCheckin() {
    if (!checkinFile) return;
    setCheckinSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setCheckinOpen(false);
      setCheckinFile(null);
      setInstagramHandle("");
      router.push(`/app/checkin?barId=${barSafe.id}&sent=1`);
    } finally {
      setCheckinSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Hero Image */}
      <div className="relative -mx-4 -mt-4 overflow-hidden">
        <div className="relative h-56 w-full bg-cr-cream-200">
          <Image
            src={bar.imageUrl}
            alt={bar.name}
            className="h-full w-full object-cover"
            fill
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cr-dark-800/70 via-transparent to-cr-dark-800/20" />

          <button
            type="button"
            onClick={() => router.back()}
            className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-cr-dark-800/60 text-white backdrop-blur-sm transition-colors hover:bg-cr-dark-800/80 cursor-pointer"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-2xl font-display text-white tracking-wider drop-shadow-lg">{bar.name.toUpperCase()}</div>
                <div className="text-sm text-white/80">{bar.neighborhood} • {bar.city}</div>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-cr-dark-800/80 px-3 py-1.5 text-xs font-bold text-cr-yellow-600 backdrop-blur-sm">
                <IconStar className="h-3.5 w-3.5" />
                {bar.rating}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Info Chips */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral" className="!rounded-lg !px-3 !py-1.5 !bg-cr-dark-100">
          📍 {bar.distanceKm.toFixed(1)} km
        </Badge>
        <Badge variant="neutral" className="!rounded-lg !px-3 !py-1.5 !bg-cr-yellow-100 !text-cr-yellow-900 !ring-cr-yellow-300">
          🏷️ {bar.category}
        </Badge>
        <Badge variant="neutral" className="!rounded-lg !px-3 !py-1.5 !bg-cr-dark-100">
          <IconClock className="h-3 w-3 mr-1" />
          {bar.openingHours.split("•")[0].trim()}
        </Badge>
      </div>

      {/* Rules & Minimum */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cr-yellow-100 text-sm">📋</div>
          <div className="text-base font-display text-cr-dark-800 tracking-wider">COMO PONTUAR</div>
        </div>
        <div className="text-sm text-cr-dark-600 leading-relaxed">{bar.rules}</div>
        <div className="mt-3 rounded-xl bg-cr-dark-800 px-4 py-3 flex items-center justify-between">
          <div className="text-xs text-cr-dark-400 font-semibold uppercase tracking-wider">Consumo minimo</div>
          <div className="text-lg font-display text-cr-yellow-600 tracking-wider">{formatCurrency(bar.minimumSpend)}</div>
        </div>
      </Card>

      {/* Prizes */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cr-burgundy-100 text-sm">🎁</div>
          <div className="text-base font-display text-cr-dark-800 tracking-wider">PREMIOS DISPONIVEIS</div>
        </div>
        <div className="space-y-2">
          {bar.prizes.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-cr-cream-50 px-4 py-3 border border-cr-dark-100">
              <div className="text-sm font-semibold text-cr-dark-700">{p.name}</div>
              <Badge variant="gold">{p.points} pts</Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Schedule */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cr-green-100 text-sm">🕒</div>
          <div className="text-base font-display text-cr-dark-800 tracking-wider">HORARIO</div>
        </div>
        <div className="text-sm text-cr-dark-600">{bar.openingHours}</div>
      </Card>

      {/* Map */}
      <Card className="!p-0 overflow-hidden">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cr-yellow-100 text-sm">📍</div>
            <div className="text-base font-display text-cr-dark-800 tracking-wider">LOCALIZACAO</div>
          </div>
          <div className="text-xs text-cr-dark-500 ml-10">{barSafe.address}, {barSafe.neighborhood}</div>
        </div>
        <div className="h-48 w-full bg-cr-cream-200">
          <iframe
            title={`Mapa - ${barSafe.name}`}
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="h-full w-full"
            loading="lazy"
          />
        </div>
      </Card>

      {/* CTA Buttons */}
      <div className="sticky bottom-16 z-20 bg-gradient-to-t from-cr-cream-50 via-cr-cream-50 to-transparent pt-4 pb-2 space-y-2">
        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full !py-3.5 !text-base shadow-lg"
        >
          <IconCamera className="h-5 w-5 mr-1" />
          Enviar nota fiscal
        </Button>
        <Button
          type="button"
          variant="accent"
          onClick={() => setCheckinOpen(true)}
          className="w-full !py-3 !text-sm shadow-md"
        >
          📸 Check-in Instagram
        </Button>
      </div>

      {/* Receipt Upload Modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-cr-dark-800/70 backdrop-blur-sm"
            onClick={() => { if (!submitting) setOpen(false); }}
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-cr-dark-200" />

            <div className="text-lg font-display text-cr-dark-800 tracking-wider">ENVIAR NOTA FISCAL</div>
            <div className="mt-1 text-sm text-cr-dark-500">
              {bar.name} • {bar.neighborhood}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs font-bold text-cr-dark-500 uppercase tracking-wider">Foto da nota</label>
                <div className="rounded-2xl border-2 border-dashed border-cr-yellow-600/40 bg-cr-yellow-50 p-6 text-center transition-colors hover:border-cr-yellow-600/70">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    style={{ position: "relative" }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    disabled={submitting}
                  />
                  <IconCamera className="mx-auto h-8 w-8 text-cr-yellow-700" />
                  <div className="mt-2 text-sm font-semibold text-cr-dark-600">
                    {file ? file.name : "Toque para tirar foto ou selecionar"}
                  </div>
                  <div className="mt-1 text-[11px] text-cr-dark-400">
                    A IA vai verificar a nota contra o sistema fiscal
                  </div>
                </div>
              </div>

              {previewUrl && (
                <div className="overflow-hidden rounded-2xl border border-cr-dark-200 bg-cr-cream-50">
                  <Image
                    src={previewUrl}
                    alt="Preview da nota"
                    className="h-48 w-full object-contain"
                    width={1200}
                    height={400}
                    unoptimized
                  />
                </div>
              )}

              <Button
                className="w-full !py-3"
                type="button"
                disabled={!file || submitting}
                onClick={submitReceipt}
              >
                {submitting ? "Enviando..." : "Confirmar envio"}
              </Button>

              <button
                type="button"
                className="w-full py-2 text-sm font-semibold text-cr-dark-400 hover:text-cr-dark-600 cursor-pointer"
                onClick={() => { if (!submitting) setOpen(false); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Check-in Modal */}
      {checkinOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-cr-dark-800/70 backdrop-blur-sm"
            onClick={() => { if (!checkinSubmitting) setCheckinOpen(false); }}
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-cr-dark-200" />

            <div className="text-lg font-display text-cr-dark-800 tracking-wider">📸 CHECK-IN INSTAGRAM</div>
            <div className="mt-1 text-sm text-cr-dark-500">
              {bar.name} • +30 pontos bonus
            </div>

            <div className="mt-4 rounded-xl bg-cr-burgundy-50 border border-cr-burgundy-200 px-4 py-3">
              <div className="text-xs font-bold text-cr-burgundy-800 uppercase tracking-wider">Como funciona:</div>
              <div className="mt-1 text-xs text-cr-burgundy-700 leading-relaxed">
                1. Poste um story no Instagram marcando o bar<br />
                2. Tire um print do story<br />
                3. Envie o print aqui e ganhe 30 pontos bonus!
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-cr-dark-500 uppercase tracking-wider">Seu @ no Instagram (opcional)</label>
                <input
                  type="text"
                  placeholder="@seuperfil"
                  value={instagramHandle}
                  onChange={(e) => setInstagramHandle(e.target.value)}
                  disabled={checkinSubmitting}
                  className="h-11 w-full rounded-xl border border-cr-dark-200 bg-white px-4 text-sm text-cr-dark-800 placeholder:text-cr-dark-400 focus:border-cr-yellow-600 focus:outline-none focus:ring-2 focus:ring-cr-yellow-600/30"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-cr-dark-500 uppercase tracking-wider">Print do story</label>
                <div className="rounded-2xl border-2 border-dashed border-cr-burgundy-800/30 bg-cr-burgundy-50 p-6 text-center transition-colors hover:border-cr-burgundy-800/50">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    style={{ position: "relative" }}
                    onChange={(e) => setCheckinFile(e.target.files?.[0] ?? null)}
                    disabled={checkinSubmitting}
                  />
                  <div className="text-2xl">📱</div>
                  <div className="mt-2 text-sm font-semibold text-cr-dark-600">
                    {checkinFile ? checkinFile.name : "Toque para enviar o print do story"}
                  </div>
                </div>
              </div>

              {checkinPreview && (
                <div className="overflow-hidden rounded-2xl border border-cr-dark-200 bg-cr-cream-50">
                  <Image
                    src={checkinPreview}
                    alt="Preview do check-in"
                    className="h-48 w-full object-contain"
                    width={1200}
                    height={400}
                    unoptimized
                  />
                </div>
              )}

              <Button
                className="w-full !py-3"
                variant="accent"
                type="button"
                disabled={!checkinFile || checkinSubmitting}
                onClick={submitCheckin}
              >
                {checkinSubmitting ? "Enviando..." : "Enviar check-in"}
              </Button>

              <button
                type="button"
                className="w-full py-2 text-sm font-semibold text-cr-dark-400 hover:text-cr-dark-600 cursor-pointer"
                onClick={() => { if (!checkinSubmitting) setCheckinOpen(false); }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
