import { GEMS } from '@/config/boardConfig';

export class AssetLoader {
  private static loaded = false;

  static async loadAll(): Promise<void> {
    if (this.loaded) return;

    GEMS.forEach(gem => {
      if (!gem.iconSvg || !gem.gradient) {
        console.warn(`Asset missing for gem ${gem.id}`);
      }
    });

    this.loaded = true;
  }

  static getGemConfig(type: number) {
    return GEMS.find(g => g.id === type) || GEMS[0];
  }
}
