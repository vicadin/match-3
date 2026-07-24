import './style.css';
import { GameController } from './controllers/GameController';

document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');
  if (appContainer) {
    const game = new GameController(appContainer);
    game.start();
  }
});
