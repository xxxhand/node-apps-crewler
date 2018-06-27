const CustomResult = require('./../../shared/CustomResult');
const CustomFuncs = require('./../../shared/CustomFuncs');
const Repositories = require('./../../infra/repositories');
const AppLogger = require('./../../shared/CustomLogger').AppLogger();
const FailLogger = require('./../../shared/CustomLogger').FailLogger();

const appDetailRepository = new Repositories.AppDetailRepository();

exports.findDetail = function (req, res) {
    res.status(200).json(new CustomResult());
    _execute(req.body).then(result => {
        AppLogger.info(`Find end result: ${JSON.stringify(result)}`);
    }).catch(e => {
        AppLogger.error(`Find exception: ${e}`);
    })
}

async function _execute(packageNames = []) {
    const result = await _findAndSave(packageNames);
    _resultHandler(result);
    return Promise.resolve(result);
}
async function _findAndSave(packageNames = []) {
    const executeResult = [];
    for (const pkg of packageNames) {
        await CustomFuncs.sleep(1000);
        try {
            const appDetailResult = await appDetailRepository.queryDetail(pkg);
            if (!appDetailResult.result) {
                executeResult.push(appDetailResult.withResult(pkg));
                continue;
            }
            const saveResult = await appDetailRepository.save(appDetailResult.result);
            executeResult.push(saveResult.withResult(pkg));
        } catch (ex) {
            executeResult.push(new CustomResult()
                .withCode(500)
                .withMessage(ex.message)
                .withResult(pkg)
            );
        }
    }
    return Promise.resolve(executeResult);
}
async function _resultHandler(result = []) {
    if (!result || !Array.isArray(result) || result.length === 0) {
        return Promise.resolve(false);
    }
    const failRecords = result.filter(x => x.code > 0);
    failRecords.map(x => FailLogger.info(`${x.result}-- ${x.message}`));

    return Promise.resolve(true);
}

