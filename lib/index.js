const azureStorage = require('./azure-storage');
const {
    isDefined,
    extractRequiredVar
} = require('./utils');

const extractStorageOptions = () => {
    return {
        account: extractRequiredVar('AZ_STORAGE_ACCOUNT'),
        accountKey: extractRequiredVar('AZ_STORAGE_TOKEN'),
        containerName: extractRequiredVar('AZ_STORAGE_CONTAINER')
    }
};

const run = async ({ uploadType, version, file }) => {
    isDefined(file, "file is missing");
    isDefined(version, "version is missing");
    isDefined(uploadType, "uploadType is missing");

    try {
        console.log(`uploading '${uploadType}' '${file}' with version ${version}`);
        await azureStorage.upload(uploadType, file, version, extractStorageOptions());
    } catch (err) {
        console.error(`error while uploading file ${file}`, err);
    }
};

module.exports = { run };