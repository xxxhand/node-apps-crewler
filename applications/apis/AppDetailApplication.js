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
        .then(() => AppLogger.info(`Find end`))
        .catch(e => AppLogger.error(`Find exception: ${e}`))
}

async function _execute(packageNames = []) {
    for (const pkg of packageNames) {
        await CustomFuncs.sleep(1000);
        const customResult = await _findAndSave(packageNames);
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

