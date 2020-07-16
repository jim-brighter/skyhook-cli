#!/usr/bin/env node

const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const yaml = require('js-yaml');
const fs = require('fs');

const inquirer = require('./lib/inquirer');

clear();

console.log(
    chalk.cyan(
        figlet.textSync('Skyhook CLI', {horizontalLayout: 'fitted'})
    )
);

const run = async () => {
    const infraOrApp = await inquirer.askInfraOrApp();

    fs.writeFileSync('./Tetherfile', yaml.safeDump(infraOrApp));

    console.log(`Your config is located at ${chalk.green('./Tetherfile')}`);
};

run();
