'use strict';

/**
 * Dependencies
 */

const installScript = require('../');
const removeFile = require('fs').unlinkSync;
const writeFile = require('fs').writeFileSync;
const exec = require('mz/child_process').exec;
const join = require('path').join;
const test = require('ava');


/**
 * Tests
 */

test ('build a script', function (t) {
  let script = installScript({ name: 'ava' });

  // save script
  let path = join(__dirname, 'install-script.sh');
  writeFile(path, script, 'utf-8');

  // build docker container
  let options = {
    cwd: __dirname
  };

  return exec('docker build -t test-install-script .', options)
    .then(function () {
      // test if npm module installed
      return exec('docker run --rm test-install-script ava --help');
    })
    .then(function () {
      removeFile(path);
    });
});
