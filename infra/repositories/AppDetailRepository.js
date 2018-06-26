const CustomResult = require('./../../shared/CustomResult');
const CustomHttpGet = require('./../../shared/CustomFuncs').tryGet;
const AppDetail = require('./../../domain/valueObjects').AppDetail;
const metaTagReg = /<meta(?:>|\s+([\s\S]*?)>)/ig;

module.exports = class AppDetailRepository {

    async queryDetail(packageName = '') {
        console.log(packageName);
        const googlePlay = `https://play.google.com/store/apps/details?id=${packageName}`;
        const httpGetResult = await CustomHttpGet({ url: googlePlay });
        if (!httpGetResult.result) {
            return httpGetResult;
        }
        const metas = httpGetResult.result.match(metaTagReg);
        // console.log(metas);
        let detectProperties = ['name', 'contentRating', 'applicationCategory', 'image'];
        for (const dp of detectProperties) {
            const qry = metas.find(x => x.includes(`itemprop="${dp}"`));
            if (!qry) {
                return Promise.resolve(new CustomResult().withCode(1001).withMessage(`Not found itemprop ${dp}`));
            }
            console.log(qry);
        }

        return Promise.resolve(new CustomResult().withResult(metas));
    }
    async save(appDetailObj = new AppDetail()) {
        console.log('called');
        return Promise.resolve(new CustomResult());
    }
}