"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { userCheckins } from "@/lib/mockUserData";

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

export default function UserCheckinsPage() {
  const searchParams = useSearchParams();
  const justSent = searchParams.get("sent") === "1";
  const barId = searchParams.get("barId");

  const pending = userCheckins.filter((c) => c.status === "pending");
  const history = userCheckins.filter((c) => c.status !== "pending");

  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-bold tracking-tight text-cr-brown-900 font-display">
          Check-ins Instagram
        </div>
        <div className="mt-1 text-sm text-cr-brown-500">
          Seus check-ins via stories do Instagram
        </div>
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
                Aguardando aprovação. Você ganhará 30 pontos bônus quando aprovado.
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
            {userCheckins.filter((c) => c.status === "approved").reduce((s, c) => s + c.points, 0)}
          </div>
          <div className="text-[11px] text-cr-brown-500">Pontos ganhos</div>
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
                    {c.rejectionReason && (
                      <div className="mt-1 text-[11px] text-red-500">{c.rejectionReason}</div>
                    )}
                  </div>
                  <div className="shrink-0 text-right">
                    {c.status === "approved" ? (
                      <>
                        <Badge variant="success">Aprovado</Badge>
                        <div className="mt-1 text-xs font-bold text-cr-green-700">+{c.points} pts</div>
                      </>
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
