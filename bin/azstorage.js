#!/usr/bin/env node

const { run } = require('../lib');
const { ErrorWithExitCode } = require('../lib/errors');

const package = require('../package.json');

const parseArgs = (argv)=> {
    const [node, programm, ...args] = argv;
    console.log(node, programm, args)
    if(!args) {
        console.log('no args specified')
        return {};
    }

    const options = {};
    args.forEach(arg => {
        const splittedArg = arg.split("=");
        options[splittedArg[0]]=splittedArg[1];
    });

    return options; 
}

const main = () => {
    const options = parseArgs(process.argv);
    run(options)
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