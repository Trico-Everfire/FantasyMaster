const { TextInputStyle } = require("discord.js");
const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { DiscordInstance } = require("../utils/boilerplate/Discord_Boilerplate");
const { Player } = require("../utils/datainstancer");
const { workingDir } = require("../utils/helpers");
const { TownRegistry } = require("../utils/registers");
const TownGenerator = require("../utils/towngenerator");
/**
 * 
 * @param {Discord.CommandInteraction} interaction 
 * @param {DiscordInstance} discordInstance 
 */

module.exports = async function(interaction,discordInstance){
    if (!interaction.isCommand()) return;

    let plr = new Player(interaction.user.id);

    if(interaction.options.getSubcommand() === "create"){
        if(plr.getData().characters >= plr.getData().maxCharacter) return interaction.reply("You already have the max amount of characters")
        const modal = new Discord.ModalBuilder()
        .setCustomId('myModal')
        .setTitle('Create your character!');
    
        const characterNameInput = new Discord.TextInputBuilder()
        .setCustomId('characterNameInput')
        .setMinLength(3)
        .setMaxLength(28)
        // The label is the prompt the user sees for this input
        .setLabel("What's your character's name")
        // Short means only a single line of text
        .setStyle(TextInputStyle.Short);
    
        const firstActionRow = new Discord.ActionRowBuilder().addComponents(characterNameInput);
    
        const characterDescriptionInput = new Discord.TextInputBuilder()
        .setCustomId('characterDescriptionInput')
        .setLabel("A short description of your character.")
        .setMaxLength(255)
        // Paragraph means multiple lines of text.
        .setStyle(TextInputStyle.Paragraph);
    
        const secondActionRow = new Discord.ActionRowBuilder().addComponents(characterDescriptionInput);
    
        modal.addComponents(firstActionRow, secondActionRow);
    
        await interaction.showModal(modal);
        discordInstance.fetchFromCache("characterCreationCache")[interaction.user.id] = {stage:0, name:"", description: "", race: null, gender: null, class: null, location: null};
    }

    if(interaction.options.getSubcommand() === "list") {
        if(plr.playerCharacters.CharacterRegistry.getRegistry().length == 0) return interaction.reply("You don't have any characters")
        
        let characterIterator = Object.entries(plr.playerCharacters.CharacterRegistry.getRegistry()).map(([key,characterI])=>{
           const character = characterI.getData();
            return {name:key, value: `
            ID: ${character.characterID}
            Character: ${character.name}
            Description: ${character.description}
            Class: ${character.class}
            Race: ${character.race}
            Gender:  ${character.gender}
            Gold:  ${character.gold}
            `}
        });
        
        const exampleEmbed = new Discord.EmbedBuilder()
        .setTitle("Your Characters")
        .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
        .setDescription('This shows you all your characters in a list.')
        .addFields(...characterIterator)

        interaction.reply({embeds:[exampleEmbed]})
    }
}