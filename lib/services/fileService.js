const yaml = require('js-yaml');
const fs = require('fs');

const writeTetherFile = (config) => {
    fs.writeFileSync('./Tetherfile', yaml.safeDump(config));
};

module.exports = {
    writeTetherFile
}
