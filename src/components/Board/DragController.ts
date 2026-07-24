import { Board } from '@/model/Board';
import { Gem } from '@/model/Gem';

export interface DragCallbacks {
  onSwap(first: Gem, second: Gem): void;
}

const DRAG_THRESHOLD = 18;

export class DragController {
  private pointerId: number | null = null;

  private startX = 0;
  private startY = 0;

  private startGem: Gem | null = null;

  private locked = false;

  constructor(
    private readonly board: Board,
    private readonly root: HTMLElement,
    private readonly callbacks: DragCallbacks
  ) {
    this.root.addEventListener('pointerdown', this.onPointerDown);
    this.root.addEventListener('pointermove', this.onPointerMove);
    this.root.addEventListener('pointerup', this.reset);
    this.root.addEventListener('pointercancel', this.reset);
  }

  destroy() {
    this.root.removeEventListener('pointerdown', this.onPointerDown);
    this.root.removeEventListener('pointermove', this.onPointerMove);
    this.root.removeEventListener('pointerup', this.reset);
    this.root.removeEventListener('pointercancel', this.reset);
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  private onPointerDown = (e: PointerEvent) => {
    if (this.locked) return;

    const gem = this.pickGem(e.target);

    if (!gem) return;

    this.pointerId = e.pointerId;

    this.startX = e.clientX;
    this.startY = e.clientY;

    this.startGem = gem;

    this.root.setPointerCapture(e.pointerId);
  };

  private onPointerMove = (e: PointerEvent) => {
    if (this.locked) return;

    if (this.pointerId !== e.pointerId) return;

    if (!this.startGem) return;

    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    if (
      Math.abs(dx) < DRAG_THRESHOLD &&
      Math.abs(dy) < DRAG_THRESHOLD
    ) {
      return;
    }

    let target: Gem | null = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      target =
        dx > 0
          ? this.right(this.startGem)
          : this.left(this.startGem);
    } else {
      target =
        dy > 0
          ? this.bottom(this.startGem)
          : this.top(this.startGem);
    }

    if (target) {
      this.callbacks.onSwap(this.startGem, target);
    }

    this.reset();
  };

  private reset = () => {
    this.pointerId = null;
    this.startGem = null;
  };

  private pickGem(target: EventTarget | null): Gem | null {
    if (!(target instanceof HTMLElement)) {
      return null;
    }

    const node = target.closest<HTMLElement>('.gem');

    if (!node) {
      return null;
    }

    const id = Number(node.dataset.id);

    for (const row of this.board.grid) {
      for (const gem of row) {
        if (gem && gem.id === id) {
          return gem;
        }
      }
    }

    return null;
  }

  private left(gem: Gem): Gem | null {
    if (gem.col === 0) return null;

    return this.board.get(gem.row, gem.col - 1);
  }

  private right(gem: Gem): Gem | null {
    if (gem.col === this.board.cols - 1) return null;

    return this.board.get(gem.row, gem.col + 1);
  }

  private top(gem: Gem): Gem | null {
    if (gem.row === 0) return null;

    return this.board.get(gem.row - 1, gem.col);
  }

  private bottom(gem: Gem): Gem | null {
    if (gem.row === this.board.rows - 1) return null;

    return this.board.get(gem.row + 1, gem.col);
  }
}