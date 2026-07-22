import { Board } from '@/components/Board/Board';
import { Gem } from '@/model/Gem';

export class MatchSystem {

  find(board: Board): Gem[] {

    const result = new Set<Gem>();

    // horizontal

    for (let row = 0; row < board.rows; row++) {

      let streak = 1;

      for (let col = 1; col < board.cols; col++) {

        const current = board.get(row, col);
        const previous = board.get(row, col - 1);

        if (current.type === previous.type) {

          streak++;

        } else {

          if (streak >= 3) {

            for (let i = 0; i < streak; i++) {

              result.add(board.get(row, col - 1 - i));

            }

          }

          streak = 1;

        }

      }

      if (streak >= 3) {

        for (let i = 0; i < streak; i++) {

          result.add(board.get(row, board.cols - 1 - i));

        }

      }

    }

    // vertical

    for (let col = 0; col < board.cols; col++) {

      let streak = 1;

      for (let row = 1; row < board.rows; row++) {

        const current = board.get(row, col);
        const previous = board.get(row - 1, col);

        if (current.type === previous.type) {

          streak++;

        } else {

          if (streak >= 3) {

            for (let i = 0; i < streak; i++) {

              result.add(board.get(row - 1 - i, col));

            }

          }

          streak = 1;

        }

      }

      if (streak >= 3) {

        for (let i = 0; i < streak; i++) {

          result.add(board.get(board.rows - 1 - i, col));

        }

      }

    }

    return [...result];

  }

}