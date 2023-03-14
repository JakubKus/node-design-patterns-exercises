import fs from 'fs';

const concatFiles = (dest, cb, ...srcFiles) => {
  const srcFile = srcFiles.shift();
  if (srcFile) {
    fs.readFile(srcFile, (err, data) => {
      if (err) {
        cb(err);
      } else {
        fs.appendFile(dest, data, () => {
          concatFiles(dest, cb, ...srcFiles);
        });
      }
    });
  } else {
    cb();
  }
}

concatFiles(
  'destination.txt',
  err => err ? console.error(err.message) : console.log('done'),
  'file1.txt',
  'file2.txt'
);
