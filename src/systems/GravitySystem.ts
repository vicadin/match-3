import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';

export interface FallInfo {
  gem: Gem;
  fromRow: number;
  toRow: number;
  col: number;
}

export class GravitySystem {
  apply(board: Board): FallInfo[] {
    const falls: FallInfo[] = [];

    for (let col = 0; col < board.cols; col++) {
      let writeRow = board.rows - 1;

      for (let row = board.rows - 1; row >= 0; row--) {
        const gem = board.grid[row][col];
        if (!gem) continue;

        if (row !== writeRow) {
          board.set(writeRow, col, gem);
          falls.push({
            gem,
            fromRow: row,
            toRow: writeRow,
            col,
          });
        }

        writeRow--;
      }

      while (writeRow >= 0) {
        board.grid[writeRow][col] = null;
        writeRow--;
      }
    }

    return falls;
  }
}
