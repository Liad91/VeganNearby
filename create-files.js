const fs = require('fs');
const path = require('path');

function createDirs() {
  const dirs = ['public', 'images', 'users', 'temp'];

  dirs.reduce((parentDir, childDir) => {
    const currentDir = path.resolve(parentDir, childDir);

    if (!fs.existsSync(currentDir)) {
      fs.mkdirSync(currentDir);
    }
    /** Create temp directory inside public/images */
    if (childDir === 'users') {
      return path.resolve(parentDir);
    }
    return currentDir;
  }, '');
}

module.exports = createDirs;