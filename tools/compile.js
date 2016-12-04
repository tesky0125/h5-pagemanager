/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/**
 * 根据commit-id来增量编译js
 */

// usage: babel-node tools/run compile --cache --watch
import {
  // exec, // don't use exec async, it will break log sequence
  execSync,
} from 'child_process';
import fs from 'file-system';
import path from 'path';
// import babel from 'babel-core';
const babel = require('babel-core');
import gaze from 'gaze';
import run from './run';

// simulate exec async
const exec = function anonymous(cmd, options, cb) {
  options.encoding = 'utf8';
  const stdout = execSync(cmd, options);
  // console.log('stdout:', stdout);
  cb(null, stdout);
};

const cache = process.argv.includes('--cache');
const watch = process.argv.includes('--watch');
console.log('CACHE:', watch, ',WATCH:', watch);

const releaseFile = 'release.json';

const compileFiles = function anonymous(files) {
  for (let i = 0; i < files.length; i++) {
    if (files[i].indexOf('src') >= 0 && path.extname(files[i]) === '.js') {
      const srcFile = files[i];
      const destFile = srcFile.replace('src', 'build');
      console.log('[Compile]:', srcFile, '->', destFile);

      // file path maybe delete in git history
      if (fs.existsSync(srcFile)) {
        fs.mkdirSync(path.dirname(destFile));

        const result = babel.transformFileSync(srcFile);
        fs.writeFileSync(destFile, result.code);
      }
    }
  }
};

// compile src folder
const compileAll = function anonymous(cb) {
  console.log('[Compile]: compile all files.');
  const files = [];
  fs.recurseSync('src', (filepath) => {
    const relativePath = path.relative('.', filepath);
    files.push(relativePath);
  });
  compileFiles(files);
  if (cb) cb();
};

// compile diff files between commit id and head, if commit id is empty, compile files in working tree, not include untracked files
const compileDiff = function anonymous(commitId, cb) {
  console.log('[Compile]: start compile diff files...');
  // diff between head and commit id
  const cmd = 'git diff --name-only HEAD ' + commitId;
  console.log('[Compile]:', cmd);
  exec(cmd, {
    cwd: '.',
  }, (error, stdout) => {
    const files = stdout.split('\n');
    compileFiles(files);
    if (cb) cb();
  });
};

// compile untracked files
const compileUntrack = function anonymous(cb) {
  exec('git ls-files --others --exclude-standard', {
    cwd: '.',
  }, (error, stdout) => {
    const files = stdout.split('\n');
    compileFiles(files);
    if (cb) cb();
  });
};

// get git head commit id
const getHeadId = function anonymous(cb) {
  // get last commit id
  exec('git rev-parse HEAD', {
    cwd: '.',
  }, (error, stdout) => {
    const commitId = stdout.split('\n')[0];
    console.log('[Compile]: current head-id:', commitId);
    if (cb) cb(commitId);
  });
};

// save commit id after compile success
const saveCommitId = function anonymous(commitId) {
  console.log('[Compile]: save commit id: ', commitId);
  const obj = {
    'commit-id': commitId,
    'build-file': [],
  };
  fs.writeFileSync(releaseFile, JSON.stringify(obj));
};

// 根据git commit情况增量编译js,可用来替换 babel ./src --out-dir ./build
async function compile() {
  // 编译js
  if (cache && fs.existsSync(releaseFile)) {
    const obj = JSON.parse(fs.readFileSync(releaseFile));
    let commitId = obj['commit-id'] || '';
    console.log('[Compile]: read commit-id:', commitId);
    getHeadId((headId) => {
      if (headId === commitId) commitId = '';
      compileDiff(commitId, () => {
        saveCommitId(headId);
      });
    });
    compileUntrack();
  } else {
    compileAll(() => {
      getHeadId((headId) => {
        saveCommitId(headId);
      });
    });
  }

  if (watch) {
    const watcher = new gaze.Gaze('src/**/*');
    // watch file change
    watcher.on('all', (event, filepath) => {
      console.log('Watch: ', filepath);
      if (filepath.indexOf('src') >= 0 && path.extname(filepath) === '.js') {
        const relative = path.relative('.', filepath);
        compileFiles([relative]);
      }
    });
  }
}

export default compile;
