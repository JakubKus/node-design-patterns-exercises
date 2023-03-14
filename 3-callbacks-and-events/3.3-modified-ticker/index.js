import { EventEmitter } from 'events';

const ticker = (totalMs = 0, cb) => {
  const emitter = new EventEmitter();
  let tickCount = 0, msPassed = 0;

  if (totalMs < 50) {
    process.nextTick(() => cb(0));
    return emitter;
  }

  const handleTick = () => {
    process.nextTick(() => emitter.emit('tick', msPassed));

    setTimeout(() => {
      msPassed += 50;
      tickCount += 1;
      if (msPassed <= totalMs) {
        handleTick();
      } else {
        cb(tickCount);
      }
    }, 50);
  }
  handleTick();

  return emitter;
}

ticker(process.argv[2], tickCount => console.log(`total number of ticks: ${tickCount}`))
  .on('tick', msPassed => console.log(`${msPassed}ms`));
