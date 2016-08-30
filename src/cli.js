#!/usr/bin/env node

import { accessSync, statSync, readFileSync } from 'fs';
import runner from './runner';

// CLI Docs
const argv = require('yargs')
  .usage('Usage: ./$0 --rules=[filename] --tasks=[filename]')
  .option('rules', {
    alias: 'r',
    describe: 'Path to the file with rules',
    demand: true,
  })
  .option('tasks', {
    alias: 't',
    describe: 'Path to the file with tasks',
    demand: true,
  })
  .argv;

// INPUT FILES
const {
  rules: rulesFilename,
  tasks: tasksFilename,
} = argv;

// HELPERS
const isFileAccessible = (path) => {
  try {
    accessSync(path);
    return path;
  } catch (e) {
    throw new Error(`Don't have permission to ${path}`);
  }
};

const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch (e) {
    throw new Error(`Can't perform statSync for: ${path}`);
  }
};

const readFile = (path) => {
  try {
    return readFileSync(path).toString();
  } catch (e) {
    throw new Error(`Can't read file: ${path}`);
  }
};

const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    throw new Error(`Can't parse JSON: ${e.message}`);
  }
};

// MAIN LOGIC
if (
  isFile(isFileAccessible(rulesFilename))
  && isFile(isFileAccessible(tasksFilename))
) {
  const rules = parseJson(readFile(rulesFilename));
  const tasks = parseJson(readFile(tasksFilename));

  tasks.forEach(task => runner(rules, task, rules[0].id));
} else {
  throw new Error('Files should be a regular files (not directories, sockets or whatever else)');
}
