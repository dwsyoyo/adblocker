const { writeFileSync, readFileSync } = require('fs');
const { resolve } = require('path');

const { execSync } = require('child_process');
execSync(`cd ${__dirname}; npm ci`);

const core = require('@actions/core');

const currentTag = execSync(`git describe --abbrev=0 --tags ${process.env.GITHUB_SHA}`)
  .toString()
  .trim();

const CHANGELOG_PATH = resolve(process.env.GITHUB_WORKSPACE, 'CHANGELOG.md');
const CHANGELOG =   execSync(
  `node ${resolve(
    __dirname,
    'node_modules/.bin/lerna-changelog',
  )} --from v0.12.0 --to ${currentTag}`,
).toString().trim();

core.setOutput(
  "updated",
  (
    CHANGELOG === readFileSync(CHANGELOG_PATH, 'utf-8').trim()
      ? '0'
      : '1'
  ),
);

writeFileSync(
  CHANGELOG_PATH,
  CHANGELOG,
  'utf-8',
);
