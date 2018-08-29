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

const updatePackage = (
  packageDir,
  githubUrl,
  packageName,
  updatePackageWithNewVersionDir,
) =>
  getShouldUpdatePackage(packageDir).then((shouldUpdatePackage) => {
    if (!shouldUpdatePackage) return Promise.resolve();

    return askForNewPackageVersion(packageDir).then(version =>
      setPackageVersion(packageDir, version)
        .then(() => git.commit(packageDir, `v${version}`))
        .then(() =>
          // Does this need to do a github one as well
          git.tag(packageDir, `v${version}`, `Published version ${version}`))
        .then(() => git.push(packageDir))
        .then(() =>
          runCommand(
            `yarn add ${githubUrl}#v${version}`,
            updatePackageWithNewVersionDir,
          ))
        .then(() =>
          git.commit(
            updatePackageWithNewVersionDir,
            `Upgraded ${packageName} lib to v${version}`,
          )));
  });

const upgrade = () =>
  Promise.all([getSettings(['localNPMPackagePaths']), getProjectDir()]).then(([localNPMPackagePaths, projectDir]) => {
    const templateUtilsDir = localNPMPackagePaths['@cajacko/template-utils'];
    const templateDir = localNPMPackagePaths['@cajacko/template'];

    return updatePackage(
      templateUtilsDir,
      'https://github.com/cajacko/template-utils.git',
      'template-utils',
      templateDir,
    ).then(() =>
      updatePackage(
        templateDir,
        'https://github.com/cajacko/template.git',
        'template',
        projectDir,
      ));
  });

export default upgrade;
