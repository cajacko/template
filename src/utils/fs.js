const ejs = require('ejs');
const { readFile, writeFile } = require('fs-extra');

exports.copyTmpl = (path, dest, variables = {}) =>
  readFile(path).then((contents) => {
    const template = ejs.compile(contents.toString());

    const finalContents = template(variables);

    return writeFile(dest, finalContents);
  });

exports.syncDirs = require('./syncDirs');
