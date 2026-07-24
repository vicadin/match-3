import { createElement } from '@/utils/dom';
import { AdBridge } from '@/core/AdBridge';
import { soundSystem } from '@/systems/SoundSystem';

export class WinPopup {
  readonly element: HTMLElement;
  private scoreEl: HTMLElement;
  private onPlayAgainCb?: () => void;

  constructor() {
    this.element = createElement('div', 'win-popup-overlay');
    this.element.style.display = 'none';

    const card = createElement('div', 'win-popup');
    card.innerHTML = `
      <div class="win-popup__stars">⭐⭐⭐</div>
      <h2 class="win-popup__title">AMAZING!</h2>
      <p class="win-popup__subtitle">Incredible Combo Solved!</p>
      <div class="win-popup__score-box">
        <span class="win-popup__score-label">Score:</span>
        <span class="win-popup__score-val">0</span>
      </div>
      <button class="win-popup__cta-btn">
        <span>PLAY NOW</span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
      <button class="win-popup__replay-btn">Try Again 🔄</button>
    `;

    this.scoreEl = card.querySelector('.win-popup__score-val')!;

    const ctaBtn = card.querySelector<HTMLButtonElement>('.win-popup__cta-btn')!;
    ctaBtn.onclick = () => {
      soundSystem.playClick();
      AdBridge.openStore();
    };

    const replayBtn = card.querySelector<HTMLButtonElement>('.win-popup__replay-btn')!;
    replayBtn.onclick = () => {
      soundSystem.playClick();
      this.hide();
      this.onPlayAgainCb?.();
    };

    this.element.appendChild(card);
  }

  show(score: number, onPlayAgain?: () => void): void {
    this.onPlayAgainCb = onPlayAgain;
    this.scoreEl.textContent = String(score);
    this.element.style.display = 'flex';
    soundSystem.playWin();
  }

  hide(): void {
    this.element.style.display = 'none';
  }

  destroy(): void {
    this.element.remove();
  }
}
