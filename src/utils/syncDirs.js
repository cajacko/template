const watch = require('watch');
const { copy, remove } = require('fs-extra');

const files = {};

class File {
  constructor(file, src, dest) {
    this.src = file;
    this.dest = file.replace(src, dest);
    this.next = null;
    this.current = null;

    this.doNext = this.doNext.bind(this);
  }

  doNext() {
    this.current = null;

    switch (this.next) {
      case 'copy':
        this.copy();
        break;
      case 'delete':
        this.delete();
        break;
      default:
        break;
    }

    this.next = null;
  }

  copy() {
    if (this.current) {
      this.next = 'copy';
    } else {
      this.current = 'copy';
      copy(this.src, this.dest)
        .catch()
        .then(this.doNext);
    }
  }

  remove() {
    if (this.current) {
      this.next = 'delete';
    } else {
      this.current = 'delete';
      remove(this.dest)
        .catch()
        .then(this.doNext);
    }
  }
}

const initFile = (file, src, dest) => {
  if (!files[file]) files[file] = new File(file, src, dest);
};

const copyFile = (file, src, dest) => {
  initFile(file, src, dest);

  files[file].copy();
};

const removeFile = (file, src, dest) => {
  initFile(file, src, dest);

  files[file].remove();
};

module.exports = (src, dest, skipCopy) => {
  const watchFunc = () => {
    console.log(`sync: "${src}" with "${dest}"`);

    watch.createMonitor(src, (monitor) => {
      monitor.on('created', (f) => {
        console.log(`created: ${f}`);
        copyFile(f, src, dest);
      });

      monitor.on('changed', (f) => {
        console.log(`changed: ${f}`);
        copyFile(f, src, dest);
      });

      monitor.on('removed', (f) => {
        console.log(`removed: ${f}`);
        removeFile(f, src, dest);
      });
    });

    return Promise.resolve();
  };

  if (skipCopy) return watchFunc();

  return copy(src, dest).then(watchFunc);
};
