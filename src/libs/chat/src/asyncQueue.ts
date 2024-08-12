import { FIRST_SEGMENT_INDEX } from "./constants";
import { incrementHexString, sleep } from "./utils";

export class AsyncQueue {
  private indexed;
  private waitable;
  private clearWaitTime;
  private index;
  private isProcessing = false;
  private inProgressCount = 0;
  private isWaiting = false;
  private queue: ((index?: string) => Promise<void>)[] = [];
  private maxParallel: number;

  constructor(settings: { indexed?: boolean; index?: string; waitable?: boolean; clearWaitTime?: number; max?: number } = {}) {
    this.indexed = settings.indexed || false;
    this.index = settings.index || FIRST_SEGMENT_INDEX;
    this.waitable = settings.waitable || false;
    this.clearWaitTime = settings.clearWaitTime || 100;
    this.maxParallel = settings.max || 5;
  }

  private async processQueue() {
    if (this.inProgressCount >= this.maxParallel) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      this.inProgressCount = this.inProgressCount+1;
      const promise = this.queue.shift()!;
      const action = this.indexed ? () => promise(this.index) : () => promise();

      if (this.waitable) {
        try {
          await action();
          this.index = incrementHexString(this.index);
        } catch (error) {
          console.error('Error processing promise:', error);
        } finally {
          this.inProgressCount = this.inProgressCount-1;
        }
      } else {
        action()
          .then(() => {
            this.index = incrementHexString(this.index);
          })
          .catch((error) => {
            console.error('Error processing promise:', error);
          })
          .finally(() => {
            this.inProgressCount = this.inProgressCount-1;
          });
      }
    }

    this.isProcessing = false;
  }

  enqueue(promiseFunction: (index?: string) => Promise<any>) {
    this.queue.push(promiseFunction);
    this.processQueue();
  }

  increaseMax(limit: number) {
    if (this.maxParallel+1 <= limit) {
      this.maxParallel++;
    }
    console.log("Max parallel request set to ", this.maxParallel);
  }

  decreaseMax() {
    if (this.maxParallel > 1) {
      this.maxParallel--;
      console.log("Max parallel request set to ", this.maxParallel);
    }
  }

  async clearQueue() {
    this.queue = [];
    while (this.isProcessing || this.inProgressCount > 0) {
      await sleep(this.clearWaitTime);
    }
  }

  async waitForProcessing() {
    if (this.isWaiting) return true;

    this.isWaiting = true;

    while (this.isProcessing || this.inProgressCount > 0) {
      await sleep(this.clearWaitTime);
    }

    this.isWaiting = false;
  }
}
