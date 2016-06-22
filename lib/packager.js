#!/usr/bin/env node
"use strict";

const spawn = require('child_process').spawn;
const pkg = require("../package.json");

const DOCKER_ID = `rbmh-docker.docker.rbmhops.net/${pkg.name}:${pkg.version}`;

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " build|run|push");
  process.exit(-1);
}

let exec;
switch (process.argv[2]) {
  case 'build':
    exec = spawn('docker', ['build', '-t', DOCKER_ID, '.']);
    break;
  case 'push':
    exec = spawn('docker', ['push', DOCKER_ID]);
    break;
  case 'run':
    exec = spawn('docker', ['run', '-P', DOCKER_ID]);
    break;
  default:
    throw new Error("unknown command");
}

exec.stdout.on('data', (data) => console.log(data.toString()));
exec.stderr.on('data', (data) => console.log(`stderr: ${data}`));
exec.on('close', process.exit);
