const CustomResult = require('./../../shared/CustomResult');
const CustomFuncs = require('./../../shared/CustomFuncs');
const Repositories = require('./../../infra/repositories');

const appDetailRepository = new Repositories.AppDetailRepository();

exports.findDetail = function (req, res) {
    res.status(200).json(new CustomResult());
    _execute(req.body).then(result => {
        console.log(result);
    }).catch(e => {
        console.error(e);
    })
}

async function _execute(packageNames = []) {
    const restult = await _findAndSave(packageNames);
    
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

}

