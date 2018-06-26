module.exports = class CustomResult {
    constructor() {
        this.code = 0;
        this.message = '';
        this.result = null;
    }
    withCode(code = 0) {
        this.code = code;
        return this;
    }
    withMessage(message = '') {
        this.message = message;
        return this;
    }
    withResult(result = false) {
        this.result = result;
        return this;
    }
}