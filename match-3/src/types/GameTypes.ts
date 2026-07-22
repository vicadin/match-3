export type TileColor =
  | 'red'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple';

export interface Tile {
  id: number;
  row: number;
  col: number;
  color: TileColor;
  element: HTMLElement;
}

export interface Position {
  row: number;
  col: number;
}

export interface MatchGroup {
  tiles: Tile[];
}