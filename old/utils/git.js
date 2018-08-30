const isGit = require('is-git-repository');
// const inquirer = require('inquirer');
// const { pathExists, ensureDir } = require('fs-extra');
// const { join } = require('path');
// const simpleGit = require('simple-git');
// const projectDir = require('../project/projectDir');
// const projectName = require('../project/projectName');
// const {
//   getDoesRepoExist,
//   createRepoAndClone,
//   getCanConnectToGithub,
//   setupGitHubConnection,
// } = require('./github');
// const isSlug = require('../conditionals/isSlug');

// const createLocalRepo = (name, parentDir) => {
//   const dir = join(parentDir, name);
//   return ensureDir(dir)
//     .then(() => simpleGit(dir).init())
//     .then(() => {
//       projectDir.set(dir);
//       projectName.set(name);
//       console.log(`Created a new repo at ${dir}`);
//     });
// };

// const askToResortToLocal = (name, parentDir, message) =>
//   inquirer
//     .prompt([
//       {
//         type: 'confirm',
//         name: 'shouldContinue',
//         message,
//       },
//     ])
//     .then(({ shouldContinue }) => {
//       if (shouldContinue) return createLocalRepo(name, parentDir);

//       return Promise.resolve();
//     });

// const createAndCloneRepoOrResortToLocal = (name, parentDir) =>
//   getDoesRepoExist(name).then((repoExists) => {
//     if (!repoExists) return createRepoAndClone(name, parentDir);

//     return askToResortToLocal(
//       name,
//       parentDir,
//       `The repo "${name}" already exists for the GitHub user. Do you want to create this project as a local only repo?`,
//     );
//   });

exports.getIsRepo = () => Promise.resolve(isGit());

// exports.setupNewRepo = () =>
//   projectDir
//     .get()
//     .then(dir =>
//       inquirer.prompt([
//         {
//           type: 'input',
//           name: 'name',
//           message: 'Name for the new repo',
//           validate: (name) => {
//             if (!isSlug(name)) {
//               return 'The repo name must be in a url slug like format e.g. repo-name';
//             }

//             return true;
//           },
//         },
//         {
//           type: 'input',
//           name: 'parentDir',
//           message:
//             "Where do you want to create this project (don't include the project name)",
//           default: dir,
//           validate: parentDir => pathExists(parentDir),
//         },
//         {
//           type: 'confirm',
//           name: 'shouldAddToGitHub',
//           message: 'Do you want to add this as a new repo to GitHub?',
//         },
//       ]))
//     .then(({ name, shouldAddToGitHub, parentDir }) => {
//       if (!shouldAddToGitHub) return createLocalRepo(name, parentDir);

//       return getCanConnectToGithub().then((canConnectToGitHub) => {
//         if (canConnectToGitHub) {
//           return createAndCloneRepoOrResortToLocal(name, parentDir);
//         }

//         return setupGitHubConnection().then((connectedToGitHub) => {
//           if (connectedToGitHub) {
//             return createAndCloneRepoOrResortToLocal(name, parentDir);
//           }

//           return askToResortToLocal(
//             name,
//             parentDir,
//             'Could not establish a connection to GitHub. Do you want to create this project as a local only repo?',
//           );
//         });
//       });
//     });

// exports.getOrigin = () =>
//   projectDir.get().then(dir =>
//     new Promise((resolve) => {
//       simpleGit(dir).raw(
//         ['config', '--get', 'remote.origin.url'],
//         (err, result) => {
//           if (err) resolve(null);

//           resolve(result);
//         },
//       );
//     }));
