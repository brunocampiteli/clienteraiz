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

export default function AppBarDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";
  const bar = bars.find((b) => b.id === id);

  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!bar) {
    return (
      <div className="space-y-4">
        <Card>
          <div className="text-sm font-semibold text-cr-brown-900">Bar não encontrado</div>
          <div className="mt-1 text-sm text-cr-brown-600">Esse bar não existe ou foi removido (mock).</div>
        </Card>
        <Link href="/app/bars">
          <Button variant="secondary" className="w-full">
            Voltar
          </Button>
        </Link>
      </div>
    );
  }

  const barSafe = bar;
  const mapsQuery = encodeURIComponent(
    `${barSafe.address}, ${barSafe.neighborhood}, ${barSafe.city}`
  );

  async function submitReceipt() {
    if (!file) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      console.log("[receipt upload mock]", {
        barId: barSafe.id,
        fileName: file.name,
        fileType: file.type,
        size: file.size,
      });
      setOpen(false);
      setFile(null);
      router.push(`/app/points?barId=${barSafe.id}&receiptSent=1`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-2xl border border-cr-brown-100 bg-white">
        <div className="h-40 w-full bg-cr-cream-200">
          <Image
            src={bar.imageUrl}
            alt={bar.name}
            className="h-full w-full object-cover"
            width={1200}
            height={160}
            unoptimized
          />
        </div>
      </div>

      <Card>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-cr-brown-900 font-display">{bar.name}</div>
            <div className="mt-1 text-sm text-cr-brown-600">
              {bar.neighborhood} • {bar.city}
            </div>
            <div className="mt-2 text-sm text-cr-brown-600">{bar.address}</div>
          </div>
          <Badge variant="neutral">{bar.distanceKm.toFixed(1)} km</Badge>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold text-cr-brown-900">Regras</div>
        <div className="mt-2 text-sm text-cr-brown-600">{bar.rules}</div>
        <div className="mt-3 text-sm text-cr-brown-600">
          Consumo mínimo para pontuar: <span className="font-semibold">{formatCurrency(bar.minimumSpend)}</span>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-semibold text-cr-brown-900">Horário</div>
        <div className="mt-2 text-sm text-cr-brown-600">{bar.openingHours}</div>
      </Card>

      <Card>
        <div className="text-sm font-semibold text-cr-brown-900">Mapa</div>
        <div className="mt-2 text-sm text-cr-brown-600">{barSafe.address}</div>
        <div className="mt-3 overflow-hidden rounded-xl border border-cr-brown-100 bg-cr-cream-100">
          <iframe
            title={`Mapa - ${barSafe.name}`}
            src={`https://www.google.com/maps?q=${mapsQuery}&output=embed`}
            className="h-64 w-full"
            loading="lazy"
          />
        </div>
      </Card>

      <div className="grid gap-2">
        <Button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Enviar nota fiscal
        </Button>

        <Link href="/app/bars">
          <Button variant="secondary" className="w-full">
            Voltar
          </Button>
        </Link>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (submitting) return;
              setOpen(false);
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-cr-brown-100 bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-bold text-cr-brown-900 font-display">Enviar nota fiscal</div>
                <div className="mt-1 text-sm text-cr-brown-600">
                  {bar.name} • {bar.neighborhood} • {bar.city}
                </div>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  if (submitting) return;
                  setOpen(false);
                }}
              >
                Fechar
              </Button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-cr-brown-600">Foto da nota</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="block w-full rounded-md border border-cr-brown-100 bg-white px-3 py-2 text-sm"
                  onChange={(e) => {
                    const next = e.target.files?.[0] ?? null;
                    setFile(next);
                  }}
                  disabled={submitting}
                />
                <div className="mt-1 text-xs text-cr-brown-400">
                  No celular, isso normalmente abre a câmera. (mock)
                </div>
              </div>

              {previewUrl ? (
                <div className="overflow-hidden rounded-xl border border-cr-brown-100 bg-cr-cream-100">
                  <div className="px-3 py-2 text-xs font-medium text-cr-brown-600">Preview</div>
                  <div className="h-48 w-full bg-cr-cream-200">
                    <Image
                      src={previewUrl}
                      alt="Preview da nota"
                      className="h-full w-full object-contain"
                      width={1200}
                      height={400}
                      unoptimized
                    />
                  </div>
                </div>
              ) : null}

              <Button
                className="w-full"
                type="button"
                disabled={!file || submitting}
                onClick={submitReceipt}
              >
                {submitting ? "Enviando..." : "Confirmar envio"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
