import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { MatchFinder } from './MatchFinder';
import { Match } from '@/model/Match';

export interface SwapResult {
  success: boolean;
  matches: Match[];
}

export class SwapSystem {
  constructor(
    private readonly board: Board,
    private readonly matchFinder: MatchFinder
  ) {}

  trySwap(first: Gem, second: Gem): SwapResult {
    if (!this.areNeighbours(first, second)) {
      return {
        success: false,
        matches: [],
      };
    }

    this.board.swap(first, second);
    const matches = this.matchFinder.find(this.board);

    if (matches.length === 0) {
      this.board.swap(first, second);
      return {
        success: false,
        matches: [],
      };
    }

    return {
      success: true,
      matches,
    };
  }

  private areNeighbours(a: Gem, b: Gem): boolean {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + dy === 1;
  }
}
