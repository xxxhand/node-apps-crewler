const FS = require('fs');
const CustomResult = require('./../../shared/CustomResult');
const CustomFuncs = require('./../../shared/CustomFuncs');
const Repositories = require('./../../infra/repositories');
const AppLogger = require('./../../shared/CustomLogger').AppLogger();
const FailLogger = require('./../../shared/CustomLogger').FailLogger();

const appDetailRepository = new Repositories.AppDetailRepository();

exports.findDetail = function (req, res) {
    res.status(200).json(new CustomResult());
    // AppLogger.info(req.body);
    _execute(req.body.names)
        .then(() => _findAgain())
        .then(() => AppLogger.info(`Find end`))
        .catch(e => AppLogger.error(`Find exception: ${e}`))
}

async function _execute(packageNames = []) {
    for (const pkg of packageNames) {
        await CustomFuncs.sleep(1000);
        const customResult = await _findAndSave(pkg);
        if (!customResult.successful()) {
            FailLogger.info(`${pkg}-- ${customResult.message}`);
        }
    }

    return Promise.resolve();
}
async function _findAndSave(packageName = '') {
    try {
        let appDetailResult = await appDetailRepository.queryDetail(packageName);
        if (!appDetailResult.result) {
            return Promise.resolve(appDetailResult);
        }
        appDetailResult = await appDetailRepository.save(appDetailResult.result);
        return Promise.resolve(appDetailResult);
    } catch (ex) {
        return Promise.resolve(new CustomResult()
            .withCode(500)
            .withMessage(ex.message)
            .withResult(packageName)
        );
    }
}

async function _findAgain() {
    await CustomFuncs.sleep(5000);
    AppLogger.info(`Find fail again...`);
    const failLogPath = './log/fail.log';
    if (!FS.existsSync(failLogPath)) {
        return Promise.resolve();
    }
    const failStr = FS.readFileSync(failLogPath).toString('utf-8');
    const failAry = failStr.split('\n');
    

    const packageNames = new Set();
    failAry.map(x => packageNames.add(x.substring(0, x.indexOf('--'))));

    for (const pkg of [...packageNames]) {
        if (!pkg || pkg.length === 0) {
            continue;
        }
        await CustomFuncs.sleep(1000);
        const customResult = await _findAndSave(pkg);
        if (!customResult.successful()) {
            AppLogger.info(`Retry --${pkg}-- ${customResult.message}`);
        }
    }

    return Promise.resolve();
}

