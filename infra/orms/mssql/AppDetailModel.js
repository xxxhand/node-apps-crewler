const Sequelize = require('sequelize');
const DBInstance = require('./../../../shared/CustomDatabase').LakeDBInstance;

exports.AppDetailModel = class {
    constructor() {
        this.PEGI = '';
        this.app_name = '';
        this.category = '';
        this.description = '';
        this.icon_url = '';
        this.screenshot_url = '';
        this.title = '';
    }
}
exports.AppDetailSequelize = DBInstance.define('AppDetailModel', {
    id: { type: Sequelize.STRING, primaryKey: true, autoIncrement: true },
    PEGI: Sequelize.STRING,
    app_name: Sequelize.STRING,
    category: Sequelize.STRING,
    description: Sequelize.STRING,
    icon_url: Sequelize.STRING,
    screenshot_url: Sequelize.STRING,
    title: Sequelize.STRING
}, { tableName: 'apps_details', timestamps: false });
