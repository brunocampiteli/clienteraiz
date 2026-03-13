"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { adminAchievements, userAchievementAssignments } from "@/lib/mockData";
import { useUser } from "@/lib/context/UserContext";

function IconLogout(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

function formatPhone(phone: string | null) {
  if (!phone) return "—";
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

function formatCpf(cpf: string | null) {
  if (!cpf) return "—";
  const d = cpf.replace(/\D/g, "");
  if (d.length === 11) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  return cpf;
}

export default function AppProfilePage() {
  const router = useRouter();
  const { user, signOut } = useUser();

  async function logout() {
    await signOut();
    router.replace("/app/login");
  }

  // Derive achievements from centralized data
  // In mock, user "app_usr_1" maps to "usr_1" in assignments. In prod, will use real user.id
  const mockUserId = "usr_1"; // TODO: map real user.id when Supabase is connected
  const userAssignments = userAchievementAssignments.filter((ua) => ua.userId === mockUserId);
  const userAssignedIds = new Set(userAssignments.map((ua) => ua.achievementId));

  const achievements = adminAchievements.map((a) => {
    const assignment = userAssignments.find((ua) => ua.achievementId === a.id);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      emoji: a.emoji,
      unlocked: userAssignedIds.has(a.id),
      date: assignment?.unlockedAt,
    };
  });

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPct = user
    ? Math.min(100, Math.round((user.pointsTotal / Math.max(1, user.nextLevelPoints)) * 100))
    : 0;

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="overflow-hidden rounded-2xl bg-cr-dark-800 p-5 text-white text-center shadow-lg relative">
        <div className="absolute top-0 right-0 w-40 h-40 bg-cr-yellow-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-cr-burgundy-800/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-3xl font-bold text-cr-dark-800 shadow-lg ring-4 ring-cr-yellow-600/30"
            style={{ background: user?.avatarColor ?? "#FBC02D" }}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
          <div className="mt-3 text-2xl font-display text-cr-cream-100 tracking-wider">{(user?.name ?? "").toUpperCase()}</div>
          <div className="mt-0.5 text-sm text-cr-dark-400">{user?.email ?? ""}</div>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cr-dark-700 px-4 py-1.5">
            <span className="text-sm">⭐</span>
            <span className="text-sm font-display text-cr-yellow-600 tracking-wider">{(user?.level ?? "Raiz Bronze").toUpperCase()}</span>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1 text-xs text-cr-dark-400">
              <span className="uppercase tracking-wider">{user?.level ?? "Raiz Bronze"}</span>
              <span className="uppercase tracking-wider">{user?.nextLevel ?? "Raiz Prata"}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-cr-dark-600">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cr-yellow-600 to-cr-green-600"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="mt-1 text-[11px] text-cr-dark-400">
              {(user?.pointsTotal ?? 0).toLocaleString()} / {(user?.nextLevelPoints ?? 2000).toLocaleString()} pontos
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{(user?.pointsTotal ?? 0).toLocaleString()}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Pontos</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{user?.barsVisited ?? 0}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Bares</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{user?.receiptsApproved ?? 0}</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Notas</div>
        </div>
        <div className="rounded-2xl border border-cr-dark-200 bg-white p-3 text-center shadow-sm">
          <div className="text-lg font-display text-cr-dark-800 tracking-wider">{user?.levelProgress ?? 0}%</div>
          <div className="text-[9px] text-cr-dark-400 mt-0.5 font-bold uppercase tracking-wider">Nivel</div>
        </div>
      </div>

      {/* Personal Info */}
      <Card>
        <div className="text-base font-display text-cr-dark-800 tracking-wider mb-3">INFORMACOES PESSOAIS</div>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Nome</div>
            <div className="text-sm font-semibold text-cr-dark-800">{user?.name ?? "—"}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">E-mail</div>
            <div className="text-sm font-semibold text-cr-dark-800">{user?.email ?? "—"}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">CPF</div>
            <div className="text-sm font-semibold text-cr-dark-800">{formatCpf(user?.cpf ?? null)}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">WhatsApp</div>
            <div className="text-sm font-semibold text-cr-dark-800">{formatPhone(user?.phone ?? null)}</div>
          </div>
          <div className="flex items-center justify-between py-2.5 border-b border-cr-dark-100">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Cidade</div>
            <div className="text-sm font-semibold text-cr-dark-800">{user?.city ?? "—"}</div>
          </div>
          <div className="flex items-center justify-between py-2.5">
            <div className="text-xs text-cr-dark-400 font-bold uppercase tracking-wider">Membro desde</div>
            <div className="text-sm font-semibold text-cr-dark-800">
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                : "—"}
            </div>
          </div>
        </div>
      </Card>

      {/* Achievements (still mock) */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-display text-cr-dark-800 tracking-wider">CONQUISTAS</div>
          <Badge variant="gold">{unlockedCount}/{achievements.length}</Badge>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((a) => (
            <div
              key={a.id}
              className={[
                "rounded-2xl border p-3 text-center transition-all",
                a.unlocked
                  ? "border-cr-yellow-300 bg-white shadow-sm"
                  : "border-cr-dark-200 bg-cr-dark-50 opacity-50",
              ].join(" ")}
            >
              <div className="text-2xl">{a.emoji}</div>
              <div className="mt-1 text-[11px] font-bold text-cr-dark-700 leading-tight">{a.title}</div>
              {a.unlocked && a.date && (
                <div className="mt-0.5 text-[9px] text-cr-dark-400">
                  {new Date(a.date).toLocaleDateString("pt-BR")}
                </div>
              )}
              {!a.unlocked && (
                <div className="mt-0.5 text-[9px] text-cr-dark-400 uppercase tracking-wider">Bloqueado</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={logout}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-cr-burgundy-300 bg-cr-burgundy-50 px-4 py-3 text-sm font-bold text-cr-burgundy-800 transition-all hover:bg-cr-burgundy-100 cursor-pointer uppercase tracking-wider"
      >
        <IconLogout className="h-4 w-4" />
        Sair da conta
      </button>

      <div className="h-2" />
    </div>
  );
}
