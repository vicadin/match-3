export interface ComboResult {
  score: number;
  comboCount: number;
  title: string;
}

export class ComboSystem {
  private score = 0;
  private comboCount = 0;

  addMatch(gemCount: number): ComboResult {
    this.comboCount++;

    const basePoints = gemCount * 100;
    const multiplier = Math.pow(this.comboCount, 1.8);
    const points = Math.round(basePoints * multiplier);

    this.score += points;

    return {
      score: this.score,
      comboCount: this.comboCount,
      title: this.getComboTitle(this.comboCount),
    };
  }

  resetCombo(): void {
    this.comboCount = 0;
  }

  reset(): void {
    this.score = 0;
    this.comboCount = 0;
  }

  getScore(): number {
    return this.score;
  }

  getCombo(): number {
    return this.comboCount;
  }

  private getComboTitle(combo: number): string {
    switch (combo) {
      case 1:
        return 'NICE!';
      case 2:
        return 'SWEET!';
      case 3:
        return 'TASTY!';
      case 4:
        return 'SUPER COMBO!';
      case 5:
        return 'AMAZING!';
      default:
        return 'UNSTOPPABLE!';
    }
  }
}
