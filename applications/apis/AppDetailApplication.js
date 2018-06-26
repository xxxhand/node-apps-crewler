const CustomResult = require('./../../shared/CustomResult');
const CustomFuncs = require('./../../shared/CustomFuncs');
const Repositories = require('./../../infra/repositories');

const appDetailRepository = new Repositories.AppDetailRepository();

exports.findDetail = function (req, res) {
    res.status(200).json(new CustomResult());
    _execute(req.body);
}

async function _execute(packageNames = []) {
    const executeResult = [];
    for (const pkg of packageNames) {
        await CustomFuncs.sleep(1000);
        const appDetailResult = await appDetailRepository.queryDetail(pkg);
        if (!appDetailResult.result) {
            executeResult.push(appDetailResult.withResult(pkg));
            continue;
        }
        const saveResult = await appDetailRepository.save(appDetailResult.result);
        executeResult.push(saveResult.withResult(pkg));
    }
}

