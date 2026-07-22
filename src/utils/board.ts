import { Gem } from '@/model/Gem';

export function insideBoard(
  row: number,
  col: number,
  rows: number,
  cols: number
) {
  return (
    row >= 0 &&
    row < rows &&
    col >= 0 &&
    col < cols
  );
}

export function swap(board: Gem[][], a: Gem, b: Gem) {
  const tempRow = a.row;
  const tempCol = a.col;

  board[a.row][a.col] = b;
  board[b.row][b.col] = a;

  a.row = b.row;
  a.col = b.col;

  b.row = tempRow;
  b.col = tempCol;
}