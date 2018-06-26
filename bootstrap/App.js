const Express = require('express');
const BodyParser = require('body-parser');
const AppRouter = require('./AppRouter');

global.Promise = require('bluebird');

const app = Express();
app.use(BodyParser.json({ limit: '10mb' }));
app.use(BodyParser.urlencoded({ extended: false }));
app.use('/api', AppRouter.apiRouters());

module.exports = app;