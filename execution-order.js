// microtasks
process.nextTick(() => console.log('#3 process nextTick'));
queueMicrotask(() => console.log('#1 microtask'));

// macrotasks
setTimeout(() => console.log('#5 timeout 0s'));
setImmediate(() => console.log('#4 immediate'));
new Promise((resolve, reject) => resolve()).then(() => console.log('#2 promise'));
