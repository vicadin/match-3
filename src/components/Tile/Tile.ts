import { TILE_SIZE, MOVE_DURATION } from '@/config/gameConfig';
import type { TileColor } from '@/types/GameTypes';

export class Tile {
  readonly id: number;
  readonly element: HTMLDivElement;

  row: number;
  col: number;
  color: TileColor;

  constructor(
    id: number,
    row: number,
    col: number,
    color: TileColor
  ) {
    this.id = id;
    this.row = row;
    this.col = col;
    this.color = color;

    this.element = document.createElement('div');
    this.element.className = `tile tile--${color}`;

    this.setPosition(row, col);
  }

  setPosition(row: number, col: number): void {
    this.row = row;
    this.col = col;

    this.element.style.transform = `translate3d(
      ${col * TILE_SIZE}px,
      ${row * TILE_SIZE}px,
      0
    )`;
  }

  animateTo(
    row: number,
    col: number,
    duration = MOVE_DURATION
  ): Promise<void> {
    const startX = this.col * TILE_SIZE;
    const startY = this.row * TILE_SIZE;

    const endX = col * TILE_SIZE;
    const endY = row * TILE_SIZE;

    const start = performance.now();

    return new Promise(resolve => {

      const tick = (time: number) => {

        const t = Math.min(
          (time - start) / duration,
          1
        );

        const eased = 1 - Math.pow(1 - t, 3);

        const x = startX + (endX - startX) * eased;
        const y = startY + (endY - startY) * eased;

        this.element.style.transform =
          `translate3d(${x}px, ${y}px,0)`;

        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          this.row = row;
          this.col = col;
          resolve();
        }

      };

      requestAnimationFrame(tick);

    });

  }

  playDestroy(): Promise<void> {

    return new Promise(resolve => {

      this.element.animate([
        {
          transform: this.element.style.transform + ' scale(1)',
          opacity: 1
        },
        {
          transform: this.element.style.transform + ' scale(0)',
          opacity: 0
        }
      ],{
        duration:160,
        easing:'ease-out'
      }).onfinish = () => resolve();

    });

  }

  setColor(color: TileColor): void {
    this.color = color;
    this.element.className = `tile tile--${color}`;
  }

}