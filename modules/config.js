const fs = require('fs'); //filesync
let config = JSON.parse(fs.readFileSync('config/config.json'));
function reloadConfig() {
    config = JSON.parse(fs.readFileSync('config/config.json'));
    return config;
}
module.exports = config;