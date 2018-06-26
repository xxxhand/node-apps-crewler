const Request = require('request');
const CustomResult = require('./CustomResult');

exports.sleep = function (mills) {
    return new Promise((res) => {
        setTimeout(() => {
            res();
        }, mills);
    });
}
exports.tryGet = function (options) {
    return new Promise((res, rej) => {
        const opt = {
            url: options.url,
            method: 'GET'
        };
        Request(opt, (err, response, body) => {
            if (err) {
                return res(new CustomResult().withCode(500).withMessage(err.message));
            }
            res(new CustomResult().withResult(body));
        });
    });
}