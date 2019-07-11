const azBlob = require('./az-blob');
const azFile = require('./az-file');

const upload = async (type = 'blob', file, version, options) => {
    if (type === 'blob') {
        return azBlob.upload(file, version, options);
    } else if (type === 'file') {
        return azFile.upload(file, version, options);
    } 

    throw new Error('invalid type: ' + type + '. epected blob or file');
};

module.exports = { upload };