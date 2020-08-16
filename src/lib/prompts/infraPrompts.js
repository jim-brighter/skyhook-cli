const inquirer = require('inquirer');

const validateInfraPrompts = (value) => {
    return !!value.length || 'Value can\'t be empty';
}

const infraPrompts = () => {
    const questions = [
        {
            name: 'projectName',
            type: 'input',
            message: 'Enter the name of your project (will be prefixed to most resources):',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'containerPlatform',
            type: 'list',
            choices: ['EKS', 'ECS (Fargate)', 'ECS (EC2)', 'OCP'],
            default: 'EKS',
            message: 'Which container management platform do you want to use?'
        },
        {
            name: 'imageRepository',
            type: 'list',
            choices: ['ECR', 'Nexus'],
            default: 'ECR',
            message: 'Which docker image repository do you want to use?'
        },
        {
            name: 'jenkinsAdminUser',
            type: 'input',
            message: 'Enter the Jenkins admin username:',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'jenkinsAdminPassword',
            type: 'password',
            message: 'Enter the Jenkins admin password:',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'sonarAdminUser',
            type: 'input',
            message: 'Enter the Sonarqube admin username:',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'sonarAdminPassword',
            type: 'password',
            message: 'Enter the Sonarqube admin password:',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'anchoreAdminUsername',
            type: 'input',
            message: 'Enter the Anchore admin username:',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'anchoreAdminPassword',
            type: 'password',
            message: 'Enter the Anchore admin password',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'seleniumAdminUsername',
            type: 'input',
            message: 'Enter the Selenium admin username',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        },
        {
            name: 'seleniumAdminPassword',
            type: 'password',
            message: 'Enter the Selenium admin password',
            validate: (value) => {
                return validateInfraPrompts(value);
            }
        }
    ];

    return inquirer.prompt(questions);
}

module.exports = {
    infraPrompts
}
