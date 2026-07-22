export enum GemType {
  Red,
  Blue,
  Green,
  Yellow,
  Purple,
  Orange,
}

export interface GemDefinition {
  id: GemType;
  color: string;
}

export const GEMS: readonly GemDefinition[] = [
  {
    id: GemType.Red,
    color: '#ff4d4d',
  },
  {
    id: GemType.Blue,
    color: '#42a5ff',
  },
  {
    id: GemType.Green,
    color: '#54d26b',
  },
  {
    id: GemType.Yellow,
    color: '#ffd84d',
  },
  {
    id: GemType.Purple,
    color: '#b36dff',
  },
  {
    id: GemType.Orange,
    color: '#ff974d',
  },
] as const;