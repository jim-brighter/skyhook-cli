const chalk = require('chalk');

const infraOrAppPrompt = require('../lib/prompts/infraOrApp');
const infraPrompts = require('../lib/prompts/infraPrompts');
const appPrompts = require('../lib/prompts/appPrompts');
const fileService = require('../lib/services/fileService');

const run = async () => {
    const config = {};

    const infraOrApp = await infraOrAppPrompt.askInfraOrApp();
    let prompts;

    switch (infraOrApp['infraOrApp']) {
        case 'infra':
            prompts = {'infrastructureParams': await infraPrompts.infraPrompts()};
            break;
        case 'app':
            prompts = {'applicationParams': await appPrompts.appPrompts()};
            break;
        default:
            console.error('Invalid choice');
            process.exit(1);
    }

    Object.assign(config, infraOrApp);
    Object.assign(config, prompts);

    fileService.writeTetherfile(config);

    console.log(`Your config is located at ${chalk.green('./Tetherfile')}`);
};

module.exports = {run}
