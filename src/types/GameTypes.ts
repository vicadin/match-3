export enum GemType {
  Red = 0,
  Blue = 1,
  Green = 2,
  Yellow = 3,
  Purple = 4,
  Orange = 5,
}

export enum SpecialType {
  None = 'none',
  StripedH = 'striped_h',
  StripedV = 'striped_v',
  Wrapped = 'wrapped',
  ColorBomb = 'color_bomb',
}

export type TileColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export enum GameStateEnum {
  BOOT = 'BOOT',
  READY = 'READY',
  WAIT_INPUT = 'WAIT_INPUT',
  IDLE = 'IDLE',
  HINT = 'HINT',
  DRAGGING = 'DRAGGING',
  SWAPPING = 'SWAPPING',
  MATCHING = 'MATCHING',
  REMOVING = 'REMOVING',
  FALLING = 'FALLING',
  REFILLING = 'REFILLING',
  CHECKING = 'CHECKING',
  WIN = 'WIN',
  CTA = 'CTA',
  COMPLETED = 'COMPLETED',
}

export interface Position {
  row: number;
  col: number;
}
