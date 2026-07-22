import { Board } from '@/components/Board/Board';

export class FallSystem {

  collapse(board: Board) {

    for (let col = 0; col < board.cols; col++) {

      let empty = board.rows - 1;

      for (let row = board.rows - 1; row >= 0; row--) {

        const gem = board.grid[row][col];

        if (!gem) {
          continue;
        }

        board.set(empty, col, gem);

        empty--;

      }

      while (empty >= 0) {

        board.grid[empty][col] = null as any;

        empty--;

      }

    }

    board.refill();

  }

}