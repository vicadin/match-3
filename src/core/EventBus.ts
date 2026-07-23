type Callback = (...args: any[]) => void;

export enum GameEvents {
  STATE_CHANGED = 'STATE_CHANGED',
  SWAP_REQUESTED = 'SWAP_REQUESTED',
  MATCH_FOUND = 'MATCH_FOUND',
  MATCH_REMOVED = 'MATCH_REMOVED',
  COMBO = 'COMBO',
  BOARD_STABLE = 'BOARD_STABLE',
  MOVE_FINISHED = 'MOVE_FINISHED',
  WIN = 'WIN',
  HINT_TRIGGERED = 'HINT_TRIGGERED',
  SCORE_UPDATED = 'SCORE_UPDATED',
}

export class EventBus {
  private events: Map<string, Callback[]> = new Map();

  on(event: string, callback: Callback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);

    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: Callback): void {
    const list = this.events.get(event);
    if (list) {
      this.events.set(
        event,
        list.filter(fn => fn !== callback)
      );
    }
  }

  emit(event: string, ...args: any[]): void {
    const list = this.events.get(event);
    if (list) {
      list.forEach(fn => fn(...args));
    }
  }

  clear(): void {
    this.events.clear();
  }
}

export const globalEventBus = new EventBus();
