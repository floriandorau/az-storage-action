const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
    uploadStreamToBlockBlob
} = require("@azure/storage-blob");

const UPLOAD_CONSTANTS = {
    TIMEOUT: 30 * 60 * 1000,
    BLOCK_SIZE: 4 * 1024 * 1024,
    PARALLELISM: 20
};

const UPLOAD_OPTIONS = {
    progress: ev => console.log(ev)
}

const createServiceUrl = (account, accountKey) => {
    const credentials = new SharedKeyCredential(account, accountKey);
    const pipeline = StorageURL.newPipeline(credentials);

    return new ServiceURL(
        `https://${account}.blob.core.windows.net`,
        pipeline
    );
}

const createContainerUrl = (serviceUrl, containerName) => {
    return ContainerURL.fromServiceURL(serviceUrl, containerName);
}

const uploadBlob = (containerURL, blobName, fileStream) => {
    const blobURL = BlobURL.fromContainerURL(containerURL, blobName);
    const blockBlobURL = BlockBlobURL.fromBlobURL(blobURL);

    return uploadStreamToBlockBlob(
        Aborter.timeout(UPLOAD_CONSTANTS.TIMEOUT),
        fileStream,
        blockBlobURL,
        UPLOAD_CONSTANTS.BLOCK_SIZE,
        UPLOAD_CONSTANTS.PARALLELISM,
        UPLOAD_OPTIONS
    );
}

module.exports = { createContainerUrl, createServiceUrl, uploadBlob };