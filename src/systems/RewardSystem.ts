export interface RewardResult {
  score: number;
  combo: number;
  finished: boolean;
  title: string;
}

export class RewardSystem {
  private score = 0;
  private combo = 0;
  private moveUsed = false;

  private static readonly TARGET_SCORE = 300;

  addMatch(size: number): RewardResult {
    this.combo++;

    const points = size * 10 * this.combo;
    this.score += points;

    return {
      score: this.score,
      combo: this.combo,
      finished: false,
      title: this.getComboTitle(this.combo),
    };
  }

  endTurn(): RewardResult {
    this.moveUsed = true;

    return {
      score: this.score,
      combo: this.combo,
      finished: true,
      title: this.score >= RewardSystem.TARGET_SCORE
        ? 'Amazing!'
        : 'Nice!',
    };
  }

  resetCombo(): void {
    this.combo = 0;
  }

  reset(): void {
    this.score = 0;
    this.combo = 0;
    this.moveUsed = false;
  }

  canMove(): boolean {
    return !this.moveUsed;
  }

  getScore(): number {
    return this.score;
  }

  getCombo(): number {
    return this.combo;
  }

  private getComboTitle(combo: number): string {
    switch (combo) {
      case 1:
        return 'Nice!';
      case 2:
        return 'Great!';
      case 3:
        return 'Excellent!';
      case 4:
        return 'Awesome!';
      default:
        return 'Amazing!';
    }
  }
}