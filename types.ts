export interface Item {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface Tier {
  id: string;
  title: string;
  color: string; // Tailwind bg class or hex
  itemIds: string[];
}

export interface AppState {
  items: Record<string, Item>;
  tiers: Record<string, Tier>;
  tierOrder: string[];
  bankItemIds: string[]; // IDs of items in the "Unassigned" bank
}

export const ItemColors = [
  'bg-rose-500',
  'bg-orange-500',
  'bg-amber-400',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-slate-500',
];
