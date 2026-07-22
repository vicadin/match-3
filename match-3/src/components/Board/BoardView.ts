import { Board } from '@/model/Board';
import { Gem } from '@/model/Gem';
import { GEM_SIZE, GEMS } from '@/config/boardConfig';
import { createElement } from '@/utils/dom';

export class BoardView {
  readonly element: HTMLElement;

  private readonly gemElements = new Map<number, HTMLElement>();

  constructor(private readonly board: Board) {
    this.element = createElement('div', 'board');

    this.element.style.width = `${board.cols * GEM_SIZE}px`;
    this.element.style.height = `${board.rows * GEM_SIZE}px`;

    this.render();
  }

  render(): void {
    this.element.innerHTML = '';
    this.gemElements.clear();

    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        const gem = this.board.get(row, col);
        const el = this.createGemElement(gem);

        this.gemElements.set(gem.id, el);
        this.element.appendChild(el);
      }
    }
  }

  update(): void {
    for (let row = 0; row < this.board.rows; row++) {
      for (let col = 0; col < this.board.cols; col++) {
        const gem = this.board.get(row, col);

        let el = this.gemElements.get(gem.id);

        if (!el) {
          el = this.createGemElement(gem);
          this.gemElements.set(gem.id, el);
          this.element.appendChild(el);
        }

        this.positionElement(el, gem.row, gem.col);
      }
    }
  }

  removeGem(gem: Gem): void {
    const el = this.gemElements.get(gem.id);

    if (!el) {
      return;
    }

    el.remove();
    this.gemElements.delete(gem.id);
  }

  async animateSwap(first: Gem, second: Gem): Promise<void> {
    const a = this.gemElements.get(first.id);
    const b = this.gemElements.get(second.id);

    if (!a || !b) {
      return;
    }

    this.positionElement(a, first.row, first.col);
    this.positionElement(b, second.row, second.col);

    await this.waitTransition();
  }

  async animateFalls(): Promise<void> {
    this.update();
    await this.waitTransition();
  }

  async animateSpawn(): Promise<void> {
    this.update();
    await this.waitTransition();
  }

  private createGemElement(gem: Gem): HTMLElement {
    const el = createElement('div', 'gem');

    const config = GEMS.find(g => g.id === gem.type);

    if (config?.image) {
      el.style.backgroundImage = `url(${config.image})`;
    } else {
      el.style.backgroundColor = config?.color ?? '#ccc';
    }

    this.positionElement(el, gem.row, gem.col);

    return el;
  }

  private positionElement(
    el: HTMLElement,
    row: number,
    col: number
  ): void {
    el.style.transform = `translate(${col * GEM_SIZE}px, ${row * GEM_SIZE}px)`;
  }

  private waitTransition(): Promise<void> {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        setTimeout(resolve, 250);
      });
    });
  }
}