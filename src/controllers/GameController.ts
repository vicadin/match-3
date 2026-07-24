import { Board } from '@/core/Board';
import { BoardRenderer } from '@/renderer/BoardRenderer';
import { BoardInput } from '@/components/Board/BoardInput';
import { StateMachine } from '@/core/StateMachine';
import { EventBus, globalEventBus, GameEvents } from '@/core/EventBus';
import { AssetLoader } from '@/core/AssetLoader';

import { MatchFinder } from '@/systems/MatchFinder';
import { MoveValidator } from '@/systems/MoveValidator';
import { GravitySystem } from '@/systems/GravitySystem';
import { RefillSystem } from '@/systems/RefillSystem';
import { ShuffleSystem } from '@/systems/ShuffleSystem';
import { HintSystem } from '@/systems/HintSystem';
import { ComboSystem } from '@/systems/ComboSystem';
import { AnimationSystem } from '@/systems/AnimationSystem';
import { soundSystem } from '@/systems/SoundSystem';

import { HUD } from '@/components/HUD/HUD';
import { WinPopup } from '@/components/Popup/WinPopup';
import { GameStateEnum } from '@/types/GameTypes';
import { createElement } from '@/utils/dom';
import type { Gem } from '@/model/Gem';
import { ANIMATION_CONFIG } from '@/config/animationConfig';

import { GAME_CONFIG } from '@/config/gameConfig';

export class GameController {
  private readonly board = new Board();
  private readonly stateMachine = new StateMachine();
  private readonly eventBus: EventBus = globalEventBus;

  private readonly matchFinder = new MatchFinder();
  private readonly moveValidator = new MoveValidator(this.matchFinder);
  private readonly gravitySystem = new GravitySystem();
  private readonly refillSystem = new RefillSystem();
  private readonly hintSystem = new HintSystem(this.moveValidator);
  private readonly shuffleSystem = new ShuffleSystem(this.matchFinder, this.moveValidator, this.hintSystem);
  private readonly comboSystem = new ComboSystem();

  private boardRenderer!: BoardRenderer;
  private animationSystem!: AnimationSystem;
  private boardInput!: BoardInput;
  private hud!: HUD;
  private winPopup!: WinPopup;

  private root!: HTMLElement;
  private messageEl!: HTMLElement;
  private hintTimer: number | null = null;

  private combinationsCount = 0;
  private readonly targetCombinations = GAME_CONFIG.targetCombinations || 3;

  constructor(private readonly container: HTMLElement) {}

  async start(): Promise<void> {
    this.stateMachine.setState(GameStateEnum.BOOT);
    await AssetLoader.loadAll();

    this.board.generateRandomBoard();

    this.hud = new HUD();
    this.hud.setGoalProgress(0, this.targetCombinations);

    this.boardRenderer = new BoardRenderer(this.board.rows, this.board.cols);
    this.boardRenderer.renderBoard(this.board);

    this.animationSystem = new AnimationSystem();
    this.winPopup = new WinPopup();

    this.boardInput = new BoardInput(
      this.board,
      this.boardRenderer,
      ({ from, to }) => void this.handleSwap(from, to)
    );

    this.buildDOM();
    this.stateMachine.setState(GameStateEnum.READY);
    this.stateMachine.setState(GameStateEnum.WAIT_INPUT);
    this.startHintTimer();
  }

  destroy(): void {
    this.stopHintTimer();
    this.boardInput.destroy();
    this.winPopup.destroy();
    this.eventBus.clear();
  }

  private buildDOM(): void {
    this.root = createElement('div', 'game');

    const boardContainer = createElement('div', 'game__board');
    boardContainer.appendChild(this.boardRenderer.element);

    this.messageEl = createElement('div', 'game__message');

    this.root.append(
      this.hud.element,
      boardContainer,
      this.messageEl,
      this.winPopup.element
    );

    this.container.appendChild(this.root);
  }

  private async handleSwap(fromGem: Gem, toGem: Gem): Promise<void> {
    if (!this.stateMachine.canAcceptInput()) return;

    this.stopHintTimer();
    this.boardRenderer.hideHint();
    this.stateMachine.setState(GameStateEnum.SWAPPING);
    this.boardInput.setEnabled(false);

    const viewFrom = this.boardRenderer.getGemRenderer(fromGem.id);
    const viewTo = this.boardRenderer.getGemRenderer(toGem.id);

    if (!viewFrom || !viewTo) {
      this.resetInputState();
      return;
    }

    const isValid = this.moveValidator.canSwap(this.board, fromGem, toGem);

    if (!isValid) {
      soundSystem.playSwap();
      await this.animationSystem.animateInvalidSwap(
        viewFrom,
        viewTo,
        fromGem.row,
        fromGem.col,
        toGem.row,
        toGem.col
      );
      this.resetInputState();
      return;
    }

    // Execute swap in logical board
    soundSystem.playSwap();
    await this.animationSystem.animateSwap(
      viewFrom,
      viewTo,
      fromGem.row,
      fromGem.col,
      toGem.row,
      toGem.col
    );

    this.board.swap(fromGem, toGem);
    this.boardRenderer.syncGridPositions(this.board);

    // Start cascade resolution
    await this.resolveBoard();

    const score = this.comboSystem.getScore();
    const combo = this.comboSystem.getCombo();
    this.hud.setScore(score);

    // Check if level target combinations reached
    if (this.combinationsCount >= this.targetCombinations) {
      this.boardRenderer.particleSystem.spawnConfetti();
      this.showMessage(combo > 1 ? `COMBO x${combo}! AMAZING!` : 'VICTORY!');

      await this.delay(500);

      this.stateMachine.setState(GameStateEnum.WIN);
      this.stateMachine.setState(GameStateEnum.CTA);
      this.stateMachine.setState(GameStateEnum.COMPLETED);

      this.eventBus.emit(GameEvents.WIN, score);

      this.winPopup.show(score, () => {
        this.resetGame();
      });
    } else {
      // Goal not reached yet, check for available moves
      if (!this.board.hasValidMove()) {
        this.showMessage('NO MOVES! SHUFFLING...');
        await this.delay(500);
        this.shuffleSystem.shuffle(this.board);
        this.boardRenderer.syncGridPositions(this.board);
      }
      this.resetInputState();
    }
  }

  private async resolveBoard(): Promise<void> {
    this.stateMachine.setState(GameStateEnum.MATCHING);

    while (true) {
      const matches = this.matchFinder.find(this.board);
      if (matches.length === 0) {
        break;
      }

      this.combinationsCount++;
      this.hud.setGoalProgress(this.combinationsCount, this.targetCombinations);

      this.eventBus.emit(GameEvents.MATCH_FOUND, matches);

      let totalRemovedGems = 0;
      for (const match of matches) {
        totalRemovedGems += match.gems.length;
      }

      const reward = this.comboSystem.addMatch(totalRemovedGems);
      this.hud.setScore(reward.score);
      this.showMessage(reward.title);

      soundSystem.playCombo(reward.comboCount);
      this.eventBus.emit(GameEvents.COMBO, reward.comboCount);

      // Animate destruction
      this.stateMachine.setState(GameStateEnum.REMOVING);
      const destroyPromises: Promise<void>[] = [];
      for (const match of matches) {
        for (const gem of match.gems) {
          const view = this.boardRenderer.removeGemRenderer(gem);
          if (view) {
            destroyPromises.push(this.animationSystem.animateDestroy(view));
          }
          this.board.grid[gem.row][gem.col] = null;
        }
      }
      this.eventBus.emit(GameEvents.MATCH_REMOVED);
      await Promise.all(destroyPromises);

      // Apply Gravity
      this.stateMachine.setState(GameStateEnum.FALLING);
      const falls = this.gravitySystem.apply(this.board);

      const fallPromises: Promise<void>[] = [];
      for (const fall of falls) {
        const view = this.boardRenderer.getGemRenderer(fall.gem.id);
        if (view) {
          fallPromises.push(
            this.animationSystem.animateFall(view, fall.fromRow, fall.toRow, fall.col)
          );
        }
      }
      await Promise.all(fallPromises);

      // Refill top empty cells
      this.stateMachine.setState(GameStateEnum.REFILLING);
      const spawns = this.refillSystem.refill(this.board);

      this.boardRenderer.syncGridPositions(this.board);

      const spawnPromises: Promise<void>[] = [];
      for (const spawn of spawns) {
        const view = this.boardRenderer.getGemRenderer(spawn.gem.id);
        if (view) {
          spawnPromises.push(
            this.animationSystem.animateFall(view, spawn.fromRow, spawn.toRow, spawn.col)
          );
        }
      }
      await Promise.all(spawnPromises);

      this.stateMachine.setState(GameStateEnum.CHECKING);
    }

    this.boardRenderer.syncGridPositions(this.board);
    this.eventBus.emit(GameEvents.BOARD_STABLE);
  }

  private showMessage(text: string): void {
    this.messageEl.textContent = text;
    this.messageEl.classList.remove('is-visible');
    requestAnimationFrame(() => {
      this.messageEl.classList.add('is-visible');
    });
  }

  private hideMessage(): void {
    this.messageEl.classList.remove('is-visible');
  }

  private startHintTimer(): void {
    this.stopHintTimer();
    this.hintTimer = window.setTimeout(() => {
      if (this.stateMachine.canAcceptInput()) {
        this.showHint();
      }
    }, ANIMATION_CONFIG.hintDelay);
  }

  private stopHintTimer(): void {
    if (this.hintTimer !== null) {
      window.clearTimeout(this.hintTimer);
      this.hintTimer = null;
    }
  }

  private showHint(): void {
    const hint = this.hintSystem.findHint(this.board);
    if (hint) {
      this.stateMachine.setState(GameStateEnum.HINT);
      this.boardRenderer.showHint(hint.from.row, hint.from.col, hint.to.row, hint.to.col);
      this.eventBus.emit(GameEvents.HINT_TRIGGERED, hint);
    }
  }

  private resetInputState(): void {
    this.stateMachine.setState(GameStateEnum.WAIT_INPUT);
    this.boardInput.setEnabled(true);
    this.startHintTimer();
  }

  private resetGame(): void {
    this.hideMessage();
    this.comboSystem.reset();
    this.combinationsCount = 0;
    this.hud.setGoalProgress(0, this.targetCombinations);
    this.hud.setScore(0);
    this.winPopup.hide();

    this.board.generateRandomBoard();
    this.boardRenderer.renderBoard(this.board);

    this.stateMachine.setState(GameStateEnum.READY);
    this.stateMachine.setState(GameStateEnum.WAIT_INPUT);
    this.boardInput.setEnabled(true);
    this.startHintTimer();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => window.setTimeout(resolve, ms));
  }
}
