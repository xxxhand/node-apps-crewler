const FS = require('fs');

let configInstance;
function initialConfig() {
    const configPath = `./configs/appConfig.${process.env.NODE_ENV}.json`;
    if (!FS.existsSync(configPath)) {
        throw new Error(`Not found file ${configPath}`);
    }
    const configStr = FS.readFileSync(configPath);
    configInstance = JSON.parse(configStr);
}
function getConfig() {
    if (!configInstance) {
        initialConfig();
    }
    return configInstance;
}

exports.InitialConfig = initialConfig;
exports.AppConfig = getConfig;