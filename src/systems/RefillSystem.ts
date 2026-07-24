import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';

export interface SpawnInfo {
  gem: Gem;
  fromRow: number;
  toRow: number;
  col: number;
}

export class RefillSystem {
  refill(board: Board): SpawnInfo[] {
    const spawns: SpawnInfo[] = [];

    for (let col = 0; col < board.cols; col++) {
      let spawnOffset = 1;
      for (let row = board.rows - 1; row >= 0; row--) {
        if (board.grid[row][col] === null) {
          const gem = board.createGem(row, col);
          board.set(row, col, gem);

          spawns.push({
            gem,
            fromRow: -spawnOffset,
            toRow: row,
            col,
          });
          spawnOffset++;
        }
      }
    }

    return spawns;
  }
}
