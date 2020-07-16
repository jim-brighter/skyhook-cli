const yaml = require('js-yaml');
const fs = require('fs');
const chalk = require('chalk');

const inquirer = require('../lib/inquirer');

const run = async () => {
    const config = {};

    const infraOrApp = await inquirer.askInfraOrApp();
    let prompts;

    if (infraOrApp['infraOrApp'] === 'infra' || infraOrApp['infraOrApp'] === 'infrastructure') {
        prompts = {'infrastructureParams': await inquirer.infraPrompts()};
    }

    Object.assign(config, infraOrApp);
    Object.assign(config, prompts);

    fs.writeFileSync('./Tetherfile', yaml.safeDump(config));

    console.log(`Your config is located at ${chalk.green('./Tetherfile')}`);
};

module.exports = {run}
