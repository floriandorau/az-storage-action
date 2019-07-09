const fs = require('fs');
const path = require('path');

const env = require('./env');
const { Failure } = require('./errors');
const azureStorage = require('./azure-storage');

const extractStorageOptions = () => {
    return {
        account: env.extractRequiredVar('AZ_STORAGE_ACCOUNT'),
        accountKey: env.extractRequiredVar('AZ_STORAGE_TOKEN'),
        containerName: env.extractRequiredVar('AZ_STORAGE_CONTAINER'),
        file: {
            path: env.extractRequiredVar('FILE_PATH'),
            name: env.extractRequiredVar('FILE_NAME'),
            ext: env.extractRequiredVar('FILE_EXT'),
        },
        workspace: env.extractRequiredVar('GITHUB_WORKSPACE')
    }
};

const run = async ({ version }) => {
    if (!version || version.length === 0) {
        throw new Failure("version is missing");
    }
    
    const options = extractStorageOptions();

    const serviceUrl = azureStorage.createServiceUrl(options.account, options.accountKey);
    const containerUrl = azureStorage.createContainerUrl(serviceUrl, options.containerName);
    const fileName = `${options.file.name} ${version}.${options.file.ext}`;
    const file = path.join(path.join(options.workspace, options.file.path, fileName))
    console.log(`reading upload file from '${file}'`);
    const fileStream = fs.createReadStream(file);

    try {
        const blobName = path.join(version, `${options.file.name}.${options.file.ext}`);
        console.log(`uploading blob '${blobName}' to '${containerUrl.url}'`);
        await azureStorage.uploadBlob(containerUrl, blobName, fileStream);
        console.log(`upload successful`);
    } catch (err) {
        console.error('error while uploading file', err);
    }
};

module.exports = { run };