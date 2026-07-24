import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { MoveValidator } from './MoveValidator';

export interface MoveHint {
  from: Gem;
  to: Gem;
}

export class HintSystem {
  constructor(private readonly moveValidator: MoveValidator) {}

  findHint(board: Board): MoveHint | null {
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        const gem = board.get(r, c);
        if (!gem) continue;

        const neighbours = [
          { row: r + 1, col: c },
          { row: r, col: c + 1 },
        ];

        for (const pos of neighbours) {
          if (board.isInside(pos.row, pos.col)) {
            const neighbour = board.get(pos.row, pos.col);
            if (neighbour && this.moveValidator.canSwap(board, gem, neighbour)) {
              return { from: gem, to: neighbour };
            }
          }
        }
      }
    }

    return null;
  }
}
