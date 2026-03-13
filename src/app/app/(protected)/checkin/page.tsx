"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { userCheckins, bars } from "@/lib/mockUserData";
import { getCurrentPosition, getGpsMatchStatus, type GeoResult } from "@/lib/utils/geolocation";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function GpsStatusIndicator({ status, distance }: { status?: string; distance?: number }) {
  if (status === "match") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cr-green-700">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-cr-green-500" />
        GPS OK {distance != null && `(${distance}m)`}
      </span>
    );
  }
  if (status === "no_match") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-yellow-700">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-yellow-500" />
        Longe {distance != null && `(${distance}m)`}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cr-brown-400">
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-cr-brown-300" />
      Sem GPS
    </span>
  );
}

type CheckinStep = "list" | "select-bar" | "gps" | "photo" | "confirm";

export default function UserCheckinsPage() {
  const searchParams = useSearchParams();
  const justSent = searchParams.get("sent") === "1";

  const pending = userCheckins.filter((c) => c.status === "pending");
  const history = userCheckins.filter((c) => c.status !== "pending");

  // New check-in flow state
  const [step, setStep] = React.useState<CheckinStep>("list");
  const [selectedBarId, setSelectedBarId] = React.useState<string | null>(null);
  const [barSearch, setBarSearch] = React.useState("");
  const [geoResult, setGeoResult] = React.useState<GeoResult | null>(null);
  const [gpsLoading, setGpsLoading] = React.useState(false);
  const [gpsMatch, setGpsMatch] = React.useState<{ status: string; distanceMeters: number } | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const selectedBar = React.useMemo(
    () => bars.find((b) => b.id === selectedBarId) ?? null,
    [selectedBarId],
  );

  const filteredBars = React.useMemo(() => {
    const q = barSearch.trim().toLowerCase();
    if (!q) return bars;
    return bars.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.neighborhood.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        (b.instagramHandle ?? "").toLowerCase().includes(q),
    );
  }, [barSearch]);

  function startNewCheckin() {
    setStep("select-bar");
    setSelectedBarId(null);
    setBarSearch("");
    setGeoResult(null);
    setGpsMatch(null);
    setPhotoPreview(null);
  }

  function selectBar(barId: string) {
    setSelectedBarId(barId);
    setStep("gps");
    captureGps(barId);
  }

  async function captureGps(barId: string) {
    setGpsLoading(true);
    const result = await getCurrentPosition();
    setGeoResult(result);

    const bar = bars.find((b) => b.id === barId);
    if (result.position && bar?.latitude != null && bar?.longitude != null) {
      const match = getGpsMatchStatus(
        result.position.latitude,
        result.position.longitude,
        bar.latitude,
        bar.longitude,
      );
      setGpsMatch(match);
    } else {
      setGpsMatch({ status: "unavailable", distanceMeters: 0 });
    }
    setGpsLoading(false);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit() {
    setSubmitting(true);
    // Mock submit - in production would call Supabase
    setTimeout(() => {
      setSubmitting(false);
      setStep("list");
      // Would redirect with ?sent=1 in production
    }, 1500);
  }

  // ─── New check-in flow screens ───

  if (step === "select-bar") {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
              Novo Check-in
            </div>
            <div className="mt-1 text-sm text-cr-brown-500">Selecione o bar</div>
          </div>
          <Button variant="secondary" onClick={() => setStep("list")}>
            Cancelar
          </Button>
        </div>

        <Input
          placeholder="Buscar bar..."
          value={barSearch}
          onChange={(e) => setBarSearch(e.target.value)}
        />

        <div className="space-y-2">
          {filteredBars.map((bar) => (
            <button
              key={bar.id}
              type="button"
              className="w-full rounded-2xl border border-cr-dark-200 bg-white p-4 text-left shadow-sm transition-all hover:border-cr-yellow-600/30 hover:shadow-md cursor-pointer"
              onClick={() => selectBar(bar.id)}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cr-cream-200">
                  <Image
                    src={bar.imageUrl}
                    alt={bar.name}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-cr-dark-800">{bar.name}</div>
                  <div className="text-xs text-cr-dark-400">
                    {bar.neighborhood}, {bar.city}
                  </div>
                  {bar.instagramHandle && (
                    <div className="text-xs font-mono text-cr-dark-500 mt-0.5">
                      {bar.instagramHandle}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
          {filteredBars.length === 0 && (
            <div className="py-8 text-center text-sm text-cr-dark-400">
              Nenhum bar encontrado
            </div>
          )}
        </div>
      </div>
    );
  }

  if (step === "gps" && selectedBar) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
              Verificação GPS
            </div>
            <div className="mt-1 text-sm text-cr-brown-500">{selectedBar.name}</div>
          </div>
          <Button variant="secondary" onClick={() => setStep("select-bar")}>
            Voltar
          </Button>
        </div>

        <Card>
          <div className="text-center py-4">
            {gpsLoading ? (
              <>
                <div className="text-3xl mb-3 animate-pulse">📍</div>
                <div className="text-sm font-semibold text-cr-dark-600">Obtendo localização...</div>
                <div className="text-xs text-cr-dark-400 mt-1">Permita o acesso à localização no navegador</div>
              </>
            ) : gpsMatch?.status === "match" ? (
              <>
                <div className="text-3xl mb-3">✅</div>
                <div className="text-sm font-bold text-cr-green-700">Localização confirmada!</div>
                <div className="text-xs text-cr-dark-400 mt-1">
                  Você está a {gpsMatch.distanceMeters}m de {selectedBar.name}
                </div>
              </>
            ) : gpsMatch?.status === "no_match" ? (
              <>
                <div className="text-3xl mb-3">⚠️</div>
                <div className="text-sm font-bold text-yellow-700">Você parece estar longe do bar</div>
                <div className="text-xs text-cr-dark-400 mt-1">
                  Distância: {gpsMatch.distanceMeters}m — Máximo recomendado: 200m
                </div>
                <div className="text-xs text-cr-dark-400 mt-0.5">
                  Você pode continuar, mas o admin revisará manualmente
                </div>
              </>
            ) : (
              <>
                <div className="text-3xl mb-3">📍</div>
                <div className="text-sm font-bold text-cr-dark-600">Localização indisponível</div>
                <div className="text-xs text-cr-dark-400 mt-1">
                  {geoResult?.error || "Não foi possível obter sua localização"}
                </div>
                <div className="text-xs text-cr-dark-400 mt-0.5">
                  Você pode continuar — o admin revisará manualmente
                </div>
              </>
            )}
          </div>

          {!gpsLoading && (
            <div className="flex gap-3 mt-2">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => captureGps(selectedBar.id)}
              >
                Tentar novamente
              </Button>
              <Button
                className="flex-1"
                onClick={() => setStep("photo")}
              >
                Continuar
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  if (step === "photo" && selectedBar) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
              Screenshot do Story
            </div>
            <div className="mt-1 text-sm text-cr-brown-500">{selectedBar.name}</div>
          </div>
          <Button variant="secondary" onClick={() => setStep("gps")}>
            Voltar
          </Button>
        </div>

        {selectedBar.instagramHandle && (
          <div className="rounded-2xl border border-cr-yellow-300 bg-cr-yellow-50 p-4">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📸</div>
              <div>
                <div className="text-sm font-bold text-cr-yellow-900">
                  Marque {selectedBar.instagramHandle} no seu story
                </div>
                <div className="text-xs text-cr-yellow-800 mt-0.5">
                  Tire um print do story e envie aqui
                </div>
              </div>
            </div>
          </div>
        )}

        <Card>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-cr-brown-500">
                Enviar print do story
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="block w-full text-sm text-cr-brown-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-cr-yellow-100 file:text-cr-yellow-900 hover:file:bg-cr-yellow-200 cursor-pointer"
              />
            </div>

            {photoPreview && (
              <div className="overflow-hidden rounded-xl border border-cr-brown-100">
                <Image
                  src={photoPreview}
                  alt="Preview do story"
                  width={400}
                  height={300}
                  className="w-full h-auto max-h-[300px] object-contain bg-cr-brown-50"
                  unoptimized
                />
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => setStep("confirm")}
              disabled={!photoPreview}
            >
              Continuar
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (step === "confirm" && selectedBar) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
              Confirmar Check-in
            </div>
            <div className="mt-1 text-sm text-cr-brown-500">Revise e envie</div>
          </div>
          <Button variant="secondary" onClick={() => setStep("photo")}>
            Voltar
          </Button>
        </div>

        <Card>
          <div className="space-y-4">
            {/* Bar info */}
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-cr-cream-200">
                <Image
                  src={selectedBar.imageUrl}
                  alt={selectedBar.name}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
              <div>
                <div className="text-sm font-bold text-cr-dark-800">{selectedBar.name}</div>
                <div className="text-xs text-cr-dark-400">
                  {selectedBar.neighborhood}, {selectedBar.city}
                </div>
              </div>
            </div>

            {/* GPS status */}
            <div className={[
              "rounded-xl border p-3",
              gpsMatch?.status === "match"
                ? "border-cr-green-200 bg-cr-green-50"
                : gpsMatch?.status === "no_match"
                ? "border-yellow-200 bg-yellow-50"
                : "border-cr-brown-100 bg-cr-brown-50",
            ].join(" ")}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-cr-brown-500">GPS</span>
                {gpsMatch?.status === "match" ? (
                  <span className="text-xs font-bold text-cr-green-700">✅ Confirmado ({gpsMatch.distanceMeters}m)</span>
                ) : gpsMatch?.status === "no_match" ? (
                  <span className="text-xs font-bold text-yellow-700">⚠️ Longe ({gpsMatch.distanceMeters}m)</span>
                ) : (
                  <span className="text-xs font-bold text-cr-brown-400">📍 Indisponível</span>
                )}
              </div>
            </div>

            {/* Photo preview */}
            {photoPreview && (
              <div className="overflow-hidden rounded-xl border border-cr-brown-100">
                <Image
                  src={photoPreview}
                  alt="Story screenshot"
                  width={400}
                  height={200}
                  className="w-full h-auto max-h-[200px] object-contain bg-cr-brown-50"
                  unoptimized
                />
              </div>
            )}

            <div className="rounded-xl bg-cr-dark-50 border border-cr-dark-100 p-3 text-center">
              <div className="text-xs text-cr-dark-500">
                Check-in serve como <span className="font-bold text-cr-green-700">comprovação de visita</span> para suas rotas
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Enviando..." : "Enviar check-in"}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ─── Default: checkin list ───

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
            Check-ins Instagram
          </div>
          <div className="mt-1 text-sm text-cr-brown-500">
            Seus check-ins via stories do Instagram
          </div>
        </div>
        <Button onClick={startNewCheckin}>
          + Novo Check-in
        </Button>
      </div>

      {/* Success Banner */}
      {justSent && (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">✅</span>
            <div>
              <div className="text-sm font-semibold text-green-800">
                Check-in enviado com sucesso!
              </div>
              <div className="text-xs text-green-600">
                Aguardando aprovação do admin para validar sua visita.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="!p-3 text-center">
          <div className="text-lg font-bold text-cr-green-800 font-display">
            {userCheckins.length}
          </div>
          <div className="text-[11px] text-cr-brown-500">Total</div>
        </Card>
        <Card className="!p-3 text-center">
          <div className="text-lg font-bold text-cr-gold-600 font-display">
            {userCheckins.filter((c) => c.status === "approved").length}
          </div>
          <div className="text-[11px] text-cr-brown-500">Aprovados</div>
        </Card>
        <Card className="!p-3 text-center">
          <div className="text-lg font-bold text-cr-brown-600 font-display">
            {userCheckins.filter((c) => c.status === "rejected").length}
          </div>
          <div className="text-[11px] text-cr-brown-500">Rejeitados</div>
        </Card>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <div className="mb-2 text-sm font-semibold text-cr-brown-700">
            Aguardando aprovação
          </div>
          <div className="space-y-2">
            {pending.map((c) => (
              <Card key={c.id} className="!p-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cr-cream-200">
                    <Image
                      src={c.imageUrl}
                      alt="Print do story"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-cr-brown-900">{c.barName}</div>
                    <div className="text-xs text-cr-brown-500">
                      {formatDate(c.date)} {c.instagramHandle && `• ${c.instagramHandle}`}
                    </div>
                    <GpsStatusIndicator status={c.gpsMatchStatus} distance={c.distanceMeters} />
                  </div>
                  <Badge variant="warning">Pendente</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      <div>
        <div className="mb-2 text-sm font-semibold text-cr-brown-700">
          Histórico
        </div>
        {history.length === 0 ? (
          <Card className="!py-8 text-center">
            <div className="text-2xl mb-2">📸</div>
            <div className="text-sm text-cr-brown-400">Nenhum check-in ainda</div>
            <Link href="/app/bars" className="mt-2 inline-block text-sm font-medium text-cr-green-700 hover:underline">
              Ver bares parceiros
            </Link>
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((c) => (
              <Card key={c.id} className="!p-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cr-cream-200">
                    <Image
                      src={c.imageUrl}
                      alt="Print do story"
                      width={56}
                      height={56}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-cr-brown-900">{c.barName}</div>
                    <div className="text-xs text-cr-brown-500">
                      {formatDate(c.date)} {c.instagramHandle && `• ${c.instagramHandle}`}
                    </div>
                    <GpsStatusIndicator status={c.gpsMatchStatus} distance={c.distanceMeters} />
                    {c.rejectionReason && (
                      <div className="mt-1 text-[11px] text-red-500">{c.rejectionReason}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {c.status === "approved" ? (
                      <Badge variant="success">Aprovado</Badge>
                    ) : (
                      <Badge variant="danger">Rejeitado</Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
