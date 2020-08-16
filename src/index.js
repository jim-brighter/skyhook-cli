#!/usr/bin/env node

const chalk = require('chalk');
const figlet = require('figlet');

const init = require('./cli/init');

console.clear();

console.log(
    chalk.cyan(
        figlet.textSync('Skyhook CLI', {horizontalLayout: 'fitted'})
    )
);

const command = process.argv[2];

switch (command) {
    case 'init':
        init.run();
        break;
    default:
        console.info(chalk.redBright('init is the only command implemented so far'));
        process.exit(0);
}
