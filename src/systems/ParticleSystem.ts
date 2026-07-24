import { ObjectPool } from '@/utils/pool';
import { createElement } from '@/utils/dom';
import { PARTICLE_CONFIG } from '@/config/particleConfig';

interface Particle {
  el: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  shape: 'circle' | 'square' | 'star';
}

interface FloatingScore {
  el: HTMLElement;
}

export class ParticleSystem {
  private container: HTMLElement;
  private particlePool: ObjectPool<Particle>;
  private scorePool: ObjectPool<FloatingScore>;
  private activeParticles: Particle[] = [];
  private isRunning = false;

  constructor(container: HTMLElement) {
    this.container = container;

    this.particlePool = new ObjectPool<Particle>(
      () => {
        const el = createElement('div', 'particle');
        this.container.appendChild(el);
        return {
          el,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: 1,
          color: '#fff',
          size: 8,
          shape: 'circle',
        };
      },
      p => {
        p.el.style.display = 'none';
        p.el.style.opacity = '1';
        p.el.style.transform = 'translate3d(0, 0, 0) scale(1)';
      },
      PARTICLE_CONFIG.poolSize
    );

    this.scorePool = new ObjectPool<FloatingScore>(
      () => {
        const el = createElement('div', 'floating-score');
        this.container.appendChild(el);
        return { el };
      },
      s => {
        s.el.style.display = 'none';
        s.el.classList.remove('animate');
      },
      PARTICLE_CONFIG.scorePoolSize
    );
  }

  spawnBurst(x: number, y: number, color: string, count = PARTICLE_CONFIG.defaultBurstCount): void {
    for (let i = 0; i < count; i++) {
      const p = this.particlePool.get();
      p.x = x;
      p.y = y;

      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 7;
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed - 1.5;
      p.life = 0;
      p.maxLife = 22 + Math.random() * 16;
      p.color = color;
      p.size = 6 + Math.random() * 6;

      p.el.style.backgroundColor = color;
      p.el.style.width = `${p.size}px`;
      p.el.style.height = `${p.size}px`;
      p.el.style.left = `${x}px`;
      p.el.style.top = `${y}px`;
      p.el.style.display = 'block';

      this.activeParticles.push(p);
    }
    this.startLoop();
  }

  spawnFloatingText(x: number, y: number, text: string, color = '#fbbf24'): void {
    const item = this.scorePool.get();
    item.el.textContent = text;
    item.el.style.color = color;
    item.el.style.left = `${x}px`;
    item.el.style.top = `${y}px`;
    item.el.style.display = 'block';

    requestAnimationFrame(() => {
      item.el.classList.add('animate');
    });

    setTimeout(() => {
      this.scorePool.release(item);
    }, 850);
  }

  spawnConfetti(): void {
    const colors = ['#ec4899', '#8b5cf6', '#3b82f6', '#34c759', '#ffcc00', '#ff9500'];
    const width = this.container.clientWidth || 380;

    for (let i = 0; i < PARTICLE_CONFIG.confettiCount; i++) {
      const p = this.particlePool.get();
      p.x = Math.random() * width;
      p.y = -20;
      p.vx = (Math.random() - 0.5) * 4;
      p.vy = 3 + Math.random() * 5;
      p.life = 0;
      p.maxLife = 60 + Math.random() * 30;
      p.color = colors[Math.floor(Math.random() * colors.length)];
      p.size = 8 + Math.random() * 6;

      p.el.style.backgroundColor = p.color;
      p.el.style.width = `${p.size}px`;
      p.el.style.height = `${p.size * 0.6}px`;
      p.el.style.borderRadius = '2px';
      p.el.style.left = `${p.x}px`;
      p.el.style.top = `${p.y}px`;
      p.el.style.display = 'block';

      this.activeParticles.push(p);
    }
    this.startLoop();
  }

  private startLoop(): void {
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(this.animate);
    }
  }

  private animate = (): void => {
    if (this.activeParticles.length === 0) {
      this.isRunning = false;
      return;
    }

    const remaining: Particle[] = [];

    for (const p of this.activeParticles) {
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += PARTICLE_CONFIG.gravity;

      const progress = p.life / p.maxLife;
      const scale = 1 - progress * 0.4;
      const opacity = 1 - progress;

      const dx = p.x - p.el.offsetLeft;
      const dy = p.y - p.el.offsetTop;

      p.el.style.transform = `translate3d(${dx}px, ${dy}px, 0px) scale(${scale}) rotate(${p.life * 12}deg)`;
      p.el.style.opacity = `${opacity}`;

      if (p.life < p.maxLife) {
        remaining.push(p);
      } else {
        this.particlePool.release(p);
      }
    }

    this.activeParticles = remaining;

    if (this.activeParticles.length > 0) {
      requestAnimationFrame(this.animate);
    } else {
      this.isRunning = false;
    }
  };
}
