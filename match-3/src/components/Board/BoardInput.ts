import { Board } from '@/model/Board';
import { Gem } from '@/model/Gem';
import { GEM_SIZE } from '@/config/boardConfig';
import { BoardView } from './BoardView';

export interface SwapRequest {
  from: Gem;
  to: Gem;
}

export class BoardInput {
  private startGem: Gem | null = null;
  private startX = 0;
  private startY = 0;

  constructor(
    private readonly board: Board,
    private readonly view: BoardView,
    private readonly onSwap: (swap: SwapRequest) => void
  ) {
    this.bindEvents();
  }

  destroy(): void {
    this.view.element.removeEventListener(
      'pointerdown',
      this.handlePointerDown
    );

    window.removeEventListener(
      'pointermove',
      this.handlePointerMove
    );

    window.removeEventListener(
      'pointerup',
      this.handlePointerUp
    );
  }

  private bindEvents(): void {
    this.view.element.addEventListener(
      'pointerdown',
      this.handlePointerDown
    );

    window.addEventListener(
      'pointermove',
      this.handlePointerMove,
      {
        passive: true,
      }
    );

    window.addEventListener(
      'pointerup',
      this.handlePointerUp
    );
  }

  private handlePointerDown = (event: PointerEvent): void => {
    const gem = this.getGemFromEvent(event);

    if (!gem) {
      return;
    }

    this.startGem = gem;
    this.startX = event.clientX;
    this.startY = event.clientY;
  };

  private handlePointerMove = (event: PointerEvent): void => {
    if (!this.startGem) {
      return;
    }

    const dx = event.clientX - this.startX;
    const dy = event.clientY - this.startY;

    if (
      Math.abs(dx) < 18 &&
      Math.abs(dy) < 18
    ) {
      return;
    }

    let row = this.startGem.row;
    let col = this.startGem.col;

    if (Math.abs(dx) > Math.abs(dy)) {
      col += dx > 0 ? 1 : -1;
    } else {
      row += dy > 0 ? 1 : -1;
    }

    if (
      row < 0 ||
      row >= this.board.rows ||
      col < 0 ||
      col >= this.board.cols
    ) {
      this.startGem = null;
      return;
    }

    const neighbour = this.board.get(row, col);

    this.onSwap({
      from: this.startGem,
      to: neighbour,
    });

    this.startGem = null;
  };

  private handlePointerUp = (): void => {
    this.startGem = null;
  };

  private getGemFromEvent(
    event: PointerEvent
  ): Gem | null {
    const rect =
      this.view.element.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x / GEM_SIZE);
    const row = Math.floor(y / GEM_SIZE);

    if (
      row < 0 ||
      row >= this.board.rows ||
      col < 0 ||
      col >= this.board.cols
    ) {
      return null;
    }

    return this.board.get(row, col);
  }
}