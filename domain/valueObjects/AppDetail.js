module.exports = class AppDetail {
    constructor() {
        this.PEGI = '';
        this.appName = '';
        this.category = '';
        this.description = '';
        this.iconUrl = '';
        this.screenShotUrl = '';
        this.title = '';
    }
    checkLegality() {
        const props = Object.keys(this);
        for (const prop of props) {
            if (!this[prop] || this[prop].length === 0) {
                throw new Error(`${prop} is empty`);
            }
        }
    }
}