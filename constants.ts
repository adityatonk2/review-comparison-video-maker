import { AppState, Item } from './types';

// Helper to generate IDs
export const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const INITIAL_DATA: AppState = {
  items: {
    'item-1': { id: 'item-1', content: 'Item 1', imageUrl: 'https://picsum.photos/100/100?random=1' },
    'item-2': { id: 'item-2', content: 'Item 2', imageUrl: 'https://picsum.photos/100/100?random=2' },
    'item-3': { id: 'item-3', content: 'Item 3', imageUrl: 'https://picsum.photos/100/100?random=3' },
    'item-4': { id: 'item-4', content: 'Item 4' },
    'item-5': { id: 'item-5', content: 'Item 5', imageUrl: 'https://picsum.photos/100/100?random=5' },
  },
  tiers: {
    'tier-excellent': {
      id: 'tier-excellent',
      title: 'Excellent',
      color: 'bg-rose-500',
      itemIds: [],
    },
    'tier-good': {
      id: 'tier-good',
      title: 'Good',
      color: 'bg-orange-400',
      itemIds: [],
    },
    'tier-average': {
      id: 'tier-average',
      title: 'Average',
      color: 'bg-yellow-400',
      itemIds: [],
    },
    'tier-below': {
      id: 'tier-below',
      title: 'Below Average',
      color: 'bg-green-400',
      itemIds: [],
    },
    'tier-poor': {
      id: 'tier-poor',
      title: 'Poor',
      color: 'bg-blue-400',
      itemIds: [],
    },
  },
  tierOrder: ['tier-excellent', 'tier-good', 'tier-average', 'tier-below', 'tier-poor'],
  bankItemIds: ['item-1', 'item-2', 'item-3', 'item-4', 'item-5'],
};
