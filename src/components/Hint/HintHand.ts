import { createElement } from '@/utils/dom';
import { GEM_SIZE } from '@/config/boardConfig';

export class HintHand {
  readonly element: HTMLElement;

  constructor() {
    this.element = createElement('div', 'hint-hand');
    this.element.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
        <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
        <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
        <path d="M18 8a2 2 0 0 1 2 2v4a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"/>
      </svg>
      <div class="hint-hand__pulse"></div>
    `;
    this.hide();
  }

  showAt(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    const x1 = fromCol * GEM_SIZE + GEM_SIZE / 2;
    const y1 = fromRow * GEM_SIZE + GEM_SIZE / 2;
    const x2 = toCol * GEM_SIZE + GEM_SIZE / 2;
    const y2 = toRow * GEM_SIZE + GEM_SIZE / 2;

    this.element.style.left = `${x1}px`;
    this.element.style.top = `${y1}px`;

    const dx = x2 - x1;
    const dy = y2 - y1;

    this.element.style.setProperty('--dx', `${dx}px`);
    this.element.style.setProperty('--dy', `${dy}px`);

    this.element.style.display = 'flex';
    this.element.classList.add('is-animating');
  }

  hide(): void {
    this.element.style.display = 'none';
    this.element.classList.remove('is-animating');
  }
}
