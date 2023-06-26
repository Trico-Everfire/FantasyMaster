const { SlashCommandBuilder } = require("discord.js");

let cmd = new SlashCommandBuilder()
.setName("town")
.setDescription("The base to the town command")
.addSubcommand(input=>
    input.setName("show")
    .setDescription("Shows you the town.")
    .addStringOption(str=>
        str.setName("town")
        .setDescription("the town you wanna view")
        .setRequired(true)
    )
)
.addSubcommand(input=>
    input.setName("list")
    .setDescription("Shows you the lists of towns"))
.addSubcommand(input=>
    input.setName("buy_property")
    .setDescription("Allows you to buy and view properties.")
    .addStringOption(input2=>
        input2.setName("town")
        .setDescription("The town you wanna buy property in.")
        .setRequired(true)))
.addSubcommand(input=>
    input.setName("property_list")
    .setDescription("Allows you to view the towns with properties."))
.toJSON();

let cmd2 = new SlashCommandBuilder()
.setName("generation")
.setDescription("The base to the town command")
.addSubcommand(input=>
    input.setName("generate_town")
    .setDescription("creates a new town.")
    )
.addSubcommand(input=>
    input.setName("regenerate_town_map")
    .setDescription("regenerates the map of a town.")
    .addStringOption(str=>
        str.setName("town")
        .setDescription("the town you wanna view")
        .setRequired(true)))
.addSubcommand(input=>
    input.setName("regenerate_all_town_maps")
    .setDescription("regenerates all maps (may take a moment.)"))
.toJSON();

let cmd3 = new SlashCommandBuilder()
.setName("character")
.setDescription("The character base command.")
.addSubcommand(Input=>
    Input.setName("create")
    .setDescription("Prompts you to create a character"))
.addSubcommand(input=>
    input.setName("list")
    .setDescription("Allows you to view a list of your characters."))
.toJSON();

exports.townCommand = cmd;
exports.townGenerationCommand = cmd2;
exports.createCharacter = cmd3;