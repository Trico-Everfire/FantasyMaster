const fs = require('fs')
const deepcopy = require('deepcopy');
const {NPC, Town} = require("./datainstancer");
const fantasyTownName = require('../libs/names.json')
const { uniqueNamesGenerator, names } = require('unique-names-generator');
const { createCanvas } = require('canvas');
const { NPCRegistry } = require('./registers');
const { workingDir } = require('./helpers');
const TextureLoader = require('./textureloader');
const { RACES } = require('./enums');

class TownGenerator {

    constructor() {
        this.townName = "";
    }
/**
 * 
 * @param {NPCRegistry} npcRegistry 
 * @param {TextureLoader} textureAtlas 
 * @param {boolean} itr 
 */
    async generateTown(npcRegistry, textureAtlas, itemRegistry, townRegistry) {
        let canvas = createCanvas(540, 540);
        let ctx = canvas.getContext('2d');
        ctx.font = '20px Morris Roman';
        this.townName = TownGenerator.townNameExistsCheck();
        const town = new Town(this.townName);
        const townData = town.getData();
    
        const mapIMG = textureAtlas.getPrecachedTexture("town_map").texture;
        const grassIMG = textureAtlas.getPrecachedTexture("town_icon_grass").texture;
        const mountainIMG = textureAtlas.getPrecachedTexture("town_icon_mountain").texture;
        const houseIMG = textureAtlas.getPrecachedTexture("town_icon_house").texture;
        const townhallIMG = textureAtlas.getPrecachedTexture("town_icon_hall").texture;
        
        ctx.drawImage(mapIMG, 0, 0);
        for (let i = 0; i < Math.floor(Math.random() * 200) + 70; i++) {
            let getXY = TownGenerator.getRandomXY([], 0);
            ctx.drawImage(grassIMG, getXY.x, getXY.y);
            townData.grassArray.push(getXY);
        }
    
        for (let i = 0; i < Math.floor(Math.random() * 20) + 12; i++) {
            let copyArray = [
                ...townData.houseArray,
                { type: 'townhall', x: 500 / 2, y: 500 / 2 },
            ];
            let getRandom = TownGenerator.getRandomXY(copyArray, 50);
            let x = getRandom.x;
            let y = getRandom.y;
            townData.houseArray.push({ x, y, id: i, owner: null });
        }
        
        let mountainCollision = deepcopy(townData.featureArray);
        mountainCollision.map((e) => (e.type = null));
        for (let i = 0; i < Math.floor(Math.random() * 3) + 1; i++) {
            townData.featureArray.push(
                ...TownGenerator.createMountainCluster(
                    [...townData.houseArray, ...mountainCollision],
                    'mountain'
                )
            );
        }
    
        townData.featureArray.push(...townData.featureArray);
        for (let mountains of townData.featureArray) {
            ctx.drawImage(mountainIMG, mountains.x, mountains.y);
        }
    
        for (let houses of townData.houseArray) {
            ctx.beginPath();
            let totalOffset = 10;
            ctx.moveTo(houses.x + totalOffset, houses.y + totalOffset);
            if (houses.y + totalOffset > 500 / 2 + (totalOffset + 15)) {
                ctx.lineTo(500 / 2 + (totalOffset + 15), houses.y + totalOffset);
                ctx.lineTo(500 / 2 + (totalOffset + 15), 500 / 2 + (totalOffset + 15));
            } else {
                ctx.lineTo(500 / 2, houses.y + totalOffset);
                ctx.lineTo(500 / 2, 500 / 2 + (totalOffset + 15) + 35);
                ctx.lineTo(
                    500 / 2 + (totalOffset + 15),
                    500 / 2 + (totalOffset + 15) + 35
                );
            }
    
            ctx.stroke();
        }
    
        for (let houses of townData.houseArray) {
            ctx.drawImage(houseIMG, houses.x, houses.y, 30, 30);
        }
    
        ctx.drawImage(townhallIMG, 500 / 2, 500 / 2);
        ctx.fillText(this.townName, 500 / 2 - this.townName.length, 40);
    

        let shopOwnerNPC = new NPC(
            fs.readdirSync(workingDir()+"/"+NPCRegistry.table).length,
            'shopkeeper',
            RACES.KOBOLD,
            TownGenerator.getViableNPCName(npcRegistry)
        );
        shopOwnerNPC.setShopParameters();
        shopOwnerNPC.stockShopParameter(itemRegistry);
        shopOwnerNPC.saveData(shopOwnerNPC.getData());
        townData.houseArray[
            Math.floor(Math.random() * (townData.houseArray.length - 1))
        ].owner = shopOwnerNPC.getData().ID;
        npcRegistry.NPCRegistry.push(shopOwnerNPC);
        townData.townImage = './images/towns/' + this.townName + '.png';
        town.saveData(townData);
        fs.writeFile(
            './images/towns/' + this.townName + '.png',
            canvas.toDataURL().replace(/^data:image\/png;base64,/, ''),
            'base64'
        ,async ()=>{
            await textureAtlas.precacheTexture(this.townName,workingDir()+'/images/towns/' + this.townName + '.png')
        });

        townRegistry.TownRegistry.push(town);

        return {name:this.townName, canvas};
    }

    static townNameExistsCheck(repeatAmount) {
        repeatAmount = Number.isInteger(repeatAmount) ? repeatAmount : 0;
        let random = Math.floor(Math.random() * fantasyTownName.length);
        let name = fantasyTownName[random];
        name = name.replace(' ', '_');
        let exists = fs.existsSync(name+".town");
        if (exists) {
            repeatAmount++;
            if (repeatAmount > 25) {
                //// let trico = client.users.cache.get('105357779807535104');
                //// trico.send(JSON.stringify(new Error('repeat limit exceeded!')));
                throw new Error('repeat limit exceeded!');
            }
            return TownGenerator.townNameExistsCheck(repeatAmount);
        } else {
            return name;
        }
    }

    static createMountainCluster(boundingBox1 = [], type) {
        return [...Array(Math.floor(Math.random() * 6) + 3).keys()].reduce((cluster, _) => [...cluster,TownGenerator.getRandomClusterXY([...cluster,...boundingBox1], 20, type)], []);
    }

    static getRandomXY(checkAgainst, boundingSize) {
        let x = Math.floor(Math.random() * 460) + 20;
        let y = Math.floor(Math.random() * 460) + 20;
        for (const element of checkAgainst) {
            if (!TownGenerator.isInsideBoundingBox(element, { x, y }, boundingSize)) {
                return TownGenerator.getRandomXY(checkAgainst, boundingSize);
            }
        }
        return { x, y };
    }

    static getRandomClusterXY(checkAgainst, boundingSize, type) {
        let x = Math.floor(Math.random() * 500) + 20;
        let y = Math.floor(Math.random() * 500) + 20;
    
        //checkAgainst = checkAgainst.filter(e=>e.type != 'mountain')
    
        for (const element of checkAgainst) {
            if (element.type == 'mountain') {
                if (TownGenerator.isInsideBoundingBox(element, { x, y }, boundingSize)) {
                    return TownGenerator.getRandomClusterXY(checkAgainst, boundingSize, type);
                }
            } else {
                if (!TownGenerator.isInsideBoundingBox(element, { x, y }, 30)) {
                    return TownGenerator.getRandomClusterXY(checkAgainst, boundingSize, type);
                }
            }
        }
        return { x, y ,type };
    }

    static isInsideBoundingBox(boundingBox1, boundingBox2, boundingSize) {
        let bb1x = boundingBox1.x;
        let bb1y = boundingBox1.y;
        let bb2x = boundingBox2.x;
        let bb2y = boundingBox2.y;
        return !(Math.abs(bb1x - bb2x) < boundingSize &&
            Math.abs(bb1y - bb2y) < boundingSize);
    }

/**
 * 
 * @param {Town} townc 
 * @param {TextureLoader} textureAtlas 
 */
    static async regenerateTown(townc, textureAtlas) {
        let canvas = createCanvas(540, 540);
        let ctx = canvas.getContext('2d');
        ctx.font = '20px Morris Roman';

        const town = townc.getData();

        console.log(town.houseArray);

        const mapIMG = textureAtlas.getPrecachedTexture("town_map").texture;
        const grassIMG = textureAtlas.getPrecachedTexture("town_icon_grass").texture;
        const mountainIMG = textureAtlas.getPrecachedTexture("town_icon_mountain").texture;
        const houseIMG = textureAtlas.getPrecachedTexture("town_icon_house").texture;
        const townhallIMG = textureAtlas.getPrecachedTexture("town_icon_hall").texture;

        ctx.drawImage(mapIMG, 0, 0); //draw map
        if (town.grassInfo == undefined) {  
            town.grassInfo = [];
            for (let i = 0; i < Math.floor(Math.random() * 200) + 70; i++) {
                let getXY = TownGenerator.getRandomXY([], 0);
                ctx.drawImage(grassIMG, getXY.x, getXY.y);
                town.grassInfo.push(getXY);
            }
            townc.saveData(town)
        } else {
            for (let grass of town.grassInfo) {
                ctx.drawImage(grassIMG, grass.x, grass.y);
            }
        }
    
        if (town.featureArray != undefined) {
            for (let feature of town.featureArray) {
                if (feature.type == 'mountain') {
                    ctx.drawImage(mountainIMG, feature.x, feature.y);
                }
            }
        } //redraw features if they exist.
        for (let houses of town.houseArray) {
            ctx.beginPath();
            let totalOffset = 10;
            ctx.moveTo(houses.x + totalOffset, houses.y + totalOffset);
            if (houses.y + totalOffset > 500 / 2 + (totalOffset + 15)) {
                ctx.lineTo(500 / 2 + (totalOffset + 15), houses.y + totalOffset);
                ctx.lineTo(500 / 2 + (totalOffset + 15), 500 / 2 + (totalOffset + 15));
            } else {
                ctx.lineTo(500 / 2, houses.y + totalOffset);
                ctx.lineTo(500 / 2, 500 / 2 + (totalOffset + 15) + 35);
                ctx.lineTo(
                    500 / 2 + (totalOffset + 15),
                    500 / 2 + (totalOffset + 15) + 35
                );
            }
    
            ctx.stroke();
        } //redraw paths.
        for (let houses of town.houseArray) {
            ctx.drawImage(houseIMG, houses.x, houses.y, 30, 30);
        } //redraw houses.
    
        ctx.drawImage(townhallIMG, 500 / 2, 500 / 2); //redraw townhall
        ctx.fillText(town.townName, 500 / 2 - town.townName.length, 40); //redraw name.
        fs.writeFileSync(
            town.townImage,
            canvas.toDataURL().replace(/^data:image\/png;base64,/, ''),
            'base64'
        );
        return(canvas);
    }
    /**
     * 
     * @param {NPCRegistry} npcRegistry 
     * @returns 
     */
    static getViableNPCName(npcRegistry) {
        let name = uniqueNamesGenerator({ dictionaries: [names] });
        if (fs.readdirSync(workingDir()+"/"+NPCRegistry.table).includes(name+".npc")) {
            return TownGenerator.getViableNPCName(npcRegistry);
        }
        return name;
    }
}

module.exports = TownGenerator;