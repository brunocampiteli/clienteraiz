"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { clearUserToken } from "@/lib/auth";
import { currentUser, achievements } from "@/lib/mockUserData";

function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

export default function AppProfilePage() {
  const router = useRouter();

  function logout() {
    clearUserToken();
    router.replace("/app/login");
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPct = Math.round((currentUser.pointsTotal / currentUser.nextLevelPoints) * 100);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-cr-green-800 via-cr-green-900 to-cr-green-950 p-5 text-white text-center shadow-lg">
        <div
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg ring-4 ring-white/20"
          style={{ background: `linear-gradient(135deg, ${currentUser.avatarColor}, #1A3C2E)` }}
        >
          {currentUser.name.charAt(0)}
        </div>
        <div className="mt-3 text-xl font-bold font-display">{currentUser.name}</div>
        <div className="mt-0.5 text-sm text-cr-green-200">{currentUser.email}</div>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 backdrop-blur-sm">
          <span className="text-sm">⭐</span>
          <span className="text-sm font-bold">{currentUser.level}</span>
        </div>

        {/* Level Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1 text-xs text-cr-green-200">
            <span>{currentUser.level}</span>
            <span>{currentUser.nextLevel}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cr-gold-400 to-cr-gold-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-cr-green-300">
            {currentUser.pointsTotal.toLocaleString()} / {currentUser.nextLevelPoints.toLocaleString()} pontos
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.pointsTotal.toLocaleString()}</div>
          <div className="text-[9px] text-cr-brown-400 mt-0.5">Pontos</div>
        </div>
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.barsVisited}</div>
          <div className="text-[9px] text-cr-brown-400 mt-0.5">Bares</div>
        </div>
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">{currentUser.receiptsApproved}</div>
          <div className="text-[9px] text-cr-brown-400 mt-0.5">Notas</div>
        </div>
        <div className="rounded-2xl border border-cr-brown-100 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-bold text-cr-brown-900 font-display">#7</div>
          <div className="text-[9px] text-cr-brown-400 mt-0.5">Ranking</div>
        </div>
      </div>

      {/* Personal Info */}
      <Card>
        <div className="text-sm font-bold text-cr-brown-900 font-display mb-3">Informações pessoais</div>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-2.5 border-b border-cr-brown-100/50">
            <div className="text-xs text-cr-brown-400">Nome</div>
            <div className="text-sm font-medium text-cr-brown-900">{currentUser.name}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-brown-100/50">
            <div className="text-xs text-cr-brown-400">E-mail</div>
            <div className="text-sm font-medium text-cr-brown-900">{currentUser.email}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-brown-100/50">
            <div className="text-xs text-cr-brown-400">Telefone</div>
            <div className="text-sm font-medium text-cr-brown-900">{currentUser.phone}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-brown-100/50">
            <div className="text-xs text-cr-brown-400">Cidade</div>
            <div className="text-sm font-medium text-cr-brown-900">{currentUser.city}</div>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div className="text-xs text-cr-brown-400">Membro desde</div>
            <div className="text-sm font-medium text-cr-brown-900">
              {new Date(currentUser.memberSince).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-bold text-cr-brown-900 font-display">Conquistas</div>
          <Badge variant="gold">{unlockedCount}/{achievements.length}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={[
                "rounded-2xl border p-3 text-center transition-all",
                a.unlocked
                  ? "border-cr-gold-200 bg-white shadow-sm"
                  : "border-cr-brown-100 bg-cr-cream-100 opacity-50",
              ].join(" ")}
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="mt-1 text-[11px] font-semibold text-cr-brown-800 leading-tight">{a.title}</div>
              {a.unlocked && a.date && (
                <div className="mt-0.5 text-[9px] text-cr-brown-400">
                  {new Date(a.date).toLocaleDateString("pt-BR")}
                </div>
              )}
              {!a.unlocked && (
                <div className="mt-0.5 text-[9px] text-cr-brown-400">Bloqueado</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 cursor-pointer"
      >
        <IconLogout className="h-4 w-4" />
        Sair da conta
      </button>

      <div className="h-2" />
    </div>
  );
}
