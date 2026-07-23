import { Board } from '@/core/Board';
import { Gem } from '@/model/Gem';
import { GEM_SIZE, GEMS } from '@/config/boardConfig';
import { GemRenderer } from './GemRenderer';
import { createElement } from '@/utils/dom';
import { ParticleSystem } from '@/systems/ParticleSystem';
import { HintHand } from '@/components/Hint/HintHand';

export class BoardRenderer {
  readonly element: HTMLElement;
  readonly particleSystem: ParticleSystem;
  readonly hintHand: HintHand;

  private readonly gemRenderers = new Map<number, GemRenderer>();

  constructor(private readonly rows: number, private readonly cols: number) {
    this.element = createElement('div', 'board');
    this.element.style.width = `${cols * GEM_SIZE}px`;
    this.element.style.height = `${rows * GEM_SIZE}px`;

    this.renderGridBackground();

    const particleContainer = createElement('div', 'particle-container');
    this.element.appendChild(particleContainer);
    this.particleSystem = new ParticleSystem(particleContainer);

    this.hintHand = new HintHand();
    this.element.appendChild(this.hintHand.element);
  }

  private renderGridBackground(): void {
    const gridBg = createElement('div', 'board__grid-bg');
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const tile = createElement(
          'div',
          `board__tile ${(r + c) % 2 === 0 ? 'tile--light' : 'tile--dark'}`
        );
        tile.style.left = `${c * GEM_SIZE}px`;
        tile.style.top = `${r * GEM_SIZE}px`;
        gridBg.appendChild(tile);
      }
    }
    this.element.appendChild(gridBg);
  }

  getGemRenderer(gemId: number): GemRenderer | undefined {
    return this.gemRenderers.get(gemId);
  }

  renderBoard(board: Board): void {
    this.gemRenderers.forEach(v => v.destroy());
    this.gemRenderers.clear();

    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        const gem = board.get(r, c);
        if (gem) {
          const gemView = new GemRenderer(gem);
          this.gemRenderers.set(gem.id, gemView);
          this.element.appendChild(gemView.element);
        }
      }
    }
  }

  syncGridPositions(board: Board): void {
    for (let r = 0; r < board.rows; r++) {
      for (let c = 0; c < board.cols; c++) {
        const gem = board.grid[r][c];
        if (!gem) continue;

        let gemView = this.gemRenderers.get(gem.id);
        if (!gemView) {
          gemView = new GemRenderer(gem);
          this.gemRenderers.set(gem.id, gemView);
          this.element.appendChild(gemView.element);
        }

        gemView.setGridPosition(gem.row, gem.col);
      }
    }
  }

  removeGemRenderer(gem: Gem): GemRenderer | undefined {
    const view = this.gemRenderers.get(gem.id);
    if (!view) return undefined;

    const x = gem.col * GEM_SIZE + GEM_SIZE / 2;
    const y = gem.row * GEM_SIZE + GEM_SIZE / 2;
    const color = GEMS.find(g => g.id === gem.type)?.color || '#ffffff';

    this.particleSystem.spawnBurst(x, y, color, 14);
    this.gemRenderers.delete(gem.id);

    return view;
  }

  setSelectedGem(gem: Gem | null): void {
    this.gemRenderers.forEach((v, id) => {
      v.setSelected(gem !== null && id === gem.id);
    });
  }

  showHint(fromRow: number, fromCol: number, toRow: number, toCol: number): void {
    this.hintHand.showAt(fromRow, fromCol, toRow, toCol);
  }

  hideHint(): void {
    this.hintHand.hide();
  }
}

export { BoardRenderer as BoardView };
