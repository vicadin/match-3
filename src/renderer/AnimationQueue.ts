type Task = () => Promise<void>;

export class AnimationQueue {
  private queue: Task[] = [];
  private isProcessing = false;

  add(task: Task): Promise<void> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          await task();
          resolve();
        } catch (err) {
          reject(err);
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }

    this.isProcessing = false;
  }

  clear(): void {
    this.queue = [];
    this.isProcessing = false;
  }
}
