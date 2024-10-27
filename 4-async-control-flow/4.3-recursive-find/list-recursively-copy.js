import fs from 'fs';
import path from 'path';

const filesFound = [];
let dirEnteredCount = 0;

// slightly modified version of the script from 4.2-list-recursively.
// it doesn't run itself when imported, and it exports the function.
export const listNestedFiles = (dir, cb) => {
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

// listNestedFiles('../', console.log);
