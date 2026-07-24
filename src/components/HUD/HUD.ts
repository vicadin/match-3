import { createElement } from '@/utils/dom';
import { soundSystem } from '@/systems/SoundSystem';

export class HUD {
  readonly element: HTMLElement;
  private scoreValEl: HTMLElement;
  private goalEl: HTMLElement;
  private soundBtnEl: HTMLButtonElement;

  constructor() {
    this.element = createElement('div', 'hud');
    this.element.innerHTML = `
      <div class="hud__header">
        <h1 class="hud__title">Candy Match-3</h1>
        <div class="hud__goal">Goal: 3 Combinations (0/3)</div>
      </div>
      <div class="hud__bar">
        <div class="hud__score-box">
          <span class="hud__score-label">Score</span>
          <span class="hud__score-val">0</span>
        </div>
        <button class="hud__sound-btn" title="Toggle Audio">🔊</button>
      </div>
    `;

    this.scoreValEl = this.element.querySelector('.hud__score-val')!;
    this.goalEl = this.element.querySelector('.hud__goal')!;
    this.soundBtnEl = this.element.querySelector('.hud__sound-btn')!;

    this.soundBtnEl.onclick = () => {
      soundSystem.enabled = !soundSystem.enabled;
      this.soundBtnEl.textContent = soundSystem.enabled ? '🔊' : '🔇';
    };
  }

  setGoalProgress(current: number, target: number): void {
    const val = Math.min(current, target);
    this.goalEl.textContent = `Goal: ${target} Combinations (${val}/${target})`;
  }

  setScore(score: number): void {
    this.scoreValEl.textContent = String(score);
  }
}
