class ErrorWithExitCode extends Error {
    constructor(exitCode, ...args) {
        super(args);
        this.exitCode = exitCode;
    }

    getExitCode() {
        return this.exitCode;
    }
}

class Failure extends ErrorWithExitCode {
    constructor(...args) {
        super(1, args);
    }
}

const isDefined = (value, msg) => {
    if (!value || value.length === 0) throw new Failure(msg);
};

const extractRequiredVar = (name) => {
    const value = process.env[name];
    if (!value || !value.length) {
        throw new Failure(`required env variable '${name}' not defined`);
    }

    return value;
};

module.exports = { isDefined, extractRequiredVar };