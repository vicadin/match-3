import { GemType } from '@/types/GameTypes';

export const GEM_SIZE = 64;

export interface GemDefinition {
  id: GemType;
  name: string;
  color: string;
  gradient: string;
  iconSvg: string;
}

export const GEMS: readonly GemDefinition[] = [
  {
    id: GemType.Red,
    name: 'Red Candy',
    color: '#ff3b30',
    gradient: 'radial-gradient(circle at 35% 30%, #ff8580 0%, #ff3b30 50%, #c10000 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
  },
  {
    id: GemType.Blue,
    name: 'Blue Gem',
    color: '#007aff',
    gradient: 'radial-gradient(circle at 35% 30%, #64b5f6 0%, #007aff 50%, #004080 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><path d="M12 2L2 12l10 10 10-10L12 2z"/></svg>',
  },
  {
    id: GemType.Green,
    name: 'Green Drop',
    color: '#34c759',
    gradient: 'radial-gradient(circle at 35% 30%, #81c784 0%, #34c759 50%, #1b5e20 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  },
  {
    id: GemType.Yellow,
    name: 'Yellow Star',
    color: '#ffcc00',
    gradient: 'radial-gradient(circle at 35% 30%, #ffeb3b 0%, #ffcc00 50%, #e65100 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  },
  {
    id: GemType.Purple,
    name: 'Purple Moon',
    color: '#af52de',
    gradient: 'radial-gradient(circle at 35% 30%, #e1bee7 0%, #af52de 50%, #4a148c 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-5.4-5.4c0-1.81.89-3.42 2.26-4.4C12.92 3.04 12.46 3 12 3z"/></svg>',
  },
  {
    id: GemType.Orange,
    name: 'Orange Orb',
    color: '#ff9500',
    gradient: 'radial-gradient(circle at 35% 30%, #ffe0b2 0%, #ff9500 50%, #e65100 100%)',
    iconSvg: '<svg viewBox="0 0 24 24" fill="#ffffff" opacity="0.95"><circle cx="12" cy="12" r="9"/></svg>',
  },
] as const;
