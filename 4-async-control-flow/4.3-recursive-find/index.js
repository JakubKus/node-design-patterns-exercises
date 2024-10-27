import fs from 'fs';
import { listNestedFiles } from './list-recursively-copy.js';

const ParallelFinder = params => {
  const { files, keyword, cb } = params;

  const CONCURRENCY = 4;

  const searchedFilesFound = [];
  let running = 0;
  let tasksCompleted = 0;
  let taskIdx = 0;

  const tasks = files.map(file => {
    return done => {
      fs.readFile(file, 'utf8', (err, data) => {
        if (err) return done(err);

        const fileContent = data.toString();
        if (fileContent.includes(keyword)) searchedFilesFound.push(file);
        done();
      });
    };
  });

  const finish = err => err ? cb(err) : cb(searchedFilesFound);

  const next = () => {
    while (running < CONCURRENCY && taskIdx < tasks.length) {
      const task = tasks[taskIdx++];
      task((err) => {
        if (err) return finish(err);
        if (++tasksCompleted === tasks.length) return finish();

        running--;
        next();
      });
      running++;
    }
  };

  return { search: next };
};

const recursiveFind = (dir, keyword, cb) => {
  listNestedFiles(dir, files => {
    ParallelFinder({ files, keyword, cb }).search();
  });
};

const keywordArg = process.argv[2];
recursiveFind('./', keywordArg, console.log);
