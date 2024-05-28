export class Deferred<T> {
  promise: Promise<T>;

  resolve?: (value: T | PromiseLike<T>) => void | undefined;

  reject?: (reason?: any) => void;

  settled: boolean = false;

  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = (reason?: any) => {
        this.settled = true;
        reject(reason);
      };
      this.resolve = (value: T | PromiseLike<T>) => {
        this.settled = true;
        resolve(value);
      };
    });
  }
}
