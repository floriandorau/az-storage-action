#!/usr/bin/env node

const { run } = require('../lib');
const { ErrorWithExitCode } = require('../lib/errors');

const package = require('../package.json');

const parseArgs = (argv)=> {
    const versionArg = argv[2];
    if(!versionArg) {
        return {};
    }

    const splittedArg = versionArg.split("=");
    return {[splittedArg[0]]: splittedArg[1]};    
}

const main = () => {
    const args = parseArgs(process.argv);
    run(args)
        .then(pr => {
            process.exitCode = 0;
        })
        .catch(e => {
            if (e instanceof ErrorWithExitCode) {
                process.exitCode = e.getExitCode();
                console.error(e);
            } else {
                process.exitCode = 11;
                console.error(e);
            }
        }).finally(() => {
            console.log(`Process exited with code: '${process.exitCode}'`);
        })
}
if (require.main === module) {
    console.info(`Running azstorage in version: '${package.version}'`);
    main();
}