import { type UserConfig, RuleConfigSeverity } from '@commitlint/types';

// eslint-disable-next-line max-len
// https://github.com/conventional-changelog/commitlint/blob/master/%40commitlint/config-conventional
// https://commitlint.js.org/reference/configuration.html

const Configuration: UserConfig = {

  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [RuleConfigSeverity.Error, 'always', [
      'plugin',
      'vscode',
      'git',
      'github',
      'github-actions',
      'deps',
      'readme',
      'changelog'
    ]]
  },
  defaultIgnores: true,
  ignores: [
    (commit: string) => commit.startsWith('build(deps): bump'),
    (commit: string) => commit.startsWith('ci(deps): bump')
  ],
};

export default Configuration;
