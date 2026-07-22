import type { Cell } from './Cell';
import type { GemType } from '@/config/boardConfig';

export class Gem {
  constructor(
    public readonly id: number,
    public readonly type: GemType,
    public cell: Cell
  ) {}

  get row(): number {
    return this.cell.row;
  }

  get col(): number {
    return this.cell.col;
  }
}