import { Gem } from './Gem';

export type MatchShape = '3-row' | '4-row' | '5-row' | 'L' | 'T' | 'cross';

export interface Match {
  gems: Gem[];
  shape: MatchShape;
  centerGem?: Gem;
}
