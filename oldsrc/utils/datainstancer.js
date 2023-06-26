
const { RACES, CLASSES } = require("./enums");
const {exists,load,save} = require("./utility")
// const { ItemRegistry } = require("./registers.js")
class AdvancedDataInstancer {
	/**
	 * @param {{}} Variables An object that houses all variables you want to use inside defaultData().
	 * @param {string} table (Mandatory) the folder to which to house the file (for root directory usage use "./").
	 * @param {string} fileLoc (Mandatory) the name of the file (for instance: "testFile").
	 * @param {(table:string,filelocation:string,{})=>void} save (Mandatory) The save Lambda, a function that saves the file upon being called.
	 * @param {(table:string,filelocation:string)=>{}} load (Mandatory) The load Lambda, a function that returns the saved object upon being called.
	 * @param {(table:string,filelocation:string)=>boolean} exist (Mandatory) The exist Lambda, a function that checks if the file exists and returns it's boolean.
	 */
	constructor(Variables, table, fileLoc, save, load, exist) {
		this.table = table;
		this.fileLoc = fileLoc;
		this.Variables = Variables;
		this.save = save;
		this.load = load;
		this.exist = exist;
		let exists = AdvancedDataInstancer.validInstance(
			this.table,
			this.fileLoc,
			this.exist
		);
		if (exists) {
			this.dataInstance = load(this.table, this.fileLoc);
		} else {
			this.dataInstance = this.defaultData();
			save(this.table, this.fileLoc, this.dataInstance);
		}
	}

	/**
	 *
	 * @param {string} table (Mandatory) the folder to which to house the file (for root directory usage use "./").
	 * @param {string} fileLoc (Mandatory) the name of the file (for instance: "testFile").
	 * @param {(table:string,filelocation:string)=>boolean} exist (Mandatory) The exist Lambda, a function that checks if the file exists and returns it's boolean.
	 */
	static validInstance(table, fileLoc, exist) {
		return exist(table, fileLoc);
	}

	/**
	 * @description defaultData is a method you want to overwrite whenever you extend DataInstancer, here you can house all your variables you want the saved object to have upon being created, use this.Variables to get any outside variables.
	 */
	defaultData() {
		return {};
	}

	/**
	 * @description saves the object data to file.
	 * @param {{}|null} data the data object, if left null, it will save the current instance (if you add more methods in the extended class that change this.dataInstance directly, calling saveData with null will save the instance to file.)
	 */
	saveData(data) {
		if (data == undefined) {
			this.save(this.table, this.fileLoc, this.dataInstance);
		} else {
			this.dataInstance = data;
			this.save(this.table, this.fileLoc, this.dataInstance);
		}
	}

	/**
	 * @description getData will get the dataInstance.
	 */
	getData() {
		return this.dataInstance;
	}
}

class NPC extends AdvancedDataInstancer {

	constructor(id, type, race, name) {
		super({id,race,type,name},"npcs",name+".npc",save,load,exists);
		this.name = name;
	}

	defaultData() {
		return {
			name: this.Variables.name,
			type: this.Variables.type,
			race: this.Variables.race,
			ID: this.Variables.id,
		};
	}

	addDataToNPC(key, value) {
		this.dataInstance[key] = value;
	}

	setShopParameters() {
        this.dataInstance["type"] = "shopkeeper";
		this.dataInstance["wares"] = [];
		this.dataInstance["made"] = 0;
		this.dataInstance["has"] = 2000;
	}

    /**
     * 
     * @param {ItemRegistry} itemRegistry 
     */
	stockShopParameter(itemRegistry) {
		let coreWares = [];
		for (
			let i = 0;
			i < Math.floor(Math.random() * itemRegistry.shopItems.length) + 4;
			i++
		) {
			let getItem = itemRegistry
				.shopItems[
					Math.floor(Math.random() * (itemRegistry.shopItems.length - 1)) +
						0
				];
			if (!coreWares.includes(getItem)) {
				coreWares.push(getItem);
				let bool = Math.round(Math.random() * 1) == 1;
				let nbv =
					getItem.BaseValue +
					(bool
						? Number.parseInt(getItem.BaseValue / 24)
						: -Number.parseInt(getItem.BaseValue / 24));
				getItem.BaseValue = nbv;
				getItem.Quantity = Math.floor(Math.random() * 5) + 1;
				this.dataInstance.has = Math.floor(Math.random() * 3500) + 1500;
				this.dataInstance.wares.push(getItem);
			}
		}
	}

	saveData(data) {
		if (data == undefined) {
			super.saveData(data);
		} else {
			if (data.race == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData(data);
		}
	}
}

class Town extends AdvancedDataInstancer {
	constructor(townName){
		super({townName},"properties",townName+".town",save,load,exists)
		if (townName == undefined)
			throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
		this.townName = townName;
	}

	defaultData() {
		return {
			townName: this.Variables.townName,
			houseArray: [],
			grassArray: [],
			featureArray: [],
			townImage: ""
		}
	}

	saveData(data) {
		if (data == undefined) {
			if (this.getData().townName == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData();
		} else {
			if (data.townName == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData(data);
		}
	}

}

class Character extends AdvancedDataInstancer {
	constructor(discordID,characterID){
		super({discordID,characterID},"characters",discordID+"_"+characterID+".char",save,load,exists)
		this.name = this.getData().name;
	}

	defaultData(){
		return {
			characterID: this.Variables.characterID,
			discordID: this.Variables.discordID,
			name: "",
			description: "",
			gender: null,
			image: null,
			health: 100,
			gold: 0,
			experience: 0,
			level: 0,
			location: null,
			race: RACES.HUMAN,
			class: CLASSES.DRUID,
			equipment: {
				head: null,
				neck: null,
				torso: null,
				leftring: null,
				rightring: null,
				leftwrist: null,
				rightwrist: null,
				lefthand: null,
				righthand: null,
				leggings: null,
				tailend: null,
				boots: null,
				clothing: {
					horndecoration: null,
					headwear: null,
					neckjewlery: null,
					chest: null,
					wrists: null,
					fingers: null,
					gloves: null,
					pants: null,
					taildecoration: null,
					ankles: null,
					footwear: null
				}
			},
			specialBodyParts: {
				horns: false,
				claws: false,
				tail: false,
				wings: false
			},
			languages: [],
			skills: {},
			feats: {},
			combatAbilities: {},
			currentOccupation: null,
			inventory: []
		}
	}

	saveData(data) {
		if (data == undefined) {
			if (this.getData().characterID == undefined || data.discordID == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData();
		} else {
			if (data.characterID == undefined || data.discordID == undefined)
				throw new Error("Not valid data save attempt."); //if this happens, something's wrong, to prevent corruption, we throw an error.
			super.saveData(data);
		}
	}

}

class Player extends AdvancedDataInstancer {
	constructor(discordID){
		super({discordID},"players",discordID+".plr",save,load,exists)
		this.playerCharacters = new (require("./registers")).CharacterRegistry(discordID);
	}

	defaultData() {
		return {
			user:this.Variables.discordID,
			characters: 0,
			maxCharacter: 10,
			activeCharacter: null
		}
	}

}

// const a = new NPC(0,"shopkeep","catfolk","Sarina");
// a.setShopParameters();
// a.stockShopParameter();
exports.NPC = NPC;
exports.Town = Town;
exports.Character = Character
exports.Player = Player;
