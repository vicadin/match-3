import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { MatchFinder } from './MatchFinder';
import { MoveValidator } from './MoveValidator';
import { HintSystem } from './HintSystem';

export class ShuffleSystem {
  constructor(
    private readonly matchFinder: MatchFinder,
    private readonly moveValidator: MoveValidator,
    private readonly hintSystem: HintSystem
  ) {}

  shuffle(board: Board): void {
    const gems: Gem[] = [];
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        const g = board.grid[r][c];
        if (g) gems.push(g);
      }
    }

    let attempts = 0;
    while (attempts < 100) {
      attempts++;
      for (let i = gems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = gems[i];
        gems[i] = gems[j];
        gems[j] = temp;
      }

      let index = 0;
      for (let r = 0; r < board.rows; r++) {
        for (let c = 0; c < board.cols; c++) {
          const gem = gems[index++];
          board.set(r, c, gem);
        }
      }

      const hasInitialMatches = this.matchFinder.hasMatches(board);
      const hasValidMove = this.hintSystem.findHint(board) !== null;

      if (!hasInitialMatches && hasValidMove) {
        break;
      }
    }
  }
}
