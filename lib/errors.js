
class ErrorWithExitCode extends Error {
    constructor(exitCode, ...args) {
        super(args);
        this.exitCode = exitCode;
    }

    getExitCode() {
        return this.exitCode;
    }
};

class Neutral extends ErrorWithExitCode { 
    constructor(... args) {
        super(78, args);
    }
};

class Failure extends ErrorWithExitCode { 
    constructor(... args) {
        super(1, args);
    }
};

class HttpClientError extends Failure {
    constructor(data) {
        super();
        Object.assign(this, data);
        Error.captureStackTrace(this, HttpClientError);
    }

    toString() {            
        return JSON.stringify(this, null, 2);
    }
};

module.exports = { ErrorWithExitCode, Neutral, Failure, HttpClientError }