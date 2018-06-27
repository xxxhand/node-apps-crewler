const alllowEnvs = ['local', 'dev', 'qa', 'prod'];
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'local';
if (!alllowEnvs.includes(process.env.NODE_ENV)) {
    throw new Error(`NODE_ENV must be ${alllowEnvs.join('|')}`);
}

const Cluster = require('cluster');
const App = require('./../bootstrap/App');
const AppConfig = require('./../shared/CustomConfig').AppConfig();
const AppLogger = require('./../shared/CustomLogger').AppLogger();


const server = require('http').createServer(App).listen(AppConfig.serverPort);
server.on('listening', () => {
    console.log(`Server up on ${server.address().port}`);
    AppLogger.info(`Server up on ${server.address().port}`);
});
server.on('error', err => {
    console.error(`Server error ${err}`);
    AppLogger.error(`Server error ${err}`);
    process.exit(0);
});