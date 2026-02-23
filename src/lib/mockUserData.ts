export type AppUser = {
  id: string;
  name: string;
  phone: string;
  city: string;
  pointsTotal: number;
  level: string;
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
  prizes: { id: string; name: string; points: number }[];
};

export type PointsHistoryItem = {
  id: string;
  date: string;
  barId: string;
  barName: string;
  points: number;
};

export type RankingItem = {
  position: number;
  userName: string;
  points: number;
  isCurrentUser?: boolean;
};

export type AppRoute = {
  id: string;
  name: string;
  barsCount: number;
  etaMinutes: number;
  description: string;
};

export type TreasureMission = {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
};

export const currentUser: AppUser = {
  id: "app_usr_1",
  name: "Ana Paula",
  phone: "+55 11 98888-7777",
  city: "São Paulo",
  pointsTotal: 1240,
  level: "Raiz Bronze",
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
    prizes: [
      { id: "p1", name: "Camiseta Cliente Raiz", points: 900 },
      { id: "p2", name: "Vale Chopp", points: 450 },
    ],
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
    prizes: [
      { id: "p3", name: "Caneca personalizada", points: 700 },
      { id: "p4", name: "Combo petiscos", points: 500 },
    ],
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
    prizes: [{ id: "p5", name: "Boné Cliente Raiz", points: 650 }],
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
    prizes: [{ id: "p6", name: "Vale sobremesa", points: 300 }],
  },
];

export const pointsHistory: PointsHistoryItem[] = [
  { id: "ph_1", date: "2026-01-23", barId: "app_bar_1", barName: "Bar do Centro", points: 120 },
  { id: "ph_2", date: "2026-01-21", barId: "app_bar_2", barName: "Vila Pub", points: 80 },
  { id: "ph_3", date: "2026-01-18", barId: "app_bar_1", barName: "Bar do Centro", points: 60 },
  { id: "ph_4", date: "2026-01-15", barId: "app_bar_3", barName: "Chopp & Cia", points: 140 },
];

export const ranking: RankingItem[] = Array.from({ length: 20 }).map((_, i) => {
  const position = i + 1;
  const isCurrentUser = position === 7;

  return {
    position,
    userName: isCurrentUser ? currentUser.name : `Usuário ${position}`,
    points: 2500 - position * 70,
    isCurrentUser,
  };
});

export const routes: AppRoute[] = [
  {
    id: "route_1",
    name: "Rota do Centro",
    barsCount: 3,
    etaMinutes: 180,
    description: "Uma rota rápida com bares próximos e bons pontos para começar.",
  },
  {
    id: "route_2",
    name: "Rota do Happy Hour",
    barsCount: 4,
    etaMinutes: 240,
    description: "Perfeita para o final do dia, com paradas clássicas e prêmios fáceis.",
  },
  {
    id: "route_3",
    name: "Rota Raiz",
    barsCount: 5,
    etaMinutes: 320,
    description: "Para quem quer pontuar forte e explorar vários bares no mesmo rolê.",
  },
];

export const treasureMissions: TreasureMission[] = [
  {
    id: "m1",
    title: "Missão 1: Primeiro check-in",
    description: "Visite 1 bar participante e registre uma nota.",
    progress: 1,
    total: 1,
  },
  {
    id: "m2",
    title: "Missão 2: Trinca Raiz",
    description: "Pontue em 3 bares diferentes.",
    progress: 2,
    total: 3,
  },
  {
    id: "m3",
    title: "Missão 3: Caçador de prêmios",
    description: "Resgate 1 prêmio.",
    progress: 0,
    total: 1,
  },
];
