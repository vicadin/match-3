import { GemRenderer } from '@/renderer/GemRenderer';
import { GEM_SIZE } from '@/config/boardConfig';
import { easeInOutQuad, easeOutBounce } from '@/utils/easing';
import { ANIMATION_CONFIG } from '@/config/animationConfig';

export class AnimationSystem {

  async animateSwap(
    viewA: GemRenderer,
    viewB: GemRenderer,
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    duration = ANIMATION_CONFIG.swapDuration
  ): Promise<void> {
    const startX1 = c1 * GEM_SIZE;
    const startY1 = r1 * GEM_SIZE;
    const endX1 = c2 * GEM_SIZE;
    const endY1 = r2 * GEM_SIZE;

    const startX2 = c2 * GEM_SIZE;
    const startY2 = r2 * GEM_SIZE;
    const endX2 = c1 * GEM_SIZE;
    const endY2 = r1 * GEM_SIZE;

    return new Promise(resolve => {
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeInOutQuad(progress);

        const currentX1 = startX1 + (endX1 - startX1) * ease;
        const currentY1 = startY1 + (endY1 - startY1) * ease;

        const currentX2 = startX2 + (endX2 - startX2) * ease;
        const currentY2 = startY2 + (endY2 - startY2) * ease;

        viewA.move(currentX1, currentY1);
        viewB.move(currentX2, currentY2);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          viewA.setGridPosition(r2, c2);
          viewB.setGridPosition(r1, c1);
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }

  async animateInvalidSwap(
    viewA: GemRenderer,
    viewB: GemRenderer,
    r1: number,
    c1: number,
    r2: number,
    c2: number,
    duration = ANIMATION_CONFIG.swapDuration
  ): Promise<void> {
    await this.animateSwap(viewA, viewB, r1, c1, r2, c2, duration);
    await this.animateSwap(viewA, viewB, r2, c2, r1, c1, duration);
  }

  async animateFall(
    view: GemRenderer,
    fromRow: number,
    toRow: number,
    col: number,
    duration = ANIMATION_CONFIG.fallDuration
  ): Promise<void> {
    const startX = col * GEM_SIZE;
    const startY = fromRow * GEM_SIZE;
    const endY = toRow * GEM_SIZE;

    return new Promise(resolve => {
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutBounce(progress);

        const currentY = startY + (endY - startY) * ease;
        view.move(startX, currentY);

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          view.setGridPosition(toRow, col);
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }

  async animateDestroy(view: GemRenderer, duration = ANIMATION_CONFIG.removeDuration): Promise<void> {
    return new Promise(resolve => {
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const scale = Math.max(0, 1 + progress * 0.3 - progress * 1.3);
        const opacity = 1 - progress;

        view.scale(scale);
        view.element.style.opacity = `${opacity}`;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          view.destroy();
          resolve();
        }
      };

      requestAnimationFrame(step);
    });
  }
}
