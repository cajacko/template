const ejs = require('ejs');
const { readFile, writeFile, ensureFile } = require('fs-extra');

exports.copyTmpl = (path, dest, variables = {}) =>
  readFile(path).then((contents) => {
    const template = ejs.compile(contents.toString());

    const finalContents = template(variables);

    return ensureFile(dest).then(() => writeFile(dest, finalContents));
  });

exports.syncDirs = require('./syncDirs');
