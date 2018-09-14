// @flow

import SetupTemplate from '../modules/SetupTemplate';
import { MAX_LINE_LENGTH } from '../config/general';

const eslintConfig = {
  extends: ['airbnb'],
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'func-names': 'off',
    'no-warning-comments': ['error', { location: 'anywhere' }],
    'no-console': 'error',
    'comma-dangle': [
      2,
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'import/prefer-default-export': 'off',
    'valid-jsdoc': [
      'error',
      {
        matchDescription: '.+',
        requireParamDescription: true,
        requireReturnDescription: true,
        requireParamType: true,
      },
    ],
    'require-jsdoc': [
      'warn',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: true,
        },
      },
    ],
    'max-lines': [
      'error',
      {
        max: 150,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-len': [
      'error',
      {
        code: MAX_LINE_LENGTH,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreRegExpLiterals: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: true,
        peerDependencies: true,
      },
    ],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'class-methods-use-this': 'off',
  },
  plugins: ['jest', 'flowtype'],
  env: {
    'jest/globals': true,
  },
  globals: {
    fetch: false,
    document: false,
    window: false,
    Image: false,
  },
};

class Eslint extends SetupTemplate {
  setupFiles() {
    // TODO: run on test script

    const promises = [];

    promises.push(this.fs.writeJSON(eslintConfig, '.eslintrc'));

    promises.push(this.npm.add({
      'babel-eslint': { type: 'dev', version: '8.2.2' },
      eslint: { type: 'dev', version: '4.18.1' },
      'eslint-config-airbnb': { type: 'dev', version: '16.1.0' },
      'eslint-config-react-app': { type: 'dev', version: '2.1.0' },
      'eslint-import-resolver-babel-module': {
        type: 'dev',
        version: '4.0.0',
      },
      'eslint-loader': { type: 'dev', version: '1.9.0' },
      'eslint-plugin-flowtype': { type: 'dev', version: '2.46.1' },
      'eslint-plugin-import': { type: 'dev', version: '2.9.0' },
      'eslint-plugin-jest': { type: 'dev', version: '21.12.2' },
      'eslint-plugin-jsx-a11y': { type: 'dev', version: '6.0.3' },
      'eslint-plugin-react': { type: 'dev', version: '7.7.0' },
    }));

    return Promise.all(promises);
  }
}

export default Eslint;
