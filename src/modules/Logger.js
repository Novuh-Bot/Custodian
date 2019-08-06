const { inspect } = require('util');

const chalk = require('chalk');
const moment = require('moment');

const log = console.log;

module.exports = {
  debug: msg => {
    log(chalk`{bold.green DEBUG}: ${msg}`);
  },

  info: msg => {
    log(chalk`{bold.grey INFO}: ${msg}`);
  },

  load: msg => {
    log(chalk`{bold.cyan LOADING}: ${msg}`);
  },
  

  http: msg => {
    log(chalk`{bold.yellow HTTP}: ${msg}`);
  },

  error: (e, exit = false) => {
    if (!(e instanceof Error)) {
      exit ? log(chalk`{bold.black.bgRed FATAL}: ${e}`) : log(chalk`{bold.red ERROR}: ${e}`);
      if (exit) process.exit(1);
    } else {
      exit ? log(chalk`{bold.black.bgRed FATAL}: ${e.stack ? e.stack : e.message}`) : log(chalk`{bold.red ERROR}: ${e.stack ? e.stack : e.message}`);
      if (exit) process.exit(1);
    } 
  },

  warn: msg => {
    log(chalk`{bold.yellow WARN}: ${msg}`);
  },

  command: msg => {
    log(chalk`{bold.magenta CMD}: ${msg}`);
  },

  login: msg => {
    log(chalk`{bold.green LOGIN}: ${msg}`);
  }
};