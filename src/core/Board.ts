import { GAME_CONFIG } from '@/config/gameConfig';
import { GEMS } from '@/config/boardConfig';
import { Gem } from '@/model/Gem';
import { GemType, SpecialType } from '@/types/GameTypes';
import { randomItem } from '@/utils/random';

export interface MoveHint {
  from: Gem;
  to: Gem;
}

export class Board {
  readonly rows = GAME_CONFIG.board.rows;
  readonly cols = GAME_CONFIG.board.cols;

  private nextId = 0;
  grid: (Gem | null)[][] = [];

  constructor() {
    this.generateRandomBoard();
  }

  generateRandomBoard(): void {
    let attempts = 0;
    while (attempts < 100) {
      attempts++;
      this.nextId = 0;
      this.grid = [];

      for (let r = 0; r < this.rows; r++) {
        const line: (Gem | null)[] = [];
        for (let c = 0; c < this.cols; c++) {
          let type: GemType;
          do {
            type = Math.floor(Math.random() * GEMS.length) as GemType;
          } while (
            (c >= 2 && line[c - 1]?.type === type && line[c - 2]?.type === type) ||
            (r >= 2 && this.grid[r - 1][c]?.type === type && this.grid[r - 2][c]?.type === type)
          );

          line.push({
            id: this.nextId++,
            type,
            row: r,
            col: c,
            special: SpecialType.None,
          });
        }
        this.grid.push(line);
      }

      if (this.hasValidMove()) {
        break;
      }
    }
  }


  generatePlayableBoard(): void {
    this.generateRandomBoard();
  }

  hasValidMove(): boolean {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = this.grid[r][c];
        if (!current) continue;

        // check horizontal swap
        if (c + 1 < this.cols) {
          const right = this.grid[r][c + 1];
          if (right) {
            this.swap(current, right);
            const matches = this.findMatches().length > 0;
            this.swap(current, right);
            if (matches) return true;
          }
        }

        // Check vertical swap
        if (r + 1 < this.rows) {
          const down = this.grid[r + 1][c];
          if (down) {
            this.swap(current, down);
            const matches = this.findMatches().length > 0;
            this.swap(current, down);
            if (matches) return true;
          }
        }
      }
    }
    return false;
  }

  public createGem(row: number, col: number, type?: GemType): Gem {
    return {
      id: this.nextId++,
      type: type ?? randomItem(GEMS).id,
      row,
      col,
      special: SpecialType.None,
    };
  }

  get(row: number, col: number): Gem | null {
    if (!this.isInside(row, col)) return null;
    return this.grid[row][col];
  }

  set(row: number, col: number, gem: Gem | null): void {
    if (gem) {
      gem.row = row;
      gem.col = col;
    }
    this.grid[row][col] = gem;
  }

  swap(a: Gem, b: Gem): void {
    const aRow = a.row;
    const aCol = a.col;
    const bRow = b.row;
    const bCol = b.col;

    this.grid[aRow][aCol] = b;
    this.grid[bRow][bCol] = a;

    a.row = bRow;
    a.col = bCol;

    b.row = aRow;
    b.col = aCol;
  }

  findMatches(): Gem[][] {
    const matches: Gem[][] = [];

    // horizontal
    for (let row = 0; row < this.rows; row++) {
      let chain: Gem[] = [];
      for (let col = 0; col < this.cols; col++) {
        const gem = this.grid[row][col];
        if (gem && (chain.length === 0 || chain[0].type === gem.type)) {
          chain.push(gem);
        } else {
          if (chain.length >= 3) {
            matches.push(chain);
          }
          chain = gem ? [gem] : [];
        }
      }
      if (chain.length >= 3) {
        matches.push(chain);
      }
    }

    // vertical
    for (let col = 0; col < this.cols; col++) {
      let chain: Gem[] = [];
      for (let row = 0; row < this.rows; row++) {
        const gem = this.grid[row][col];
        if (gem && (chain.length === 0 || chain[0].type === gem.type)) {
          chain.push(gem);
        } else {
          if (chain.length >= 3) {
            matches.push(chain);
          }
          chain = gem ? [gem] : [];
        }
      }
      if (chain.length >= 3) {
        matches.push(chain);
      }
    }

    return matches;
  }

  isInside(row: number, col: number): boolean {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }

  clone(): Board {
    const cloned = new Board();
    cloned.grid = this.grid.map(row =>
      row.map(gem => (gem ? { ...gem } : null))
    );
    return cloned;
  }
}
