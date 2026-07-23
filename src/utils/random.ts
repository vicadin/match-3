import type { TileColor } from '@/types/GameTypes';

const COLORS: TileColor[] = [
  'red',
  'yellow',
  'green',
  'blue',
  'purple',
];

export function randomColor(): TileColor {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}
