const {loadImage} = require("canvas");
const { workingDir } = require("./helpers");

class TextureLoader {

    constructor(){
        this.totalTextures = 0;
        this.TextureAtlas = {};
        this.defaultTexture();
    }

    async defaultTexture() {
        this.TextureAtlas["ERROR"] = {texture:await loadImage(workingDir()+"/images/error.png"), index:-1};
    }

    /**
     * 
     * @param {snowflake} name 
     * @param {string} path 
     * @returns 
     */
    async precacheTexture(name, path) {
        if(!Object.hasOwn(this.TextureAtlas,name)){
            try {
                this.TextureAtlas[name] = {texture:await loadImage(path), index:this.totalTextures};
                this.totalTextures++;
            } catch {
                console.warn("Texture \n"+name+"\n at \n"+path+"\n could not be loaded!");
            }
            return;
        }
        console.warn("Cannot reassign texture!");
    }

    /**
     * 
     * @param {snowflake} name 
     */
    hasTexture(name) {
        return Object.hasOwn(this.TextureAtlas,name);
    }


    /**
     * 
     * @param {snowflake} name 
     * @returns {*}
     */
    getPrecachedTexture(name){
        if(Object.hasOwn(this.TextureAtlas,name))
            return this.TextureAtlas[name];
        console.warn("ERROR! "+name+" is not in Texture Atlas!");
        return this.TextureAtlas["ERROR"];
    }
}

module.exports = TextureLoader;