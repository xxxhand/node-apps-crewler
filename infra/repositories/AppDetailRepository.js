const CheerIO = require('cheerio');
const CustomResult = require('./../../shared/CustomResult');
const CustomHttpGet = require('./../../shared/CustomFuncs').tryGet;
const AppDetail = require('./../../domain/valueObjects').AppDetail;
// const metaTagReg = /<meta(?:>|\s+([\s\S]*?)>)/ig;
const errorReg = /<div\sid=\"error-section\"/ig;

module.exports = class AppDetailRepository {

    async queryDetail(packageName = '') {
        console.log(packageName);
        if (!packageName || packageName.length === 0) {
            return Promise.resolve(new CustomResult().withCode(400).withMessage(`Package name is empty`));
        }
        const googlePlay = `https://play.google.com/store/apps/details?id=${packageName}`;
        const httpGetResult = await CustomHttpGet({ url: googlePlay });
        if (!httpGetResult.result) {
            return httpGetResult;
        }
        if (errorReg.test(httpGetResult.result)) {
            return Promise.resolve(new CustomResult().withCode(400).withMessage(`Not found package ${packageName}`));
        }
        const jq = CheerIO.load(httpGetResult.result);

        const appDetailObj = new AppDetail();
        appDetailObj.appName = packageName;
        appDetailObj.title = jq('meta[itemprop="name"]').attr('content');
        appDetailObj.category = jq('meta[itemprop="applicationCategory"]').attr('content');
        appDetailObj.description = jq('meta[itemprop="description"]').attr('content');
        appDetailObj.PEGI = jq('meta[itemprop="contentRating"]').attr('content');
        appDetailObj.iconUrl = jq('img[class="T75of ujDFqe"]').attr('src');
        appDetailObj.screenShotUrl = jq('meta[property="og:image"]').attr('content');

        appDetailObj.checkLegality();
        return Promise.resolve(new CustomResult().withResult(appDetailObj));
    }
    async save(appDetailObj = new AppDetail()) {
        // console.log(JSON.stringify(appDetailObj));
        if (!appDetailObj || !appDetailObj instanceof AppDetail) {
            return Promise.resolve(new CustomResult().withCode(400).withMessage(`Object is undefined`));
        }
        appDetailObj.checkLegality();

        return Promise.resolve(new CustomResult());
    }
}