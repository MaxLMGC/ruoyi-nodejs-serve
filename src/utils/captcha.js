// 验证码文件
const svgCaptcha = require('svg-captcha');

const createCaptcha = () => {
    const captcha = svgCaptcha.create({
        size: 4,
        ignoreChars: '0o1i',
        noise: 3,
        color: true,
        background: '#cc9966'
    });
    return captcha;
};

module.exports = {
    createCaptcha
};
