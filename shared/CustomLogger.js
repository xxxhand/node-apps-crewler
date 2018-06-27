const FS = require('fs');
const Log4js = require('log4js');

const logD = './log';

if (!FS.existsSync(logD)) {
    FS.mkdirSync(logD);
}


let logger4js = null;
function initialLogger() {
    logger4js = Log4js.configure({
        appenders: {
            app: {
                type: 'dateFile',
                filename: `${logD}/app.log`,
                pattern: '-yyyy-MM-dd',
                daysToKeep: 7,
                layout: {
                    type: 'pattern',
                    pattern: '%d %x{pid} [%p] %c - %m',
                    tokens: {
                        pid: () => process.pid
                    }
                }
            },
            sql: {
                type: 'dateFile',
                filename: `${logD}/sql.log`,
                pattern: '-yyyy-MM-dd',
                daysToKeep: 7,
                layout: {
                    type: 'pattern',
                    pattern: '%d %x{pid} [%p] %c - %m',
                    tokens: {
                        pid: () => process.pid
                    }
                }
            },
            fail: {
                type: 'file',
                filename: `${logD}/fail.log`,
                maxLogSize: 10240,
                layout: {
                    type: 'messagePassThrough'
                }
            }
        },
        categories: {
            default: {
                appenders: ['app'],
                level: 'debug'
            },
            sql: {
                appenders: ['sql'],
                level: 'debug'
            },
            fail: {
                appenders: ['fail'],
                level: 'info'
            }
        }
    });
}
function getAppLogeer() {
    if (!logger4js) {
        initialLogger();
    }
    return logger4js.getLogger('app');
}
function getSqlLogger() {
    if (!logger4js) {
        initialLogger();
    }
    return logger4js.getLogger('sql');
}
function getFailLogger() {
    if (!logger4js) {
        initialLogger();
    }
    return logger4js.getLogger('fail');  
}
exports.InitialLogger = initialLogger;
exports.AppLogger = getAppLogeer;
exports.SqlLogger = getSqlLogger;
exports.FailLogger = getFailLogger;


