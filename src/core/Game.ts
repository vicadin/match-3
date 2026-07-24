import { Board } from '@/core/Board';
import { BoardView } from '@/components/Board/BoardView';
import { BoardInput } from '@/components/Board/BoardInput';

import { SwapSystem } from '@/systems/SwapSystem';
import { MatchFinder } from '@/systems/MatchFinder';
import { GravitySystem } from '@/systems/GravitySystem';
import { AnimationSystem } from '@/systems/AnimationSystem';
import { RewardSystem } from '@/systems/RewardSystem';

import { Popup } from '@/components/Popup/Popup';
import { Button } from '@/components/Button/Button';
import { Counter } from '@/components/Counter/Counter';

import { GAME_CONFIG } from '@/config/gameConfig';
import { createElement } from '@/utils/dom';

import type { Gem } from '@/model/Gem';

export class Game {
  private readonly board = new Board();

  private readonly boardView = new BoardView(this.board);

  private readonly matchFinder = new MatchFinder();

  private readonly gravitySystem =
    new GravitySystem();

  private readonly swapSystem =
    new SwapSystem(
      this.board,
      this.matchFinder,
      this.gravitySystem
    );

  private readonly animationSystem =
    new AnimationSystem(this.boardView);

  private readonly rewardSystem =
    new RewardSystem();

  private readonly popup =
    new Popup();

  private readonly counter =
    new Counter('Score');

  private boardInput!: BoardInput;

  private root!: HTMLElement;

  private boardContainer!: HTMLElement;

  private ui!: HTMLElement;

  private message!: HTMLElement;

  private playButton!: Button;

  private busy = false;

  constructor(
    private readonly container: HTMLElement
  ) {}

  start(): void {
    this.buildDOM();

    this.boardInput =
      new BoardInput(
        this.board,
        this.boardView,
        ({ from, to }) =>
          void this.handleSwap(from, to)
      );

    this.counter.setValue(0);
  }

  destroy(): void {
    this.boardInput.destroy();
    this.popup.destroy();
    this.playButton.destroy();
  }

  private buildDOM(): void {
    this.root =
      createElement('div', 'game');

    this.boardContainer =
      createElement(
        'div',
        'game__board'
      );

    this.boardContainer.appendChild(
      this.boardView.element
    );

    this.ui =
      createElement(
        'div',
        'game__ui'
      );

    this.message =
      createElement(
        'div',
        'game__message'
      );

    this.message.textContent = '';

    this.playButton =
      new Button({
        label: 'Play Now',
        variant: 'primary',
        className: 'game__cta',
      });

    this.playButton.hide();

    this.playButton.onClick(() => {
      window.open(
        GAME_CONFIG.storeUrl,
        '_blank'
      );
    });

    this.ui.append(
      this.counter.element,
      this.message,
      this.playButton.element
    );

    this.root.append(
      this.boardContainer,
      this.ui,
      this.popup.element
    );

    this.container.appendChild(
      this.root
    );
  }

    private async handleSwap(
    first: Gem,
    second: Gem
  ): Promise<void> {
    if (this.busy) {
      return;
    }

    if (!this.rewardSystem.canMove()) {
      return;
    }

    this.busy = true;

    await this.animationSystem.playSwap(
      first,
      second
    );

    const result =
      this.swapSystem.trySwap(
        first,
        second
      );

    if (!result.success) {
      await this.animationSystem.playInvalidSwap(
        first,
        second
      );

      this.boardView.update();

      this.busy = false;
      return;
    }

    await this.resolveBoard();

    const reward =
      this.rewardSystem.endTurn();

    this.counter.setValue(
      reward.score
    );

    this.showMessage(
      reward.title
    );

    await this.delay(700);

    this.playButton.show();

    this.popup.show();

    this.busy = false;
  }

  private async resolveBoard(): Promise<void> {
    while (true) {
      const matches =
        this.matchFinder.find(
          this.board
        );

      if (matches.length === 0) {
        this.rewardSystem.resetCombo();
        break;
      }

      let removed = 0;

      for (const match of matches) {
        removed += match.gems.length;
      }

      const reward =
        this.rewardSystem.addMatch(
          removed
        );

      this.counter.setValue(
        reward.score
      );

      this.showMessage(
        reward.title
      );

      await this.animationSystem.playRemove(
        matches
      );

      for (const match of matches) {
        for (const gem of match.gems) {
          this.board.grid[
            gem.row
          ][
            gem.col
          ] = null as never;
        }
      }

      const gravity =
        this.gravitySystem.apply(
          this.board
        );

      this.boardView.update();

      await this.animationSystem.playGravity(
        gravity
      );
    }

    this.boardView.update();
  }

  private showMessage(
    text: string
  ): void {
    this.message.textContent =
      text;

    this.message.classList.remove(
      'is-visible'
    );

    requestAnimationFrame(() => {
      this.message.classList.add(
        'is-visible'
      );
    });
  }

    private hideMessage(): void {
    this.message.classList.remove('is-visible');
  }

  private showCTA(): void {
    this.showMessage('Amazing!');

    this.playButton.show();

    this.popup.show();
  }

  private resetGame(): void {
    this.hideMessage();

    this.rewardSystem.reset();

    this.counter.setValue(0);

    this.playButton.hide();

    this.popup.hide();

    this.boardView.update();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      window.setTimeout(resolve, ms);
    });
  }
}