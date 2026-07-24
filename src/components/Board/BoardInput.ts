import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { GEM_SIZE } from '@/config/boardConfig';
import { BoardRenderer } from '@/renderer/BoardRenderer';
import { soundSystem } from '@/systems/SoundSystem';

export interface SwapRequest {
  from: Gem;
  to: Gem;
}

export class BoardInput {
  private startGem: Gem | null = null;
  private startX = 0;
  private startY = 0;
  private enabled = true;
  private isSwapping = false;

  constructor(
    private readonly board: Board,
    private readonly renderer: BoardRenderer,
    private readonly onSwap: (swap: SwapRequest) => void
  ) {
    this.bindEvents();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) {
      this.cancelDrag();
    }
  }

  destroy(): void {
    this.renderer.element.removeEventListener('pointerdown', this.handlePointerDown);
    window.removeEventListener('pointermove', this.handlePointerMove);
    window.removeEventListener('pointerup', this.handlePointerUp);
    window.removeEventListener('pointercancel', this.handlePointerUp);
  }

  private bindEvents(): void {
    this.renderer.element.addEventListener('pointerdown', this.handlePointerDown);
    window.addEventListener('pointermove', this.handlePointerMove, { passive: true });
    window.addEventListener('pointerup', this.handlePointerUp);
    window.addEventListener('pointercancel', this.handlePointerUp);
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.enabled || this.isSwapping) return;

    const gem = this.getGemFromEvent(event);
    if (!gem) return;

    this.startGem = gem;
    this.startX = event.clientX;
    this.startY = event.clientY;

    this.renderer.setSelectedGem(gem);
    soundSystem.playClick();
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.enabled || !this.startGem || this.isSwapping) return;

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    const threshold = 14;
    if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) {
      return;
    }

    let targetRow = this.startGem.row;
    let targetCol = this.startGem.col;

    if (Math.abs(dx) > Math.abs(dy)) {
      targetCol += dx > 0 ? 1 : -1;
    } else {
      targetRow += dy > 0 ? 1 : -1;
    }

    if (!this.board.isInside(targetRow, targetCol)) {
      this.cancelDrag();
      return;
    }

    const neighbour = this.board.get(targetRow, targetCol);
    if (!neighbour) {
      this.cancelDrag();
      return;
    }

    const fromGem = this.startGem;
    this.isSwapping = true;
    this.cancelDrag();

    this.onSwap({ from: fromGem, to: neighbour });

    setTimeout(() => {
      this.isSwapping = false;
    }, 200);
  };

  private handlePointerUp = (): void => {
    this.cancelDrag();
  };

  private cancelDrag(): void {
    this.startGem = null;
    this.renderer.setSelectedGem(null);
  }

  private getGemFromEvent(event: PointerEvent): Gem | null {
    const rect = this.renderer.element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / GEM_SIZE);
    const row = Math.floor(y / GEM_SIZE);

    if (!this.board.isInside(row, col)) {
      return null;
    }

    return this.board.get(row, col);
  }
}
