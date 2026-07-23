import { Gem } from '@/model/Gem';
import { GEM_SIZE, GEMS } from '@/config/boardConfig';
import { createElement } from '@/utils/dom';

export class GemRenderer {
  readonly element: HTMLElement;
  private currentX = 0;
  private currentY = 0;
  private currentScale = 1;

  constructor(public readonly gem: Gem) {
    this.element = createElement('div', 'gem');
    this.element.dataset.id = String(gem.id);
    this.element.style.willChange = 'transform, opacity';
    this.updateStyle();
    this.setGridPosition(gem.row, gem.col);
  }

  updateStyle(): void {
    const config = GEMS.find(g => g.id === this.gem.type);
    if (config) {
      this.element.style.background = config.gradient;
      this.element.innerHTML = `<div class="gem__icon">${config.iconSvg}</div><div class="gem__shine"></div>`;
    }
  }

  setGridPosition(row: number, col: number): void {
    this.move(col * GEM_SIZE, row * GEM_SIZE);
  }

  setPixelPosition(x: number, y: number): void {
    this.move(x, y);
  }

  move(x: number, y: number): void {
    this.currentX = x;
    this.currentY = y;
    this.applyTransform();
  }

  scale(s: number): void {
    this.currentScale = s;
    this.applyTransform();
  }

  shake(): void {
    this.element.classList.remove('gem--shake');
    void this.element.offsetWidth;
    this.element.classList.add('gem--shake');
  }

  highlight(active = true): void {
    if (active) {
      this.element.classList.add('gem--highlight');
    } else {
      this.element.classList.remove('gem--highlight');
    }
  }

  setSelected(selected: boolean): void {
    if (selected) {
      this.element.classList.add('is-selected');
    } else {
      this.element.classList.remove('is-selected');
    }
  }

  destroy(): void {
    this.element.remove();
  }

  private applyTransform(): void {
    this.element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0px) scale(${this.currentScale})`;
  }
}

export { GemRenderer as GemView };
