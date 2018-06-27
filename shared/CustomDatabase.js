const Sequelize = require('sequelize');
const AppLogger = require('./CustomLogger').AppLogger();
const SqlLogger = require('./CustomLogger').SqlLogger();

const cfg = {
    host: '10.57.52.147',
    port: 1433,
    dbName: 'lakeDev',
    user: 'raduser',
    password: 'rad!User',
    dialect: 'mssql',
}
const lakeDB = new Sequelize(cfg.dbName, cfg.user, cfg.password, {
    dialect: cfg.dialect,
    host: cfg.host,
    port: cfg.port,
    pool: {
        min: 3,
        max: 10,
        acquire: 60000
    },
    logging: str => SqlLogger.debug(str)
});

function tryConnect2Lake(maxRetry = 0) {
    return new Promise((res, rej) => {
        if (maxRetry > 5) {
            return rej(`Can not open lake over 5 times`);
        }
        lakeDB.authenticate().then(() => {
            console.log(`Success connect to ${cfg.host}:${cfg.port}`);
            AppLogger.info(`Success connect to ${cfg.host}:${cfg.port}`);
            return res(true);
        }).catch(ex => {
            console.error(`Authenticate failed: ${ex}`);
            AppLogger.error(`Authenticate failed: ${ex}`)
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
        }, 60000);
    }).catch(e => {
        console.error(e);
        process.exit(0);
    })
}


exports.LakeDBInstance = lakeDB;
exports.TryConnectLake = tryConnect2Lake;