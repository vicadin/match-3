import { Gem } from '@/model/Gem';
import { BoardView } from '@/components/Board/BoardView';
import { GravityResult } from './GravitySystem';
import { Match } from './MatchFinder';

const SWAP_DURATION = 220;
const FALL_DURATION = 250;
const REMOVE_DURATION = 180;

export class AnimationSystem {
  constructor(private readonly view: BoardView) {}

  async playSwap(first: Gem, second: Gem): Promise<void> {
    await this.view.animateSwap(first, second);
    await this.delay(SWAP_DURATION);
  }

  async playInvalidSwap(first: Gem, second: Gem): Promise<void> {
    await this.view.animateSwap(first, second);
    await this.delay(SWAP_DURATION);

    await this.view.animateSwap(second, first);
    await this.delay(SWAP_DURATION);
  }

  async playRemove(matches: Match[]): Promise<void> {
    for (const match of matches) {
      for (const gem of match.gems) {
        this.view.removeGem(gem);
      }
    }

    await this.delay(REMOVE_DURATION);
  }

  async playGravity(result: GravityResult): Promise<void> {
    if (
      result.falls.length === 0 &&
      result.spawns.length === 0
    ) {
      return;
    }

    await this.view.animateFalls();
    await this.delay(FALL_DURATION);
  }

  async playCascade(
    matches: Match[],
    gravity: GravityResult
  ): Promise<void> {
    await this.playRemove(matches);
    await this.playGravity(gravity);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}