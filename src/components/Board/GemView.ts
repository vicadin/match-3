import { Gem } from '@/model/Gem';
import { GEMS } from '@/config/boardConfig';
import { GAME_CONFIG } from '@/config/gameConfig';

export class GemView {

  readonly element: HTMLDivElement;

  constructor(
    readonly gem: Gem
  ) {

    this.element = document.createElement('div');
    this.element.className = 'gem';

    const color = GEMS.find(g => g.id === gem.type)!;

    this.element.style.background = color.color;

    this.moveInstant();

  }

  moveInstant() {

    this.element.style.transform =
      `translate(${this.gem.col * GAME_CONFIG.board.tileSize}px,
                 ${this.gem.row * GAME_CONFIG.board.tileSize}px)`;

  }

  async animateMove(duration = 180) {

    return new Promise<void>(resolve => {

      this.element.style.transition =
        `transform ${duration}ms ease`;

      this.moveInstant();

      setTimeout(resolve, duration);

    });

  }

  async destroy() {

    return new Promise<void>(resolve => {

      this.element.animate([

        {
          transform: this.element.style.transform +
          ' scale(1)',
          opacity: 1
        },

        {
          transform: this.element.style.transform +
          ' scale(0)',
          opacity: 0
        }

      ],{

        duration:250,
        easing:'ease-out'

      }).finished.then(()=>{

        this.element.remove();

        resolve();

      });

    });

  }

}