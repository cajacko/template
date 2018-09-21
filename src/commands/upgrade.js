// @flow

import {
  getShouldUpdatePackage,
  askForNewPackageVersion,
  setPackageVersion,
  getSettings,
  git,
  runCommand,
  getProjectDir,
} from '@cajacko/template-utils';
import { readJSON } from 'fs-extra';
import { join } from 'path';

const updatePackage = (
  packageDir,
  githubUrl,
  packageName,
  updatePackageWithNewVersionDir,
  dontAdd
) =>
  getShouldUpdatePackage(packageDir).then((shouldUpdatePackage) => {
    if (!shouldUpdatePackage) return Promise.resolve();

    return askForNewPackageVersion(packageDir).then(version =>
      setPackageVersion(packageDir, version)
        .then(() => git.commit(packageDir, `v${version}`, true, true))
        .then(() =>
          // Does this need to do a github one as well
          git.tag(packageDir, `v${version}`, `Published version ${version}`))
        .then(() => git.push(packageDir))
        .then(() => {
          if (dontAdd) return Promise.resolve();

          return runCommand(
            `yarn add ${githubUrl}#v${version}`,
            updatePackageWithNewVersionDir
          ).then(() =>
            git.commit(
              updatePackageWithNewVersionDir,
              `Upgraded ${packageName} lib to v${version}`,
              true,
              true
            ));
        }));
  });

const upgrade = () =>
  Promise.all([getSettings(['localNPMPackagePaths']), getProjectDir()]).then(([localNPMPackagePaths, projectDir]) =>
    readJSON(join(projectDir, 'package.json')).then(({ dependencies }) => {
      const templateUtilsDir =
          localNPMPackagePaths['@cajacko/template-utils'];
      const templateDir = localNPMPackagePaths['@cajacko/template'];
      const libDir = localNPMPackagePaths['@cajacko/lib'];

      return updatePackage(
        templateUtilsDir,
        'https://github.com/cajacko/template-utils.git',
        'template-utils',
        templateDir
      )
        .then(() =>
          updatePackage(
            libDir,
            'https://github.com/cajacko/lib.git',
            'lib',
            projectDir,
            !dependencies['@cajacko/lib']
          ))
        .then(() =>
          updatePackage(
            templateDir,
            'https://github.com/cajacko/template.git',
            'template',
            projectDir,
            !dependencies['@cajacko/template']
          ));
    }));

export default upgrade;
