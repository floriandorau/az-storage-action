const azBlob = require('./az-blob');
const azFile = require('./az-file');

const upload = async (uploadType = 'blob', file, version, options) => {
    if (uploadType === 'blob') {
        return azBlob.upload(file, version, options);
    } else if (uploadType === 'file') {
        return azFile.upload(file, version, options);
    } 

    throw new Error('invalid type: ' + uploadType + '. epected blob or file');
};

module.exports = { upload };