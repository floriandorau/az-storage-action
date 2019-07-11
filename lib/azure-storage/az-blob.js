const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
    uploadStreamToBlockBlob
} = require('@azure/storage-blob');

const fs = require('fs');
const path = require('path');

const UPLOAD_CONSTANTS = {
    TIMEOUT: 30 * 60 * 1000,
    BLOCK_SIZE: 4 * 1024 * 1024,
    PARALLELISM: 20
};

const UPLOAD_OPTIONS = {
    progress: ev => console.log(ev)
};

const createServiceUrl = (account, accountKey) => {
    const credentials = new SharedKeyCredential(account, accountKey);
    const pipeline = StorageURL.newPipeline(credentials);

    return new ServiceURL(
        `https://${account}.blob.core.windows.net`,
        pipeline
    );
};

exports.upload = async (file, version, { account, accountKey, containerName }) => {
    const serviceUrl = createServiceUrl(account, accountKey);
    const containerUrl = ContainerURL.fromServiceURL(serviceUrl, containerName);

    console.log(`reading upload file from '${file}'`);
    const fileStream = fs.createReadStream(file);

    const blobName = path.join(version, file);
    const blobURL = BlobURL.fromContainerURL(containerUrl, blobName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

    console.log(`uploading blob '${blobName}' to '${containerUrl.url}'`);
    await uploadStreamToBlockBlob(
        Aborter.timeout(UPLOAD_CONSTANTS.TIMEOUT),
        fileStream,
        blockBlobURL,
        UPLOAD_CONSTANTS.BLOCK_SIZE,
        UPLOAD_CONSTANTS.PARALLELISM,
        UPLOAD_OPTIONS
    );
    console.log(`blob '${blobName}' uploaded to '${containerUrl.url}'`);
};