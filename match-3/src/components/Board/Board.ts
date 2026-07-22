import { GAME_CONFIG } from '@/config/gameConfig';
import { GEMS } from '@/config/boardConfig';
import { Gem } from '@/model/Gem';
import { randomItem } from '@/utils/random';

export class Board {
  readonly rows = GAME_CONFIG.board.rows;
  readonly cols = GAME_CONFIG.board.cols;

  private nextId = 0;

  grid: Gem[][] = [];

  constructor() {
    this.generate();
  }

  private generate() {
    this.grid = [];

    for (let row = 0; row < this.rows; row++) {
      const current: Gem[] = [];

      for (let col = 0; col < this.cols; col++) {
        current.push(this.createGem(row, col));
      }

      this.grid.push(current);
    }

    this.removeInitialMatches();
  }

 createGem(row: number, col: number): Gem {
  return {
    id: this.nextId++,
    type: randomItem(GEMS).id,
    row,
    col,
  };
}

  get(row: number, col: number): Gem {
    return this.grid[row][col];
  }

  set(row: number, col: number, gem: Gem) {
    gem.row = row;
    gem.col = col;
    this.grid[row][col] = gem;
  }

  swap(a: Gem, b: Gem) {
    this.grid[a.row][a.col] = b;
    this.grid[b.row][b.col] = a;

    const r = a.row;
    const c = a.col;

    a.row = b.row;
    a.col = b.col;

    b.row = r;
    b.col = c;
  }

  refill() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        if (!this.grid[row][col]) {
          this.grid[row][col] = this.createGem(row, col);
        }
      }
    }
  }

  private removeInitialMatches() {
    let changed = true;

    while (changed) {
      changed = false;

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          const gem = this.grid[row][col];

          if (
            col >= 2 &&
            this.grid[row][col - 1].type === gem.type &&
            this.grid[row][col - 2].type === gem.type
          ) {
            this.grid[row][col] = this.createGem(row, col);
            changed = true;
          }

          if (
            row >= 2 &&
            this.grid[row - 1][col].type === gem.type &&
            this.grid[row - 2][col].type === gem.type
          ) {
            this.grid[row][col] = this.createGem(row, col);
            changed = true;
          }
        }
      }
    }
  }
}