const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { DiscordInstance } = require("../utils/boilerplate/Discord_Boilerplate");
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
    if(interaction.user.id !== "105357779807535104") return interaction.reply("You do not have permission to generate towns.")
    await interaction.deferReply();

    const npcRegistry = discordInstance.fetchFromCache("npcRegistry")();
    const townRegistry = discordInstance.fetchFromCache("townRegistry")();
    const itemRegistry = discordInstance.fetchFromCache("itemRegistry")();
    const textureAtlas = discordInstance.fetchFromCache("textureAtlas")();

    if(interaction.options.getSubcommand() === "generate_town"){
        const townGenerator = new TownGenerator();
        townGenerator.generateTown(npcRegistry, textureAtlas, itemRegistry,townRegistry).then(obj=>{
            const attachment = new Discord.AttachmentBuilder();
            attachment.setFile((obj.canvas.toBuffer()));
            attachment.setName(obj.name+".png");
            interaction.editReply({files:[attachment]});
        });
    }

    if(interaction.options.getSubcommand() === "regenerate_town_map"){
        const townName = interaction.options.getString("town");

        if(townName == "") {
            interaction.editReply("This town does not exist.");
            return;
        }
        const townRegistry = discordInstance.fetchFromCache("townRegistry")().TownRegistry;
        const currentTown = townRegistry.get(townName)
        if(currentTown == undefined){
            interaction.editReply("This town does not exist2.");
            return;
        }

        TownGenerator.regenerateTown(currentTown,textureAtlas).then(canvas=>{
            const attachment = new Discord.AttachmentBuilder();
            attachment.setFile((canvas.toBuffer()));
            attachment.setName(townName+".png");
            interaction.editReply({files:[attachment]});
        });
    }

    if(interaction.options.getSubcommand() === "regenerate_all_town_maps"){


        let towns = readdirSync(workingDir()+"/"+TownRegistry.table).map(v=>v.replace(".town",""))
            
        for(const townName of towns){
            const townRegistry = discordInstance.fetchFromCache("townRegistry")().TownRegistry;
            const currentTown = townRegistry.get(townName)
            if(currentTown == undefined){
                interaction.editReply("town "+townName+" does not exist.");
            }
            TownGenerator.regenerateTown(currentTown,textureAtlas);
        }
        interaction.editReply("All towns regenerated.");
    }

    
}