export type AppUser = {
  id: string;
  name: string;
  phone: string;
  city: string;
  email: string;
  pointsTotal: number;
  pointsThisMonth: number;
  level: string;
  levelProgress: number; // 0-100
  nextLevel: string;
  nextLevelPoints: number;
  barsVisited: number;
  receiptsApproved: number;
  memberSince: string;
  avatarColor: string;
};

export type AppBar = {
  id: string;
  name: string;
  city: string;
  neighborhood: string;
  address: string;
  imageUrl: string;
  minimumSpend: number;
  distanceKm: number;
  openingHours: string;
  rules: string;
  rating: number;
  category: string;
  prizes: { id: string; name: string; points: number }[];
  instagramHandle?: string;
  latitude?: number;
  longitude?: number;
};

export type PointsHistoryItem = {
  id: string;
  date: string;
  barId?: string;
  barName?: string;
  routeName?: string;
  points: number;
  type: "route_bar" | "challenge" | "route_bonus";
  description: string;
  status: "approved" | "pending";
};

export type RankingItem = {
  position: number;
  userName: string;
  points: number;
  barsVisited: number;
  isCurrentUser?: boolean;
  avatarColor: string;
};

export type RouteBar = {
  barId: string;
  barName: string;
  neighborhood: string;
  visited: boolean;
  points: number;
};

export type GameRoute = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: "fácil" | "médio" | "difícil";
  bars: RouteBar[];
  bonusPoints: number;
  prize: string;
  prizeEmoji: string;
  deadline: string;
  totalParticipants: number;
  status: "active" | "completed" | "locked";
};

export type TreasureMission = {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string;
  emoji: string;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  date?: string;
};

/* ── Old types kept for compatibility ── */
export type AppRoute = {
  id: string;
  name: string;
  barsCount: number;
  etaMinutes: number;
  description: string;
};

/* ── Data ── */

export const currentUser: AppUser = {
  id: "app_usr_1",
  name: "Ana Paula",
  phone: "+55 11 98888-7777",
  city: "São Paulo",
  email: "ana.paula@email.com",
  pointsTotal: 1240,
  pointsThisMonth: 340,
  level: "Raiz Bronze",
  levelProgress: 62,
  nextLevel: "Raiz Prata",
  nextLevelPoints: 2000,
  barsVisited: 8,
  receiptsApproved: 12,
  memberSince: "2025-11",
  avatarColor: "#2D6A4F",
};

export const bars: AppBar[] = [
  {
    id: "app_bar_1",
    name: "Bar do Centro",
    city: "São Paulo",
    neighborhood: "Centro",
    address: "Av. Principal, 123",
    imageUrl:
      "https://images.unsplash.com/photo-1525268323446-0505b6fe7778?auto=format&fit=crop&w=1200&q=60",
    minimumSpend: 50,
    distanceKm: 1.2,
    openingHours: "Seg–Dom • 12:00–23:00",
    rules: "Para pontuar, consumo mínimo de R$ 50 por nota.",
    rating: 4.7,
    category: "Boteco",
    prizes: [
      { id: "p1", name: "Camiseta Cliente Raiz", points: 900 },
      { id: "p2", name: "Vale Chopp", points: 450 },
    ],
    instagramHandle: "@bardocentro",
    latitude: -23.5505,
    longitude: -46.6333,
  },
  {
    id: "app_bar_2",
    name: "Vila Pub",
    city: "Campinas",
    neighborhood: "Cambuí",
    address: "Rua das Flores, 55",
    imageUrl:
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=60",
    minimumSpend: 40,
    distanceKm: 4.8,
    openingHours: "Ter–Dom • 16:00–02:00",
    rules: "Para pontuar, consumo mínimo de R$ 40 por nota.",
    rating: 4.5,
    category: "Pub",
    prizes: [
      { id: "p3", name: "Caneca personalizada", points: 700 },
      { id: "p4", name: "Combo petiscos", points: 500 },
    ],
    instagramHandle: "@vilapub",
    latitude: -22.9099,
    longitude: -47.0626,
  },
  {
    id: "app_bar_3",
    name: "Chopp & Cia",
    city: "Curitiba",
    neighborhood: "Batel",
    address: "Alameda Central, 900",
    imageUrl:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=60",
    minimumSpend: 60,
    distanceKm: 2.3,
    openingHours: "Qua–Dom • 17:00–01:00",
    rules: "Para pontuar, consumo mínimo de R$ 60 por nota.",
    rating: 4.8,
    category: "Choperia",
    prizes: [{ id: "p5", name: "Boné Cliente Raiz", points: 650 }],
    instagramHandle: "@choppecia",
    latitude: -25.4411,
    longitude: -49.2763,
  },
  {
    id: "app_bar_4",
    name: "Boteco da Praça",
    city: "Rio de Janeiro",
    neighborhood: "Botafogo",
    address: "Praça do Sol, 10",
    imageUrl:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=60",
    minimumSpend: 35,
    distanceKm: 6.1,
    openingHours: "Seg–Sex • 11:00–22:00",
    rules: "Para pontuar, consumo mínimo de R$ 35 por nota.",
    rating: 4.3,
    category: "Boteco",
    prizes: [{ id: "p6", name: "Vale sobremesa", points: 300 }],
    instagramHandle: "@botecodapraca",
    latitude: -22.9519,
    longitude: -43.1858,
  },
];

export const pointsHistory: PointsHistoryItem[] = [
  { id: "ph_1", date: "2026-02-22", barId: "app_bar_1", barName: "Bar do Centro", routeName: "Rota do Centro", points: 50, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_2", date: "2026-02-22", barId: "app_bar_1", barName: "Bar do Centro", routeName: "Rota do Centro", points: 30, type: "challenge", description: "Desafio: Caça ao Mascote", status: "approved" },
  { id: "ph_3", date: "2026-02-20", barId: "app_bar_2", barName: "Vila Pub", routeName: "Tour Cervejeiro", points: 40, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_4", date: "2026-02-20", routeName: "Tour Cervejeiro", points: 150, type: "route_bonus", description: "Bônus: rota completa!", status: "approved" },
  { id: "ph_5", date: "2026-02-19", barId: "app_bar_3", barName: "Chopp & Cia", routeName: "Tour Cervejeiro", points: 60, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_6", date: "2026-02-15", barId: "app_bar_4", barName: "Boteco da Praça", routeName: "Rota do Centro", points: 35, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_7", date: "2026-02-10", barId: "app_bar_3", barName: "Chopp & Cia", routeName: "Tour Cervejeiro", points: 60, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_8", date: "2026-02-10", barId: "app_bar_3", routeName: "Tour Cervejeiro", points: 25, type: "challenge", description: "Desafio: Selfie no Balcão", status: "approved" },
  { id: "ph_9", date: "2026-01-28", barId: "app_bar_1", barName: "Bar do Centro", routeName: "Tour Cervejeiro", points: 50, type: "route_bar", description: "Visita ao bar na rota", status: "approved" },
  { id: "ph_10", date: "2026-02-23", barId: "app_bar_2", barName: "Vila Pub", routeName: "Rota do Centro", points: 40, type: "route_bar", description: "Visita ao bar na rota", status: "pending" },
];

const avatarColors = ["#2D6A4F", "#C8962E", "#5C3D2E", "#3B7A57", "#8B6514", "#7A5240"];

export const ranking: RankingItem[] = Array.from({ length: 20 }).map((_, i) => {
  const position = i + 1;
  const isCurrentUser = position === 7;

  return {
    position,
    userName: isCurrentUser ? currentUser.name : `Usuário ${position}`,
    points: 2500 - position * 70,
    barsVisited: Math.max(1, 15 - position),
    isCurrentUser,
    avatarColor: isCurrentUser ? currentUser.avatarColor : avatarColors[i % avatarColors.length],
  };
});

export const gameRoutes: GameRoute[] = [
  {
    id: "gr_1",
    name: "Rota do Centro",
    description: "Explore os melhores bares do centro em uma noite. Visite todos e ganhe bônus!",
    emoji: "🏙️",
    difficulty: "fácil",
    bars: [
      { barId: "app_bar_1", barName: "Bar do Centro", neighborhood: "Centro", visited: true, points: 50 },
      { barId: "app_bar_4", barName: "Boteco da Praça", neighborhood: "Botafogo", visited: true, points: 35 },
      { barId: "app_bar_2", barName: "Vila Pub", neighborhood: "Cambuí", visited: false, points: 40 },
    ],
    bonusPoints: 200,
    prize: "1 Balde Eisenbahn",
    prizeEmoji: "🍺",
    deadline: "2026-03-01",
    totalParticipants: 142,
    status: "active",
  },
  {
    id: "gr_2",
    name: "Happy Hour Raiz",
    description: "A rota perfeita para sexta-feira. 4 bares, drinks, petiscos e muitos pontos.",
    emoji: "🌆",
    difficulty: "médio",
    bars: [
      { barId: "app_bar_2", barName: "Vila Pub", neighborhood: "Cambuí", visited: false, points: 40 },
      { barId: "app_bar_1", barName: "Bar do Centro", neighborhood: "Centro", visited: false, points: 50 },
      { barId: "app_bar_3", barName: "Chopp & Cia", neighborhood: "Batel", visited: false, points: 60 },
      { barId: "app_bar_4", barName: "Boteco da Praça", neighborhood: "Botafogo", visited: false, points: 35 },
    ],
    bonusPoints: 350,
    prize: "2 Baldes Eisenbahn + Camiseta",
    prizeEmoji: "🏆",
    deadline: "2026-03-15",
    totalParticipants: 89,
    status: "active",
  },
  {
    id: "gr_3",
    name: "Maratona Raiz",
    description: "Para os mais dedicados! 5 bares em um fim de semana. Prêmio exclusivo para quem completar.",
    emoji: "🔥",
    difficulty: "difícil",
    bars: [
      { barId: "app_bar_1", barName: "Bar do Centro", neighborhood: "Centro", visited: false, points: 50 },
      { barId: "app_bar_2", barName: "Vila Pub", neighborhood: "Cambuí", visited: false, points: 40 },
      { barId: "app_bar_3", barName: "Chopp & Cia", neighborhood: "Batel", visited: false, points: 60 },
      { barId: "app_bar_4", barName: "Boteco da Praça", neighborhood: "Botafogo", visited: false, points: 35 },
      { barId: "app_bar_1", barName: "Bar do Centro", neighborhood: "Centro", visited: false, points: 50 },
    ],
    bonusPoints: 500,
    prize: "Kit Raiz Premium + 3 Baldes",
    prizeEmoji: "👑",
    deadline: "2026-03-30",
    totalParticipants: 34,
    status: "locked",
  },
  {
    id: "gr_4",
    name: "Tour Cervejeiro",
    description: "Visitou 3 bares com cervejas artesanais e completou a rota. Parabéns!",
    emoji: "🍻",
    difficulty: "fácil",
    bars: [
      { barId: "app_bar_3", barName: "Chopp & Cia", neighborhood: "Batel", visited: true, points: 60 },
      { barId: "app_bar_1", barName: "Bar do Centro", neighborhood: "Centro", visited: true, points: 50 },
      { barId: "app_bar_2", barName: "Vila Pub", neighborhood: "Cambuí", visited: true, points: 40 },
    ],
    bonusPoints: 150,
    prize: "Caneca Exclusiva CR",
    prizeEmoji: "🍺",
    deadline: "2026-02-20",
    totalParticipants: 210,
    status: "completed",
  },
];

export type UserCheckIn = {
  id: string;
  date: string;
  barId: string;
  barName: string;
  imageUrl: string;
  instagramHandle?: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  userLatitude?: number;
  userLongitude?: number;
  gpsMatchStatus?: "match" | "no_match" | "unavailable";
  distanceMeters?: number;
};

export const userCheckins: UserCheckIn[] = [
  {
    id: "uck_1",
    date: "2026-02-23",
    barId: "app_bar_1",
    barName: "Bar do Centro",
    imageUrl: "https://images.unsplash.com/photo-1546622891-02c72c1537b6?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@anapaula_cr",
    status: "pending",
    userLatitude: -23.5508,
    userLongitude: -46.6335,
    gpsMatchStatus: "match",
    distanceMeters: 45,
  },
  {
    id: "uck_2",
    date: "2026-02-20",
    barId: "app_bar_2",
    barName: "Vila Pub",
    imageUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@anapaula_cr",
    status: "approved",
    userLatitude: -22.9101,
    userLongitude: -47.0628,
    gpsMatchStatus: "match",
    distanceMeters: 30,
  },
  {
    id: "uck_3",
    date: "2026-02-15",
    barId: "app_bar_3",
    barName: "Chopp & Cia",
    imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=60",
    instagramHandle: "@anapaula_cr",
    status: "approved",
    gpsMatchStatus: "unavailable",
  },
];

/* Legacy alias */
export const routes: AppRoute[] = gameRoutes.map((r) => ({
  id: r.id,
  name: r.name,
  barsCount: r.bars.length,
  etaMinutes: r.bars.length * 60,
  description: r.description,
}));

export const treasureMissions: TreasureMission[] = [
  {
    id: "m1",
    title: "Primeiro check-in",
    description: "Visite 1 bar participante e registre uma nota.",
    progress: 1,
    total: 1,
    reward: "+50 pontos bônus",
    emoji: "📍",
  },
  {
    id: "m2",
    title: "Trinca Raiz",
    description: "Pontue em 3 bares diferentes.",
    progress: 2,
    total: 3,
    reward: "+150 pontos bônus",
    emoji: "🎯",
  },
  {
    id: "m3",
    title: "Caçador de prêmios",
    description: "Resgate 1 prêmio.",
    progress: 0,
    total: 1,
    reward: "Badge exclusivo",
    emoji: "🏅",
  },
  {
    id: "m4",
    title: "Maratonista",
    description: "Complete 3 rotas em um mês.",
    progress: 1,
    total: 3,
    reward: "+500 pontos bônus",
    emoji: "🏃",
  },
];

export const achievements: Achievement[] = [
  { id: "a1", title: "Primeiro Bar", description: "Visitou seu primeiro bar", emoji: "🎉", unlocked: true, date: "2025-11-10" },
  { id: "a2", title: "Nota Aprovada", description: "Primeira nota fiscal aprovada", emoji: "✅", unlocked: true, date: "2025-11-10" },
  { id: "a3", title: "5 Bares", description: "Visitou 5 bares diferentes", emoji: "⭐", unlocked: true, date: "2025-12-15" },
  { id: "a4", title: "Top 10", description: "Entrou no Top 10 do ranking", emoji: "🏆", unlocked: false },
  { id: "a5", title: "Rota Completa", description: "Completou uma rota inteira", emoji: "🗺️", unlocked: true, date: "2026-02-20" },
  { id: "a6", title: "Raiz de Verdade", description: "Acumulou 5000 pontos", emoji: "👑", unlocked: false },
];
