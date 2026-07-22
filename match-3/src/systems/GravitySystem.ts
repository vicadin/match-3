import { Board } from '@/model/Board';
import { Gem } from '@/model/Gem';

export interface FallMove {
  gem: Gem;
  fromRow: number;
  toRow: number;
}

export interface SpawnMove {
  gem: Gem;
  fromRow: number;
  toRow: number;
}

export interface GravityResult {
  falls: FallMove[];
  spawns: SpawnMove[];
}

export class GravitySystem {
  apply(board: Board): GravityResult {
    const falls: FallMove[] = [];
    const spawns: SpawnMove[] = [];

    for (let col = 0; col < board.cols; col++) {
      let writeRow = board.rows - 1;

      // Опускаем существующие камни вниз
      for (let row = board.rows - 1; row >= 0; row--) {
        const gem = board.grid[row][col];

        if (!gem) {
          continue;
        }

        if (row !== writeRow) {
          board.set(writeRow, col, gem);

          falls.push({
            gem,
            fromRow: row,
            toRow: writeRow,
          });
        }

        writeRow--;
      }

      // Очищаем верхние клетки
      while (writeRow >= 0) {
        board.grid[writeRow][col] = null as never;
        writeRow--;
      }

      // Создаем новые камни сверху
      let spawnIndex = 0;

      while (spawnIndex < board.rows && !board.grid[spawnIndex][col]) {
        const gem = board.createGem(spawnIndex, col);

        board.set(spawnIndex, col, gem);

        spawns.push({
          gem,
          fromRow: -1 - spawnIndex,
          toRow: spawnIndex,
        });

        spawnIndex++;
      }
    }

    return {
      falls,
      spawns,
    };
  }
}