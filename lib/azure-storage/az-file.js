const {
    Aborter,
    FileURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
    ShareURL,
    uploadStreamToAzureFile
} = require('@azure/storage-file');

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
        `https://${account}.file.core.windows.net`,
        pipeline
    );
};

const createShareUrl = async (serviceUrl, shareName) => {
    const shareUrl = ShareURL.fromServiceURL(serviceUrl, shareName);
    return await shareUrl.create(Aborter.none);
};

const createTargetFileName = (file) => {
    const fileParts = path.parse(file);
    return `${fileParts.name}${fileParts.ext}`;
};

const uploadFile = (directory, file) => {
    const fileStats = fs.statSync(file);
    const fileStream = fs.createReadStream(file);

    const fileName = createTargetFileName(file);
    const fileURL = FileURL.fromDirectoryURL(directory, `${fileName}`);

    console.log(`uploading file to '${fileURL.url}'`);
    return uploadStreamToAzureFile(
        Aborter.timeout(UPLOAD_CONSTANTS.TIMEOUT),
        fileStream,
        fileStats.size,
        fileURL,
        UPLOAD_CONSTANTS.BLOCK_SIZE,
        UPLOAD_CONSTANTS.PARALLELISM,
        UPLOAD_OPTIONS
    );
};


const listShares = async (serviceUrl, marker) => {
    return serviceUrl.listSharesSegment(
        Aborter.none,
        marker
    );
};

const findShare = async (serviceUrl, shareName) => {
    let marker;
    do {
        const listSharesResponse = await listShares(serviceUrl, marker);
        marker = listSharesResponse.nextMarker;
        for (const share of listSharesResponse.shareItems) {
            if (share.name === shareName) {
                return ShareURL.fromServiceURL(serviceUrl, shareName);
            }
        }
    } while (marker);

    return null;
};

exports.upload = async (file, version, { account, accountKey, containerName }) => {
    const serviceUrl = createServiceUrl(account, accountKey);

    let share = await findShare(serviceUrl, containerName);
    if (!share) {
        console.log(`Creating new share '${containerName}'`);
        share = await createShareUrl(serviceUrl, containerName);
    } else {
        console.log(`Share ${share.url} already exists`);
    }

    console.log(`reading upload file from '${file}'`);
    await uploadFile(share, file);
    console.log(`successfully uploaded to '${share.url}'`);
};