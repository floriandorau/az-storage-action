const process = require("process");

const { Failure } = require('./errors');

const extractVar = (name, defaultValue) => {
    let value = process.env[name];
    if (!value || !value.length) {
        value = defaultValue;
    }
    return value;
};

const extractRequiredVar = (name) => {
    const value = process.env[name];
    if (!value || !value.length) {
        throw new Failure(`required env variable '${name}' not defined`);
    }

    return value;
};

module.exports = { extractVar, extractRequiredVar };