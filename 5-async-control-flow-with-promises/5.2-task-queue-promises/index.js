class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0;
    this.queue = [];
  }

  runTask (task) {
    // it's not possible to replace it with async/await because promise has to be resolved when
    // the task is done after being queued.
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve, reject));
      process.nextTick(this.next.bind(this));
    })
  }

  async next () {
    console.log({ running: this.running, queue: this.queue.length });
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();
      this.running++;

      await task();

      this.running--;
      void this.next();
    }
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

function myTask ({ numberA, numberB }, queue) {
  console.log(`numberA: ${numberA}, numberB: ${numberB}`);
  if (numberA >= 6 || numberB <= -6) {
    return Promise.resolve()
  }

  return queue
    .runTask(() => wait(100))
    .then(() => {
      return Promise.all([
        myTask({ numberA: numberA + 2, numberB }, queue),
        myTask({ numberA, numberB: numberB - 2 }, queue),
      ])
    });
}

const taskQueue = new TaskQueue(4);
void myTask({ numberA: 0, numberB: 0 }, taskQueue)
  .then(() => console.log('task done'));
