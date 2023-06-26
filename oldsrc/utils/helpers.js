
function workingDir(){
    return __dirname + "/..";
}

/**
 * 
 * @param {string} relativePath 
 * @returns {string}
 */
function fromCurrentDir(relativePath) {
    return workingDir() + relativePath;
}

module.exports = {workingDir,fromCurrentDir}