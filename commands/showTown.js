const Discord = require("discord.js");
const { existsSync, readFileSync, readdirSync } = require("fs");
const { DiscordInstance } = require("../utils/boilerplate/Discord_Boilerplate");
const { Town } = require("../utils/datainstancer");
const { workingDir } = require("../utils/helpers");
const { TownRegistry } = require("../utils/registers");
const TownGenerator = require("../utils/towngenerator");
const buyProperty = require("./buyProperty");
/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {DiscordInstance} discordInstance 
 */

module.exports = async function(interaction,discordInstance){
    if (!interaction.isCommand()) return;
    await interaction.deferReply();
    if(interaction.options.getSubcommand() === "show"){
            const townName = interaction.options.getString("town");

            if(townName == "") {
                interaction.editReply("This town does not exist.");
                return;
            }
            const townRegistry = discordInstance.fetchFromCache("townRegistry")().TownRegistry;
            const currentTown = townRegistry.get(townName)
            if(currentTown == undefined){
                interaction.editReply("This town does not exist.");
                return;
            }

            const attachment = new Discord.AttachmentBuilder();
            attachment.setFile(readFileSync(__dirname+"/."+currentTown.getData().townImage));
            attachment.setName(townName+".png")
            interaction.editReply({files:[attachment]});
    }
    if(interaction.options.getSubcommand() === "list"){
        let towns = readdirSync(workingDir()+"/"+TownRegistry.table).map(v=>v.replace(".town",""))
        interaction.editReply(towns.join("\n"));
    }
    buyProperty(interaction,discordInstance);
}