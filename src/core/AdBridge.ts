import { GAME_CONFIG } from '@/config/gameConfig';

export class AdBridge {
  static openStore(): void {
    const url = GAME_CONFIG.storeUrl;

    // appLovin / mraid
    const globalMraid = (window as unknown as { mraid?: { open: (url: string) => void } }).mraid;
    if (globalMraid && typeof globalMraid.open === 'function') {
      globalMraid.open(url);
      return;
    }

    // mintegral
    const globalMintegral = (window as unknown as { install?: () => void }).install;
    if (typeof globalMintegral === 'function') {
      globalMintegral();
      return;
    }

    // fb
    const globalFb = (window as unknown as { FbPlayableAd?: { onCTAClick: () => void } }).FbPlayableAd;
    if (globalFb && typeof globalFb.onCTAClick === 'function') {
      globalFb.onCTAClick();
      return;
    }

    // fallback
    window.open(url, '_blank');
  }
}
