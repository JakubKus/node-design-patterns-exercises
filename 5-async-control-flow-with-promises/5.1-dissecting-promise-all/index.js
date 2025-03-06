const runSuccessfulPromise = () => new Promise(resolve => {
  setTimeout(() => {
    console.log('running 1...');
    resolve('success1');
  }, 1000);
});

const run2ndSuccessfulPromise = () => new Promise(resolve => {
  setTimeout(() => {
    console.log('running 2...');
    resolve('success2');
  }, 1000);
});

const runFailingPromise = () => new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('running 3...');
    reject('fail');
  }, 1000);
});

const promiseAll = async promises => {
  const results = [];
  for (const promise of promises) results.push(await promise);
  return results;
};

const successfulResults = await promiseAll([runSuccessfulPromise(), run2ndSuccessfulPromise()]);
const failingResults = await promiseAll([runFailingPromise(), runSuccessfulPromise()]);

// const successfulResults = await Promise.all([runSuccessfulPromise(), run2ndSuccessfulPromise()]);
// const failingResults = await Promise.all([runSuccessfulPromise(), runFailingPromise()]);

console.log({ successfulResults });
console.log({ failingResults });
