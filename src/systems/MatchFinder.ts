import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';

export interface Match {
  gems: Gem[];
}

export class MatchFinder {
  find(board: Board): Match[] {
    const matches: Match[] = [];
    const visited = new Set<number>();

    // Horizontal
    for (let row = 0; row < board.rows; row++) {
      let start = 0;

      while (start < board.cols) {
        const type = board.get(row, start).type;

        let end = start + 1;

        while (
          end < board.cols &&
          board.get(row, end).type === type
        ) {
          end++;
        }

        if (end - start >= 3) {
          const gems: Gem[] = [];

          for (let col = start; col < end; col++) {
            const gem = board.get(row, col);

            if (!visited.has(gem.id)) {
              visited.add(gem.id);
              gems.push(gem);
            }
          }

          if (gems.length) {
            matches.push({ gems });
          }
        }

        start = end;
      }
    }

    // Vertical
    for (let col = 0; col < board.cols; col++) {
      let start = 0;

      while (start < board.rows) {
        const type = board.get(start, col).type;

        let end = start + 1;

        while (
          end < board.rows &&
          board.get(end, col).type === type
        ) {
          end++;
        }

        if (end - start >= 3) {
          const gems: Gem[] = [];

          for (let row = start; row < end; row++) {
            const gem = board.get(row, col);

            if (!visited.has(gem.id)) {
              visited.add(gem.id);
              gems.push(gem);
            }
          }

          if (gems.length) {
            matches.push({ gems });
          }
        }

        start = end;
      }
    }

    return matches;
  }

  hasMatches(board: Board): boolean {
    return this.find(board).length > 0;
  }
}