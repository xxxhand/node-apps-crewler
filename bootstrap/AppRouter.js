const Router = require('express').Router;
const Applications = require('./../applications');


exports.apiRouters = function () {
    const apiRouter = Router();
    
    apiRouter.post('/apps/google', Applications.AppDetailApplication.findDetail);


    return apiRouter;
}