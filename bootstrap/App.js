global.Promise = require('bluebird');
const Express = require('express');
const BodyParser = require('body-parser');
const CustomDatabase = require('./../shared/CustomDatabase');
const CustomLogger = require('./../shared/CustomLogger');

CustomLogger.InitialLogger();
CustomDatabase.TryConnectLake(0);

const AppRouter = require('./AppRouter');
const app = Express();
app.use(BodyParser.json({ limit: '10mb' }));
app.use(BodyParser.urlencoded({ extended: false }));
app.use('/api', AppRouter.apiRouters());

module.exports = app;