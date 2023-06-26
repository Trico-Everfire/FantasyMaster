const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { DiscordInstance } = require("../utils/boilerplate/Discord_Boilerplate");
const { Character, Player } = require("../utils/datainstancer");
const { RACES, RACEDESCRIPTIONS, CLASSES } = require("../utils/enums");
const { workingDir } = require("../utils/helpers");
const { TownRegistry } = require("../utils/registers");
/**
 * 
 * @param {Discord.Interaction } interaction 
 * @param {DiscordInstance} discordInstance 
 */

module.exports = async function(interaction,discordInstance){

    if (interaction.isModalSubmit() && interaction.customId === 'myModal') {
        const characterNameInput = interaction.fields.getTextInputValue('characterNameInput');
        const characterDescriptionInput = interaction.fields.getTextInputValue('characterDescriptionInput');
		

        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["name"] = characterNameInput;
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["description"] = characterDescriptionInput;
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] = 1

        const playableRaces = Object.entries(RACES).filter(([key,value])=>{
            if(key == "STARDUSTSPHINX" && interaction.user.id != "412005276745596951") return false;
            if(key != "KOBOLD") return true;
        }).map(([key,value])=>{
            //console.log(key)
            let desc = RACEDESCRIPTIONS[key]?.substring(0,100) ?? "No Description";
            return {label: value, description: desc, value:key}
        });
        //console.log(...playableRaces)
        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(...playableRaces),
        );

        await interaction.reply({ content: 'Select a Race', components: [row], ephemeral:true });
        return;
    }

    if(interaction.isSelectMenu() && interaction.customId == "select" && discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] === 1){
        

        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["race"] = interaction.values[0];

        const classObjects = Object.entries(CLASSES).map(([key,value])=>{
            return {label: value, description: value, value:key}
        });
        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(...classObjects),
        );

        interaction.update({content:"select a Class", components:[row]});
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] = 2
        return;
    }

    if(interaction.isSelectMenu() && interaction.customId == "select" && discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] === 2){
    
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["class"] = interaction.values[0];

        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions({label: "Male", description: "You are Male", value:"MALE"},
                {label: "Female", description: "You are Female", value:"FEMALE"}),
        );

        interaction.update({content:"select a gender", components:[row]});
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] = 3
        return;
    }
    
    if(interaction.isSelectMenu() && interaction.customId == "select" && discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] === 3){
        

        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["gender"] = interaction.values[0];

        const classObjects = readdirSync(workingDir()+"/"+TownRegistry.table).map(v=>v.replace(".town","")).map(value=>{
            return {label: value, description: "a town", value:value}
        });
        const row = new Discord.ActionRowBuilder()
        .addComponents(
            new Discord.SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(...classObjects),
        );

        interaction.update({content:"select a starting location", components:[row]});
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] = 4
        return;
    }

    if(interaction.isSelectMenu() && interaction.customId == "select" && discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id]["stage"] === 4){
    
        const charID = Math.round(Date.now() / 1000)
        const char = new Character(interaction.user.id,charID);
        const chardata = char.getData();
        const userData = discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id];
        chardata["location"] = interaction.values[0];
        chardata["name"] = userData["name"];
        chardata["description"] = userData["description"];
        chardata["gender"] = userData["gender"];
        chardata["race"] = userData["race"];
        chardata["class"] = userData["class"];
        char.saveData(chardata);

        let plr = new Player(interaction.user.id);
        plr.getData().characters++
        plr.saveData(plr.getData());
        delete discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id];
        await interaction.update({ content: 'Thank you for creating your character!', components: [] });
        //await interaction.reply({content: "Your character has been created!"})
        return;
    }
}