export enum GameEvents {
  MOVE_STARTED = 'move-started',

  MOVE_FINISHED = 'move-finished',

  MATCH_FOUND = 'match-found',

  CASCADE_FINISHED = 'cascade-finished',

  WIN = 'win',

  CTA = 'cta',
}

type Handler<T> = (payload: T) => void;

export class EventBus {
  private listeners = new Map<string, Set<Handler<any>>>();

  on<T>(event: string, handler: Handler<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)!.add(handler);

    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  emit<T>(event: string, payload?: T) {
    this.listeners.get(event)?.forEach(cb => cb(payload));
  }

  clear() {
    this.listeners.clear();
  }
}