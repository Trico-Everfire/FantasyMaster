const { fromCurrentDir } = require("./utils/helpers");
const {createCanvas} = require("canvas");
const {REST} = require("@discordjs/rest");
const {Routes} = require("discord-api-types/v9");
const { NPCRegistry, ItemRegistry, TownRegistry } = require("./utils/registers");
const { DiscordInstance } = require("./utils/boilerplate/Discord_Boilerplate");
const { Timer } = require("./utils/timer");
const fs = require("fs");
const TextureLoader = require("./utils/textureloader");
const Town = require("./utils/towngenerator");
const { discordKey } = require("./libs/key.json");
const Discord = require("discord.js");
const { townCommand, townGenerationCommand, createCharacter } = require("./utils/slashcommands");
const { Player } = require("./utils/datainstancer");
const { SlashCommandBuilder } = Discord;
const textureList = new TextureLoader();
const itemRegistry = new ItemRegistry();
const npcRegistry = new NPCRegistry();
const townRegistry = new TownRegistry();
const discordInstance = new DiscordInstance(Discord);

async function startup(){
    await textureList.precacheTexture("player_inventory",fromCurrentDir("/images/inventory.png"));

    await textureList.precacheTexture("town_map",fromCurrentDir("/images/townMap.png"));
    await textureList.precacheTexture("town_icon_hall",fromCurrentDir("/images/townHall.png"));
    await textureList.precacheTexture("town_icon_mountain",fromCurrentDir("/images/mountain.png"));
    await textureList.precacheTexture("town_icon_grass",fromCurrentDir("/images/grass.png"));
    await textureList.precacheTexture("town_icon_house",fromCurrentDir("/images/house.png"));
    await textureList.precacheTexture("town_icon_house_player_owned",fromCurrentDir("/images/houseYou.png"));
    await textureList.precacheTexture("town_icon_house_available",fromCurrentDir("/images/houseAvailable.png"));
    await textureList.precacheTexture("town_icon_house_occuplied",fromCurrentDir("/images/houseOccupied.png"));
    await textureList.precacheTexture("town_icon_shop",fromCurrentDir("/images/houseShop.png"));

    await textureList.precacheTexture("item_icon_book",fromCurrentDir("/images/book.png"));
    await textureList.precacheTexture("item_icon_sword",fromCurrentDir("/images/sword.png"));
    await textureList.precacheTexture("item_icon_potion",fromCurrentDir("/images/potion.png"));
    await textureList.precacheTexture("item_icon_chest",fromCurrentDir("/images/chest.png"));

    for(const town of fs.readdirSync(fromCurrentDir("/images/towns/"))){
        await textureList.precacheTexture(town.substring(0,town.length - 4),fromCurrentDir("/images/towns/"+town));
    }

    discordInstance.addToCache("itemRegistry", ()=>itemRegistry);
    discordInstance.addToCache("npcRegistry", ()=>npcRegistry);
    discordInstance.addToCache("townRegistry", ()=>townRegistry);
    discordInstance.addToCache("textureAtlas", ()=>textureList);
    discordInstance.addToCache("characterCreationCache",{});
}

console.log("Loading Textures...")
    startup().then(()=>{
    console.log("Textures Loaded!")
    const timer = new Timer(()=>npcRegistry,()=>itemRegistry);
    timer.ActivateTickInterval();
    discordInstance.initiateClient({
        intents: new Discord.IntentsBitField([
            Discord.IntentsBitField.Flags.Guilds,
            Discord.IntentsBitField.Flags.GuildEmojisAndStickers,
            Discord.IntentsBitField.Flags.GuildInvites,
            Discord.IntentsBitField.Flags.GuildBans,
            Discord.IntentsBitField.Flags.GuildMembers,
            Discord.IntentsBitField.Flags.GuildMessages,
            Discord.IntentsBitField.Flags.GuildMessageReactions,
            Discord.IntentsBitField.Flags.MessageContent,
        ]),
        partials: [
            Discord.Partials.Channel,
            Discord.Partials.Message,
            Discord.Partials.GuildMember,
            Discord.Partials.Reaction,
        ]
    });

    discordInstance.setErrorHandler((err)=>{console.log(err)});
    discordInstance.setRestful(REST,Routes);

    const guilds = ["603343804636069918", "1019028486263951442"]

    for(const guild of guilds){
        discordInstance.addGuildCommand(guild,townCommand,__dirname+"/commands/showTown.js");
        discordInstance.addGuildCommand(guild,townGenerationCommand,__dirname+"/commands/generateTown.js");
        discordInstance.addGuildCommand(guild,createCharacter,__dirname+"/commands/createCharacter.js")
    }

    discordInstance.addListener("interactionCreate",__dirname+"/listeners/createCharacter.js",(i,d)=>Object.hasOwn(d.fetchFromCache("characterCreationCache"),i.user.id))


}).then(()=>discordInstance.setKey(discordKey));