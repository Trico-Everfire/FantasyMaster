
const { createCanvas } = require("canvas");
const Discord = require("discord.js");
const { readdirSync } = require("fs");
const { DiscordInstance } = require("../utils/boilerplate/Discord_Boilerplate");
const { workingDir } = require("../utils/helpers");
const { TownRegistry } = require("../utils/registers");
/**
 * 
 * @param {Discord.Interaction} interaction 
 * @param {DiscordInstance} discordInstance 
 */

module.exports = async function (interaction, discordInstance) {
    const townRegistry = discordInstance.fetchFromCache("townRegistry")().TownRegistry;
    if (interaction.options.getSubcommand() === "property_list") {
        let towns = readdirSync(workingDir() + "/" + TownRegistry.table).map(v => {
            const townName = v.replace(".town", "");
            const npcRegistry = discordInstance.fetchFromCache("npcRegistry")();
            if (townName == "") {
                interaction.editReply("This town does not exist.");
                return;
            }
            const currentTown = townRegistry.get(townName)
            if (currentTown == undefined) {
                interaction.editReply("This town does not exist.");
                return;
            }
            const currentTownInfo = currentTown.getData();
            const houseArray = currentTownInfo.houseArray;
            const homesLeft = houseArray.filter((value) => value.owner == null);
            const occupied = houseArray.filter((value) => value.owner != null);
            const message =
                `town: ${townName}
            inhabitants: ${(houseArray.length - homesLeft.length)}
            homes left: ${homesLeft.length +
                ((occupied.length == 0) ? "" : occupied.map(value => {
                    return (
                        `\nproperty ID: ${value.id}
            owned by: ${(typeof value.owner === typeof 0) ?
                            `${npcRegistry.getFromID(value.owner)["name"]}
            type: ${npcRegistry.getFromID(value.owner)["type"]}`
                            : discordInstance.getClient().users.cache.get(value.owner).username}`)
                }))
                }
            `
            return message;
        })
        interaction.editReply({ content: towns.join("\n") })
        return;
    }
    const textureAtlas = discordInstance.fetchFromCache("textureAtlas")();
    const npcRegistry = discordInstance.fetchFromCache("npcRegistry")();
    if(interaction.options.getSubcommand() === "buy_property"){
        
        const townName = interaction.options.getString("town");

        const currentTown = townRegistry.get(townName)
        if(currentTown == undefined){
            interaction.editReply("town "+townName+" does not exist.");
            return;
        }
        
        const canvas = createCanvas(540, 540);
        const ctx = canvas.getContext("2d");
        ctx.font = "10px Morris Roman";

        const townImg = textureAtlas.getPrecachedTexture(currentTown.townName).texture;
        const houseAvailable = textureAtlas.getPrecachedTexture("town_icon_house_available").texture;
        const houseYouOwn = textureAtlas.getPrecachedTexture("town_icon_house_player_owned").texture;
        const houseOccupied = textureAtlas.getPrecachedTexture("town_icon_house_occuplied").texture;
        const houseShop = textureAtlas.getPrecachedTexture("town_icon_shop").texture;

        ctx.drawImage(townImg, 0, 0);
        for (let info of currentTown.getData().houseArray) {
            if (info.owner == null) {
                ctx.drawImage(houseAvailable, info.x, info.y, 30, 30);
                ctx.fillText(
                    "available",
                    info.x + 10 - "available".length,
                    info.y + -5
                );
                ctx.fillText(
                    "ID: " + info.id.toString(),
                    info.x + 10 - ("ID: " + info.id.toString()).length,
                    info.y + 45
                );
            } else if (info.owner == interaction.user.id) {
                ctx.drawImage(houseYouOwn, info.x, info.y, 30, 30);
                ctx.fillText(
                    interaction.user.username,
                    info.x - interaction.user.username.length,
                    info.y + -5
                );
                ctx.fillText(
                    "ID: " + info.id.toString(),
                    info.x + 10 - ("ID: " + info.id.toString()).length,
                    info.y + 45
                );
            } else {
                let clientUsername;
                if (typeof info.owner == typeof "") {
                    clientUsername = (discordInstance.getClient().users.cache.get(info.owner)).username;
                    ctx.drawImage(houseOccupied, info.x, info.y, 30, 30);
                } else {
                    //console.log(info.owner)
                    let ThisNPC = npcRegistry.getFromID(info.owner);
                    if(ThisNPC){
                        clientUsername = ThisNPC.name;
                        if (ThisNPC.type == "shopkeeper") {
                            ctx.drawImage(houseShop, info.x, info.y, 30, 30);
                        } else {
                            ctx.drawImage(houseOccupied, info.x, info.y, 30, 30);
                        }
                    } else {
                        clientUsername = "ERROR";
                        ctx.drawImage(textureAtlas.getPrecachedTexture("ERROR"), info.x, info.y, 30, 30);
                    }
                }

                ctx.fillText(
                    clientUsername,
                    info.x - clientUsername.length,
                    info.y + -5
                );
                ctx.fillText(
                    "ID: " + info.id.toString(),
                    info.x + 10 - ("ID: " + info.id.toString()).length,
                    info.y + 45
                );
            }
        }

        const attachment = new Discord.AttachmentBuilder();
        attachment.setFile((canvas.toBuffer()));
        attachment.setName(townName+".png");
        interaction.editReply({files:[attachment]});
    }
}