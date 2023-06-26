const fs = require("fs");
const {Item,Consumable,Job,Spell,Weapon, Wearable} = require("./definitions");
const { workingDir } = require("./helpers");
const {NPC, Town, Character} = require("./datainstancer");

class Registry {
	constructor(identifier) {
        this.identifier = undefined;
		this.Registry = {};
		identifier == undefined
			? (this.identifier = "ID")
			: (this.identifier = identifier);
		Object.defineProperty(this, "length", {
			get: function () {
				let size = 0,
					key;
				for (key in this.Registry) {
					if (this.Registry.hasOwnProperty(key)) size++;
				}
				return size;
			},
		});
	}
/**
 * 
 * @param {any} num 
 * @returns 
 */
	get(num) {
		return this.Registry[num];
	}

	push(Item) {
		this.Registry[Item[this.identifier]] = Item;
	}

	getRegistry() {
		return this.Registry;
	}
}

class JobRegistry {

	constructor() {
		this.JobRegistry = new Registry("name");
		this.init();
	}

	init() {
		this.registerJob(
			new Job(
				"coalmine",
				0.0,
				20,
				6,
				"you are now working in the coal mines.",
				(Skills) => true
			)
		);
		this.registerJob(
			new Job(
				"woodcutter",
				0.12,
				50,
				8,
				"you are now working in the forest, chopping down trees.",
				(Skills) => Skills.jobExperience >= 1
			)
		);
		this.registerJob(
			new Job(
				"housemaid",
				0.26,
				100,
				12,
				"you are now working as a housemaid, going from house to house.",
				(Skills) => Skills.jobExperience >= 2
			)
		);
		this.registerJob(
			new Job(
				"hunter",
				0.4,
				300,
				16,
				"you are now working in the forest, hunting deer and elk for their hide and flesh.",
				(Skills) =>
					Skills.jobExperience >= 4 &&
					Skills.animalExperience >= 2 &&
					Skills.agility >= 1
			)
		);
		this.registerJob(
			new Job(
				"guard",
				0.45,
				400,
				20,
				"you stand guard for a local shop owner.",
				(Skills) => Skills.jobExperience >= 5 && Skills.strength == 4
			)
		);
		this.registerJob(
			new Job(
				"farmgryphons",
				0.8,
				700,
				30,
				"you are feeding the younger gryphons and readying the adults for sale.",
				(Skills) => Skills.animalExperience >= 6 && Skills.jobExperience >= 5
			)
		);
	}
	/**
	 *
	 * @param {Job} job
	 */
	registerJob(job) {
		this.JobRegistry.push(job);
	}
	/**
	 * @returns {Registry}
	 */

	getRegistry() {
		return this.JobRegistry;
	}
}

class ItemRegistry {
	constructor() {
		this.ItemRegistry = new Registry();
		this.init();
		this.shopItems = [];
		this.shopItems.push(this.getRegistry().get("item_iron_ingot"));
		this.shopItems.push(this.getRegistry().get("item_silver_ingot"));
		this.shopItems.push(this.getRegistry().get("item_gemstone_emerald"));
		this.shopItems.push(this.getRegistry().get("item_gemstone_diamond"));
		this.shopItems.push(this.getRegistry().get("item_weapon_sword"));
		this.shopItems.push(this.getRegistry().get("item_weapon_long_sword"));
		this.shopItems.push(this.getRegistry().get("item_weapon_bow"));
		this.shopItems.push(this.getRegistry().get("item_potion_healing"));
		this.shopItems.push(this.getRegistry().get("item_potion_stamina"));
	}

	init() {
		this.registerItem("item_iron_ingot","Iron Ingot", 50);
		this.registerItem("item_silver_ingot","Silver Ingot", 175);
		this.registerItem("item_gold_ingot","Gold Ingot", 100);
		this.registerItem("item_gemstone_diamond","Diamond", 200);
		this.registerItem("item_gemstone_emerald","Emerald", 225);
		this.registerWeapon("item_weapon_sword","Sword", 100, 50, 1.0, 175);
		this.registerWeapon("item_weapon_long_sword","Long Sword", 150, 100, 1.5, 120);
		this.registerWeapon("item_weapon_spear","Spear", 110, 70, 2.0, 100);
		this.registerWeapon("item_weapon_bow","Bow", 230, 110, 6, 180);
		this.registerConsumable("item_potion_healing","Potion of Healing", 50, 120, 0);
		this.registerConsumable("item_potion_stamina","Potion of Stamina", 50, 0, 120);
		this.registerConsumable("item_food_apple","Apple", 10, 40, 50);
		this.registerConsumable("item_food_bread","Bread", 20, 50, 60);
		this.registerConsumable("item_food_steak","Steak", 50, 70, 65);
		this.registerSpell("item_spell_healing","Healing", 100, 0, 1);
		this.registerSpell("item_spell_fire_ball","Fire Ball", 120, 10, 1);
		this.registerSpell("item_spell_fire_storm","Fire Storm", 120, 10, 1);
		this.registerSpell("item_spell_ice_blast","Ice Blast", 120, 10, 1);
		this.registerSpell("item_spell_ice_storm","Ice Storm", 120, 10, 1);
		this.registerSpell("item_spell_lightning_strike","Lightning Strike", 120, 10, 1);
		this.registerSpell("item_spell_lightning_storm","Lightning Storm", 120, 10, 1);
		this.registerClothing("item_clothing_cloth_shirt","Cloth Shirt", 1, "chest")
	}

	registerItem(id, name, value) {
		this.ItemRegistry.push(new Item(id, name, value));
	}
	registerWeapon(id, name, value, Damage, Range, Durability) {
		this.ItemRegistry.push(
			new Weapon(
				id,
				name,
				value,
				Damage,
				Range,
				Durability
			)
		);
	}
	registerConsumable(id, name, value, HP, AP) {
		this.ItemRegistry.push(
			new Consumable(id, name, value, HP, AP)
		);
	}
	registerSpell(id, name, value, range, scope) {
		this.ItemRegistry.push(
			new Spell(id, name, value, range, scope)
		);
	}
	registerClothing(id, name,value,slot) {
		this.ItemRegistry.push(
			new Wearable(id, name, value, slot)
		);
	}

	getRegistry() {
		return this.ItemRegistry;
	}
}

class NPCRegistry {
	constructor() {
		this.NPCRegistry = new Registry("name");
        this.init();
	}

	static table = "npcs";

	init() {
		let NPCNames = fs.readdirSync(workingDir()+"/"+NPCRegistry.table)
        NPCNames = NPCNames.filter(value=>value.endsWith(".npc"));
		for (let npc of NPCNames) {
			const npcData = JSON.parse(fs.readFileSync(workingDir()+"/"+NPCRegistry.table+"/"+npc));
            const npcObject = new NPC(npcData.ID,null,null,npcData.name); //we can get away with this, because that's how NPCs get their file.
			this.NPCRegistry.push(npcObject);
		}
	}

	getFromID(id){
		for(const [key,item] of Object.entries(this.NPCRegistry.getRegistry())){
			if(item.getData().ID == id) return item.getData();
		}
		return null;
	}
}

class TownRegistry {
	constructor() {
		this.TownRegistry = new Registry("townName");
		this.init();
	}

	static table = "properties";

	init() {
		let townNames = fs.readdirSync(workingDir()+"/"+TownRegistry.table)
        townNames = townNames.filter(value=>value.endsWith(".town"));
		for (let town of townNames) {
			const townData = JSON.parse(fs.readFileSync(workingDir()+"/"+TownRegistry.table+"/"+town));
			if(townData.townName == undefined){
				console.log(town)
				continue;
			};
			const townObject = new Town(townData.townName);
			this.TownRegistry.push(townObject);
		}
	}
}

class CharacterRegistry {
	/**
	 * @param {string} userID 
	 */
	constructor(userID) {
		this.CharacterRegistry = new Registry("name");
		this.init(userID);
	}

	static table = "characters"
	/**
	 * @param {string} userID 
	 */
	init(userID){
		const characters = fs.readdirSync(workingDir()+"/"+CharacterRegistry.table).filter(val=>val.startsWith(userID))
		for(const character of characters){
			const characterData = JSON.parse(fs.readFileSync(workingDir()+"/"+CharacterRegistry.table+"/"+character));
			if(characterData.discordID != userID || characterData.characterID == undefined){
				console.log(character)
				continue;
			}
			const characterObject = new Character(characterData.discordID,characterData.characterID);
			console.log(characterObject)
			this.CharacterRegistry.push(characterObject);
		}
	}
}

exports.JobRegistry = JobRegistry;
exports.ItemRegistry = ItemRegistry;
exports.NPCRegistry = NPCRegistry;
exports.TownRegistry = TownRegistry;
exports.CharacterRegistry = CharacterRegistry;
