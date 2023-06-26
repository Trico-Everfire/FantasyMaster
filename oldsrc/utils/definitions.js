class Item {
	constructor(id, name, value) {
		this.ID = id;
		this.Name = name;
		this.Type = "item";
		this.BaseValue = value;
	}
	getID() {
		return this.ID;
	}

	getName() {
		return this.Name;
	}

	setName(name) {
		this.Name = name;
	}

	getBaseValue() {
		return this.BaseValue;
	}

	setBaseValue(value) {
		this.BaseValue = value;
	}
}

class Weapon extends Item {
	constructor(id, name, value, damage, range, durability) {
		super(id, name, value);
		this.Type = "weapon";
		this.Damage = damage;
		this.Range = range;
		this.Durability = durability;
		this.Enchantments = [];
	}

	getDamage() {
		return this.Damage;
	}

	setDamage(damage) {
		this.Damage = damage;
	}

	getRange() {
		return this.Range;
	}

	setRange(range) {
		this.Range = range;
	}

	getDurability() {
		return this.Durability;
	}

	setDurability(durability) {
		this.Durability = durability;
	}

	getEnchantments() {
		return this.Enchantments;
	}

	setEnchantments(enchantments) {
		this.Enchantments = enchantments;
	}

	addEnchantment(enchantment) {
		this.Enchantments.push(enchantment);
	}
}

class Consumable extends Item {
	constructor(id, name, value, HP, AP) {
		super(id, name, value);
		this.Type = "consumable";
		this.HP = HP;
		this.AP = AP;
		this.Effects = [];
	}

	getHP() {
		return this.HP;
	}

	setHP(hp) {
		this.HP = hp;
	}

	getAP() {
		return this.AP;
	}

	setHP(ap) {
		this.AP = ap;
	}

	getEffects() {
		return this.Effects;
	}

	setEffects(effects) {
		this.Effects = effects;
	}

	addEffect(effect) {
		this.Effects.push(effect);
	}
}

class Spell extends Item {
	constructor(id, name, value, range, scope) {
		super(id, name, value);
		this.Type = "spell";
		this.range = range;
		this.scope = scope;
	}

	getRange() {
		return this.range;
	}

	getScope() {
		return this.scope;
	}
}

class Wearable extends Item {
	constructor(id, name, value, slot) {
		super(id,name, value);
		this.Type = "wearable";
		this.Slot = slot;
		this.Enchantments = [];
	}

	getEnchantments() {
		return this.Enchantments;
	}

	setEnchantments(enchantments) {
		this.Enchantments = enchantments;
	}

	addEnchantment(enchantment) {
		this.Enchantments.push(enchantment);
	}
}

class Armor extends Wearable {

	constructor(id, name, value, slot, armorrating, material) {
		super(id,name, value, slot);
		this.ArmorRating = armorrating;
		this.ArmorMaterial = material;
	}

}

class Job {
	/**
     * @param {string} name
     * @param {Number} complexity
     * @param {Number} earnable
     * @param {Number} minutes
     * @param {string} description
     * @param {({}:{
        jobExperience: Number,
        animalExperience:Number,
        strength:Number,
        agility:Number,
        gryphonStartupPaid:boolean
        })=>boolean} skillPredicate
     */
	constructor(
		name,
		complexity,
		earnable,
		minutes,
		description,
		skillPredicate
	) {
		this.name = name;
		this.complexity = complexity;
		this.earnable = earnable;
		this.minutes = minutes;
		this.description = description;
		this.skillPredicate = skillPredicate;
	}

	/**
	 *
	 * @param {Player} player
	 * @param {Discord.Message} message
	 */

	runJobConfiguration(player, message) {
		let usableData = player.getData();
		let thisDate = new Date();
		//  console.log(usableData)
		if (this.name != undefined) {
			if (
				!usableData.data.isWorking &&
				this.skillPredicate(usableData.data.Skills)
			) {
				// usableData.data.jobSkills[this.name] == undefined
				// 	? (usableData.data.jobSkills[this.name] = 1)
				// 	: null;
				usableData.data.isWorking = true;
				usableData.data.jobs.push({
					jobtype: this.name,
					complexity: this.complexity,
					getworkAmount: Number.parseFloat(
						toFixed(this.earnable * usableData.data.jobSkills[this.name], 2)
					),
					workEfficiency: Number.parseFloat(
						(
							Math.random() *
								(0.5 + this.complexity - (0.15 + this.complexity)) +
							0.15
						).toFixed(2)
					),
					whenWorkDone: thisDate.getTime() + this.minutes * 60 * 1000,
				});
				player.saveData(usableData);
				sendMessage(message, 
					this.description + "\n worktime: " + this.minutes + " minutes."
				);
			} else if (this.skillPredicate(usableData.data.Skills)) {
				sendMessage(message, "you are already working.");
			} else {
				sendMessage(message, "you lack the required skill(s)");
			}
		}
	}
}

module.exports = {Item, Weapon, Consumable, Spell, Wearable, Armor, Job}