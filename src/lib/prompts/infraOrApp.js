const inquirer = require('inquirer');

const askInfraOrApp = () => {
    const questions = [
        {
            name: 'infraOrApp',
            type: 'list',
            choices: ['infra', 'app'],
            default: 'infra',
            message: 'Is this an Infrastructure (infra) repo or an Application (app) repo?'
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    askInfraOrApp
};
