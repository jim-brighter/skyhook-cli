const yaml = require('js-yaml');
const fs = require('fs');
const chalk = require('chalk');

const infraOrAppPrompt = require('../lib/prompts/infraOrApp');
const infraPrompts = require('../lib/prompts/infraPrompts');
const appPrompts = require('../lib/prompts/appPrompts');

const run = async () => {
    const config = {};

    const infraOrApp = await infraOrAppPrompt.askInfraOrApp();
    let prompts;

    if (infraOrApp['infraOrApp'] === 'infra' || infraOrApp['infraOrApp'] === 'infrastructure') {
        prompts = {'infrastructureParams': await infraPrompts.infraPrompts()};
    }
    else if (infraOrApp['infraOrApp'] === 'app' || infraOrApp['infraOrApp'] === 'application') {
        prompts = {'applicationParams': await appPrompts.appPrompts()};
    }
    else {
        console.error('Invalid choice');
        process.exit(1);
    }

    Object.assign(config, infraOrApp);
    Object.assign(config, prompts);

    fs.writeFileSync('./Tetherfile', yaml.safeDump(config));

    console.log(`Your config is located at ${chalk.green('./Tetherfile')}`);
};

module.exports = {run}
