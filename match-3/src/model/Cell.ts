import type { Gem } from './Gem';

export class Cell {
  gem: Gem | null = null;

  constructor(
    public readonly row: number,
    public readonly col: number
  ) {}

  get isEmpty(): boolean {
    return this.gem === null;
  }

  setGem(gem: Gem | null): void {
    this.gem = gem;

    if (gem) {
      gem.cell = this;
    }
  }

  clear(): void {
    this.gem = null;
  }
}