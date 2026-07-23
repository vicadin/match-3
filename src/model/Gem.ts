import { GemType, SpecialType } from '@/types/GameTypes';

export interface Gem {
  id: number;
  type: GemType;
  row: number;
  col: number;
  special?: SpecialType;
  isMatched?: boolean;
}
