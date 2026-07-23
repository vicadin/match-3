import { GameStateEnum } from '@/types/GameTypes';

export class StateMachine {
  private currentState: GameStateEnum = GameStateEnum.BOOT;
  private listeners: ((state: GameStateEnum) => void)[] = [];

  get state(): GameStateEnum {
    return this.currentState;
  }

  setState(newState: GameStateEnum): void {
    if (this.currentState === newState) return;
    this.currentState = newState;
    this.listeners.forEach(fn => fn(newState));
  }

  onChange(listener: (state: GameStateEnum) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  canAcceptInput(): boolean {
    return (
      this.currentState === GameStateEnum.WAIT_INPUT ||
      this.currentState === GameStateEnum.IDLE ||
      this.currentState === GameStateEnum.READY ||
      this.currentState === GameStateEnum.HINT
    );
  }
}
