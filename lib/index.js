const env = require('./env');
const { Failure } = require('./errors');
const azureStorage = require('./azure-storage');

const extractStorageOptions = () => {
    return {
        account: env.extractRequiredVar('AZ_STORAGE_ACCOUNT'),
        accountKey: env.extractRequiredVar('AZ_STORAGE_TOKEN'),
        containerName: env.extractRequiredVar('AZ_STORAGE_CONTAINER')
    }
};

const run = async ({ type, version, file }) => {
    if (!type || type.length === 0) {
        throw new Failure("type is missing");
    }

    if (!version || version.length === 0) {
        throw new Failure("version is missing");
    }

    if (!file || file.length === 0) {
        throw new Failure("version is missing");
    }
    
    try {
        console.log(`uploading '${type}' '${file}' with version ${version}`);
        const options = extractStorageOptions();
        await azureStorage.upload(type, file, version, options);
    } catch(err) {
        console.error(`error while uploading file ${file}`, err);
    }
};

module.exports = { run };