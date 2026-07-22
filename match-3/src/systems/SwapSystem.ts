import { Board } from '@/model/Board';
import { Gem } from '@/model/Gem';
import { GravitySystem, GravityResult } from './GravitySystem';
import { MatchFinder, Match } from './MatchFinder';

export interface SwapResult {
  success: boolean;
  matches: Match[];
  gravity: GravityResult | null;
  cascades: number;
}

export class SwapSystem {
  constructor(
    private readonly board: Board,
    private readonly matchFinder: MatchFinder,
    private readonly gravitySystem: GravitySystem
  ) {}

  trySwap(first: Gem, second: Gem): SwapResult {
    if (!this.areNeighbours(first, second)) {
      return {
        success: false,
        matches: [],
        gravity: null,
        cascades: 0,
      };
    }

    this.board.swap(first, second);

    let matches = this.matchFinder.find(this.board);

    if (matches.length === 0) {
      // откат
      this.board.swap(first, second);

      return {
        success: false,
        matches: [],
        gravity: null,
        cascades: 0,
      };
    }

    let cascades = 0;
    let lastGravity: GravityResult | null = null;

    while (matches.length > 0) {
      cascades++;

      this.removeMatches(matches);

      lastGravity = this.gravitySystem.apply(this.board);

      matches = this.matchFinder.find(this.board);
    }

    return {
      success: true,
      matches,
      gravity: lastGravity,
      cascades,
    };
  }

  private removeMatches(matches: Match[]): void {
    for (const match of matches) {
      for (const gem of match.gems) {
        this.board.grid[gem.row][gem.col] = null as never;
      }
    }
  }

  private areNeighbours(a: Gem, b: Gem): boolean {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);

    return dx + dy === 1;
  }
}