import { EventEmitter } from 'events';

const ticker = (totalMs = 0, cb) => {
  const emitter = new EventEmitter();
  let tickCount = 0, msPassed = 0;

  const emitTick = () => emitter.emit('tick', msPassed);

  const handleError = () => {
    const now = Date.now();
    if (now % 5 === 0) {
      const error = new Error(`timestamp ${now} is divisible by 5`);
      emitter.emit('error', error);
      cb(error);
    }
  }

  if (totalMs < 50) {
    process.nextTick(() => {
      cb(null, 1);
      emitTick();
      handleError();
    });
    return emitter;
  }

  const handleTick = () => {
    process.nextTick(() => {
      emitTick();
      handleError();
    });

    setTimeout(() => {
      msPassed += 50;
      tickCount += 1;
      if (msPassed <= totalMs) {
        handleTick();
      } else {
        cb(null, tickCount);
      }
    }, 50);
  }
  handleTick();

  return emitter;
}

ticker(process.argv[2], (error, tickCount) => {
  if (error) {
    console.log(`Error from callback: ${error.message}`);
  } else {
    console.log(`total number of ticks: ${tickCount}`)
  }
})
  .on('tick', msPassed => console.log(`${msPassed}ms`))
  .on('error', error => console.error(`Error emitted: ${error.message}`));
