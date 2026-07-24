import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { MatchFinder } from './MatchFinder';

export class MoveValidator {
  constructor(private readonly matchFinder: MatchFinder) {}

  canSwap(board: Board, a: Gem, b: Gem): boolean {
    if (!this.areNeighbours(a, b)) return false;

    board.swap(a, b);
    const matches = this.matchFinder.find(board);
    board.swap(a, b);

    return matches.length > 0;
  }

  areNeighbours(a: Gem, b: Gem): boolean {
    const dx = Math.abs(a.col - b.col);
    const dy = Math.abs(a.row - b.row);
    return dx + dy === 1;
  }
}
