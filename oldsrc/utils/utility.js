const fs = require("fs");

function save(table, fileLoc, data){
    fs.writeFileSync(table+"/"+fileLoc,JSON.stringify(data));
}

function load(table, fileLoc){
   return JSON.parse(fs.readFileSync(table+"/"+fileLoc));
}

function exists(table, fileLoc){
    return fs.existsSync(table+"/"+fileLoc);
}

module.exports = {save,load,exists}