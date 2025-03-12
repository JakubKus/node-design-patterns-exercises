class TaskQueuePC {
  constructor(concurrency) {
    this.taskQueue = []
    this.consumerQueue = []
    this.concurrency = concurrency;

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      void this.consumer()
    }
  }
  
  consumer() {
    return this.getNextTask()
      .then(task => task())
      .then(() => this.consumer())
      .catch(console.error)
  }

  getNextTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }

      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper)
      }
      console.log({ running: this.concurrency - this.consumerQueue.length, queue: this.taskQueue.length });
    })
  }
}

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const taskResults = [];
function myTask ({ numberA, numberB }, queue) {
  const numbers = `numberA: ${numberA}, numberB: ${numberB}`
  console.log(numbers);
  taskResults.push(numbers);

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

const taskQueue = new TaskQueuePC(4);
void myTask({ numberA: 0, numberB: 0 }, taskQueue)
  .then(() => console.log('task done', taskResults.length));
