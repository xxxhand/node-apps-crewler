const Sequelize = require('sequelize');
const AppLogger = require('./CustomLogger').AppLogger();
const SqlLogger = require('./CustomLogger').SqlLogger();
const AppConfig = require('./../shared/CustomConfig').AppConfig();


const lakeRoot = AppConfig.databases.lakeMain;
const lakeDB = new Sequelize(lakeRoot.dbName, lakeRoot.user, lakeRoot.password, {
    dialect: lakeRoot.dialect,
    host: lakeRoot.host,
    port: lakeRoot.port,
    pool: lakeRoot.poolSetting,
    logging: str => SqlLogger.debug(str)
});

function tryConnect2Lake(maxRetry = 0) {
    return new Promise((res, rej) => {
        if (maxRetry > 5) {
            return rej(`Can not open lake over 5 times`);
        }
        lakeDB.authenticate().then(() => {
            console.log(`Success connect to ${lakeRoot.host}:${lakeRoot.port}`);
            AppLogger.info(`Success connect to ${lakeRoot.host}:${lakeRoot.port}`);
            return res(true);
        }).catch(ex => {
            console.error(`Authenticate lakeDB failed: ${ex}`);
            AppLogger.error(`Authenticate lakeDB failed: ${ex}`)
            return res(false);
        })
    }).then(success => {
        if (success) {
            console.log(`Lake DB opened...`);
            AppLogger.info(`Lake DB opened...`);
            return success;
        }
        return setTimeout(() => {
            maxRetry += 1;
            console.log(`Retry connect to lake ${maxRetry}`);
            AppLogger.info(`Retry connect to lake ${maxRetry}`);
            tryConnect2Lake(maxRetry);
        }, lakeRoot.retryConnectInterval);
    }).catch(e => {
        console.error(e);
        process.exit(0);
    })
}


exports.LakeDBInstance = lakeDB;
exports.TryConnectLake = tryConnect2Lake;