export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn?: (item: T) => void;

  constructor(createFn: () => T, resetFn?: (item: T) => void, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;

    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    return this.createFn();
  }

  release(item: T): void {
    if (this.resetFn) {
      this.resetFn(item);
    }
    this.pool.push(item);
  }

  clear(): void {
    this.pool = [];
  }
}
