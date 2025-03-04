import fs from 'fs';
import path from 'path';

// HOW TO RUN: navigate to folder containing this file and run `node index.js` inside.
// > cd 4-async-control-flow/4.2-list-recursively && node index.js

const filesFound = [];
let dirEnteredCount = 0;

const listNestedFiles = (dir, cb) => {
  dirEnteredCount++;

  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) return cb(err);

    files.forEach(file => {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        listNestedFiles(filePath, cb);
      } else {
        filesFound.push(filePath);
      }
    });

    if (--dirEnteredCount === 0) cb(filesFound);
  });
};

listNestedFiles('../', console.log);
