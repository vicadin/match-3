import { createElement } from '@/utils/dom';

export class Popup {
  readonly element: HTMLElement;
  private readonly modal: HTMLElement;

  constructor() {
    this.element = createElement('div', 'popup-overlay');
    this.modal = createElement('div', 'popup-modal');
    this.element.appendChild(this.modal);
    this.element.style.display = 'none';
  }

  show(content?: string | HTMLElement): void {
    if (content) {
      if (typeof content === 'string') {
        this.modal.textContent = content;
      } else {
        this.modal.innerHTML = '';
        this.modal.appendChild(content);
      }
    }
    this.element.style.display = 'flex';
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  destroy(): void {
    this.element.remove();
  }
}
