const inquirer = require('inquirer');

const validateInfraOrApp = (value) => {

    const validChoices = ['app', 'application', 'infra', 'infrastructure'];

    return (value.length && validChoices.includes(value.toLowerCase())) || `Please enter one of ${validChoices.join(', ')}`
};

const askInfraOrApp = () => {
    const questions = [
        {
            name: 'infraOrApp',
            type: 'input',
            message: 'Is this an Infrastructure (infra) repo or an Application (app) repo?',
            validate: (value) => {
                return validateInfraOrApp(value);
            }
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    askInfraOrApp
};
