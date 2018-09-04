const CheerIO = require('cheerio');
const CustomResult = require('./../../shared/CustomResult');
const CustomHttpGet = require('./../../shared/CustomFuncs').tryGet;
const AppDetail = require('./../../domain/valueObjects').AppDetail;
const AppDetailSequelize = require('./../../infra/orms/mssql').AppDetailSequelize;
const AppDetailModel = require('./../../infra/orms/mssql').AppDetailModel;
const AppLogger = require('./../../shared/CustomLogger').AppLogger();
// const metaTagReg = /<meta(?:>|\s+([\s\S]*?)>)/ig;
const errorReg = /<div\sid=\"error-section\"/ig;

module.exports = class AppDetailRepository {

    async queryDetail(packageName = '') {
        AppLogger.info(`Find package ${packageName}`);
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

        return Promise.resolve(new CustomResult().withResult(appDetailObj));
    }
    async save(appDetailObj = new AppDetail()) {
        if (!appDetailObj || !appDetailObj instanceof AppDetail) {
            return Promise.resolve(new CustomResult().withCode(400).withMessage(`Object is undefined`));
        }
        try {
            appDetailObj.checkLegality();
        } catch (ex) {
            return Promise.resolve(new CustomResult().withCode(400).withMessage(ex.message));
        }
        
        let appDetailSequelize = await AppDetailSequelize.findOne({ where: { app_name: appDetailObj.appName } });
        if (!appDetailSequelize) {
            const appDetailModel = new AppDetailModel();
            appDetailModel.app_name = appDetailObj.appName;
            appDetailModel.category = appDetailObj.category;
            appDetailModel.description = appDetailObj.description;
            appDetailModel.icon_url = appDetailObj.iconUrl;
            appDetailModel.PEGI = appDetailObj.PEGI;
            appDetailModel.screenshot_url = appDetailObj.screenShotUrl;
            appDetailModel.title = appDetailObj.title;
            appDetailSequelize = AppDetailSequelize.build(appDetailModel);
        } else {
            appDetailSequelize.description = appDetailObj.description;
            appDetailSequelize.icon_url = appDetailObj.iconUrl;
            appDetailSequelize.screenshot_url = appDetailObj.screenShotUrl;
        }

        await appDetailSequelize.save();

        return Promise.resolve(new CustomResult().withResult(appDetailObj));
    }
}