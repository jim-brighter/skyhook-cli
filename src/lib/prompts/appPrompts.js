const inquirer = require('inquirer');

const validateAppPrompts = (value) => {
    return !!value.length || 'Value can\'t be empty';
};

const appPrompts = () => {
    const questions = [
        {
            name: 'containerPlatform',
            type: 'list',
            choices: ['EKS', 'ECS', 'OCP'],
            default: 'EKS',
            message: 'Which container management platform are you using?'
        },
        {
            name: 'dockerImage',
            type: 'input',
            message: 'Enter the docker image name for this app (e.g. repository/namespace/image:tag):',
            validate: (value) => {
                return validateAppPrompts(value);
            }
        },
        {
            name: 'appName',
            type: 'input',
            message: 'Enter the desired app name - will be used for service/task name:',
            validate: (value) => {
                return validateAppPrompts(value)
            }
        }
    ];

    return inquirer.prompt(questions);
};

module.exports = {
    appPrompts
}
