const fs = require('fs');
const path = require('path');

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

const run = async ({ version, file }) => {
    if (!version || version.length === 0) {
        throw new Failure("version is missing");
    }
    
    const options = extractStorageOptions();

    const serviceUrl = azureStorage.createServiceUrl(options.account, options.accountKey);
    const containerUrl = azureStorage.createContainerUrl(serviceUrl, options.containerName);
    
    console.log(`reading upload file from '${file}'`);
    const fileStream = fs.createReadStream(file);

    try {
        const blobName = path.join(version, file);
        console.log(`uploading blob '${blobName}' to '${containerUrl.url}'`);
        await azureStorage.uploadBlob(containerUrl, blobName, fileStream);
        console.log(`upload successful`);
    } catch (err) {
        console.error('error while uploading file', err);
    }
};

module.exports = { run };