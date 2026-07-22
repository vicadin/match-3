import { Cell } from './Cell';

export class Board {
  readonly cells: Cell[][];

  constructor(
    public readonly rows: number,
    public readonly cols: number
  ) {
    this.cells = [];

    for (let row = 0; row < rows; row++) {
      const line: Cell[] = [];

      for (let col = 0; col < cols; col++) {
        line.push(new Cell(row, col));
      }

      this.cells.push(line);
    }
  }

  getCell(row: number, col: number): Cell {
    return this.cells[row][col];
  }

  hasCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.rows &&
      col >= 0 &&
      col < this.cols
    );
  }

  forEach(
    callback: (cell: Cell) => void
  ): void {
    for (const row of this.cells) {
      for (const cell of row) {
        callback(cell);
      }
    }
  }

  forEachRow(
    callback: (cells: Cell[], row: number) => void
  ): void {
    this.cells.forEach(callback);
  }

  forEachColumn(
    callback: (cells: Cell[], col: number) => void
  ): void {
    for (let col = 0; col < this.cols; col++) {
      const column: Cell[] = [];

      for (let row = 0; row < this.rows; row++) {
        column.push(this.cells[row][col]);
      }

      callback(column, col);
    }
  }
}