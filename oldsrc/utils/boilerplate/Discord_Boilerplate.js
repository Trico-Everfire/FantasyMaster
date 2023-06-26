"use strict";
//|-----------------------------------------------------------------|
//| This Application was made by:                                   |
//|   _______   _             ______               __ _             |
//|  |__   __| (_)           |  ____|             / _(_)            |
//|     | |_ __ _  ___ ___   | |____   _____ _ __| |_ _ _ __ ___    |
//|     | | '__| |/ __/ _ \  |  __\ \ / / _ \ '__|  _| | '__/ _ \   |
//|     | | |  | | (_| (_) | | |___\ V /  __/ |  | | | | | |  __/   |
//|     |_|_|  |_|\___\___/  |______\_/ \___|_|  |_| |_|_|  \___|   |
//|                                                                 |
//|-----------------------------------------------------------------|
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordInstance = void 0;
const fs_1 = __importDefault(require("fs"));
class MessageOptionHandler {
    constructor(key, caseSensitive, conditionalpredicate, handlerFunction) {
        this.key = key;
        this.caseSensitive = caseSensitive;
        this.conditionalpredicate = conditionalpredicate;
        this.handlerFunction = handlerFunction;
    }
}
/**
 * DiscordInstance
 *
 * Discord Instance is a class designed to make making a discord bot easier.
 */
class DiscordInstance {
    /**
     * The DiscordJS class.
     * @param discord
     */
    constructor(discord) {
        this.slashArray = [];
        this.class = DiscordInstance;
        this.REST = undefined;
        this.Restful = undefined;
        this.ROUTES = undefined;
        this.guildCommandArray = undefined;
        this.globalCommandArray = undefined;
        this.dRestInit = undefined;
        this.dataFilePath = undefined;
        this.discord = discord;
        this.client = null;
        this.commandCollection = new this.discord.Collection();
        this.Middleware = new this.discord.Collection();
        this.loggedIn = false;
        this.middlewareFunctions = new Map();
        this.MainErrorHandler = (err) => { throw err; };
        this.prefixLambda = () => "";
        this.cache = new Map();
    }
    /**
     *
     * setRestful allows you to set the DiscordJS Restful API and have it keep track for if you updated your slash commands in a file.
     * DiscordJS Rest allows you to set both client and guild commands.
     * With setRestful you supply 2 required and 2 optional parameters.
     *
     * @param Rest typeof \@discordjs/rest (REQUIRED)
     * @param routes typeof discord-api-types/v9 (REQUIRED)
     * @param RestOptions preferred RESTOptions (default { version: '9' }) (Optional)
     * @param dataFilePath a string filepath that dictates where the rest comparison file will be saved (default "./"). (Optional)
     *
     */
    setRestful(Rest, routes, RestOptions = { version: '9' }, dataFilePath = "./") {
        let rest = new DiscordRest(Rest, routes, RestOptions, dataFilePath);
        this.addGuildCommand = rest.addGuildCommand;
        this.addGlobalCommand = rest.addGlobalCommand;
        this.setKey = rest.setKey;
        this.REST = rest.REST;
        this.Restful = rest.Restful;
        this.dataFilePath = rest.dataFilePath;
        this.ROUTES = rest.ROUTES;
        this.dRestInit = rest.dRestInit;
        this.guildCommandArray = rest.guildCommandArray;
        this.globalCommandArray = rest.globalCommandArray;
    }
    /**
     *
     * @param guildID A DiscordJS Guild Snowflake (ID).
     * @param command A RESTPostAPIApplicationCommandsJSONBody (This can be used with slash command builder, make sure you .toJSON() at the end.)
     * @param functionType The function that executes when the slash command is triggered.
     */
    addGuildCommand(guildID, command, functionType) {
        this.MainErrorHandler(new Error("Restful not initialized! Please Initialize Restful via <DiscordBoilerplate>.setRestful"));
    }
    /**
     *
     * @param command A RESTPostAPIApplicationCommandsJSONBody (This can be used with slash command builder, make sure you .toJSON() at the end.)
     * @param functionType The function that executes when the slash command is triggered.
     */
    addGlobalCommand(command, functionType) {
        this.MainErrorHandler(new Error("Restful not initialized! Please Initialize Restful via <DiscordBoilerplate>.setRestful"));
    }
    /**
     * getPrefix gets the bot's prefix on a per guild basis, this is dictated by the internal prefix predicate (settable via setPrefix).
     * @param guild The Discord Guild Class Instance.
     * @param discordInstance The Discord Instance (this).
     * @returns
     */
    getPrefix(guild, discordInstance) {
        return this.prefixLambda(guild, discordInstance);
    }
    /**
     *
     * @param prefix either a string or a message prefix predicate that returns the prefix string, allowing you to set a global or per guild prefix.
     */
    setPrefix(prefix) {
        if (typeof prefix === "string") {
            this.prefixLambda = () => prefix;
        }
        else {
            this.prefixLambda = prefix;
        }
    }
    /**
     * Gets the discordjs class.
     * @returns
     */
    getDiscord() {
        return this.discord;
    }
    /**
     * Gets the client instance.
     * @returns
     */
    getClient() {
        return this.client;
    }
    /**
     *
     * Use is used to set Middleware, Middleware is a (bunch of) function(s) that can change, set or remove aspects of the DiscordInstance instance.
     *
     * @param name The name of the middleware.
     * @param funct An array of functions used by the middleware.
     */
    use(name, ...funct) {
        if (funct.length == 0) {
            this.MainErrorHandler(new Error("no function(s) specified."));
        }
        else {
            let index = -1;
            if (funct.some((val, ind) => {
                if (!(val instanceof Function)) {
                    index = ind;
                    return true;
                }
                else {
                    return false;
                }
            })) {
                this.MainErrorHandler(new Error("Attempted to initialize non Function as middleware. (array index " + (index).toString() + ")"));
            }
            else
                this.middlewareFunctions.set(name, [...funct]);
        }
    }
    /**
     * This is used to unset Middleware.
     * @param name the name of the middleware you wish to unuse.
     */
    unuse(name) {
        this.middlewareFunctions.delete(name) ? null : console.warn("Cannot unuse non existing element.");
    }
    /**
     * Error handling is a big part of running a discord bot, DiscordInstance will try to catch these errors and forward them to this predicate.
     * @param funct the Error handler function, internally the default will throw any error passed through, set this to change that behaviour.
     */
    setErrorHandler(funct) {
        if (!(funct instanceof Function))
            this.MainErrorHandler(new Error("Attempted to initialize non Function as Error Handler."));
        else
            this.MainErrorHandler = funct;
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to add contents to the Cache. (setting a value with a key that already exists will override the previous value.)
     * @param key the name of the element.
     * @param value the value the element contains.
     */
    addToCache(key, value) {
        this.cache.set(key, value);
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to get contents from the Cache.
     * @param key the name of the element.
     * @returns
     */
    fetchFromCache(key) {
        return this.cache.get(key);
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to remove contents from the Cache.
     * @param key the name of the element.
     */
    deleteFromCache(key) {
        this.cache.delete(key);
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to check if a element exists in the cache.
     * @param key the name of the element.
     * @returns
     */
    doesCacheContain(key) {
        return this.cache.has(key);
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Gets the cache size, how many elements are stored in the cache.
     * @returns
     */
    cacheSize() {
        return this.cache.size;
    }
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * WARNING: clearing the cache will remove all elements from the cache, only use this if you're sure you know what you're doing.
     */
    clearCache() {
        this.cache.clear();
    }
    init() {
        if (this.client) {
            this.client.on("error", (err) => {
                if (err)
                    this.MainErrorHandler(err);
                this.middlewareFunctions.forEach((funcArray) => {
                    funcArray.forEach(funct => funct.call(null, ...["error", err, this]));
                });
            });
            this.client.on("messageCreate", message => {
                if (message.content.startsWith(this.getPrefix(message.guild, this))) {
                    let messageTrigger = this.commandCollection.get(message.content.split(" ")[0].toLowerCase().substring(this.getPrefix(message.guild, this).length));
                    if (messageTrigger) {
                        if (messageTrigger.conditionalpredicate(message, this)) {
                            if (messageTrigger.caseSensitive) {
                                if (messageTrigger.key == message.content.split(" ")[0].substring(this.getPrefix(message.guild, this).length)) {
                                    messageTrigger.handlerFunction(message, this);
                                    this.middlewareFunctions.forEach((funcArray) => {
                                        funcArray.forEach(funct => funct.call(null, ...["message", message, this]));
                                    });
                                }
                            }
                            else {
                                messageTrigger.handlerFunction(message, this);
                                this.middlewareFunctions.forEach((funcArray) => {
                                    funcArray.forEach(funct => funct.call(null, ...["message", message, this]));
                                });
                            }
                        }
                    }
                }
            });
            this.client.on("interactionCreate", (interact) => {
                if (!interact.isCommand())
                    return;
                this.slashArray.forEach(slashcommand => {
                    let command = slashcommand.command;
                    if(slashcommand.guildID == null || slashcommand.guildID == interact.guildId)
                    if (command.name == interact.commandName)
                        slashcommand.function.call(null, ...[interact, this]);
                });
            });
        }
    }
    /**
     * The client initiator, this will set the client up.
     * @param options The Discord Client options (like intents and partials).
     */
    initiateClient(options) {
        if (!this.client) {
            this.client = new this.discord.Client(options);
            this.init();
        }
        else {
            this.MainErrorHandler(new Error("attempted to reinitiate client."));
        }
    }
    /**
     * gets a emoji from a server.
     *
     * @param guildID The Discord Guild Snowflake (Guild ID).
     * @param emojiID The Discord Emoji Snowflake (Emoji ID).
     * @returns
     */
    getEmojiFromServer(guildID, emojiID) {
        if (this.client) {
            let guild = this.client.guilds.cache.get(guildID);
            if (guild)
                return guild.emojis.cache.get(emojiID);
        }
    }
    /**
     * The DiscordInstance set of listeners (addMessageCommand and addListener) are a special type of Discord listener that allows you to drag the DiscordInstance instance (this) to another file or function.
     * At the end of each listener's list of arguments there'll be a new argument. discordInstance, This DiscordInstance, allowing you to access the cache and anything else inside the DiscordInstance class.
     *
     *
     * addMessageCommand allows you to set message commands in a internally initialized message listener, allowing you to set conditions without needing to make your own listener with conditions.
     *
     * @param trigger The trigger string, this is what the bot will respond to (IF PREFIX IS SET IT WILL BE REQUIRED FOR THE TRIGGER TO WORK.).
     * @param functionType Either a function or filepath to a exported function (module.exports = (...)=>{})
     * @param pullLowerCase If case matters for the trigger to occur, it will force lowercase on the message, setting a uppercase letter the trigger with this to true will never trigger the command.
     * @param predicate Conditional predicate, this dictates if the message will be triggered or not, allowing you to set conditions like if the triggerer has a specific role, id, time on the server, etc.
     */
    addMessageCommand(trigger, functionType, pullLowerCase = true, predicate = () => true) {
        if (functionType instanceof Function) {
            let ot = new MessageOptionHandler(trigger, pullLowerCase, predicate, functionType);
            this.commandCollection.set(trigger, ot);
            return;
        }
        if (typeof functionType == "string") {
            let executionFIle = require(functionType);
            if (executionFIle instanceof Function) {
                let ot = new MessageOptionHandler(trigger, pullLowerCase, predicate, executionFIle);
                this.commandCollection.set(trigger, ot);
                return;
            }
        }
        console.warn(trigger + " has not been initiated due to invalid function");
    }
    /**
     * The DiscordInstance set of listeners (addMessageCommand and addListener) are a special type of Discord listener that allows you to drag the DiscordInstance instance (this) to another file or function.
     * At the end of each listener's list of arguments there'll be a new argument. discordInstance, This DiscordInstance, allowing you to access the cache and anything else inside the DiscordInstance class.
     *
     * addListener allows youto set a Discord Event Listener. (with the additional discordInstance parameter at the end.)
     * @param type The listener type
     * @param functionType Either a function or filepath to a exported function (module.exports = (...)=>{})
     * @param predicate Conditional predicate, this dictates if the listener will be triggered or not, allowing you to set conditions like if the triggerer has a specific role, id, time on the server, etc.
     * @returns
     */
    addListener(type, functionType, predicate = () => true) {
        if (this.client) {
            if (functionType instanceof Function) {
                this.client.on(type, (...argument) => {
                    let newArguments = [...argument, this];
                    if (predicate(...newArguments)) {
                        this.middlewareFunctions.forEach((funcArray) => {
                            funcArray.forEach(funct => funct.call(null, ...[type, ...newArguments]));
                        });
                        functionType.apply(null, newArguments);
                    }
                });
                return;
            }
            if (typeof functionType == "string") {
                let listenerFIle = require(functionType);
                if (listenerFIle instanceof Function) {
                    this.client.on(type, (...argument) => {
                        let newArguments = [...argument, this];
                        if (predicate(...newArguments)) {
                            this.middlewareFunctions.forEach((funcArray) => {
                                funcArray.forEach(funct => funct.call(null, ...[type, ...newArguments]));
                            });
                            listenerFIle.apply(null, newArguments);
                        }
                    });
                    return;
                }
            }
            console.warn(type + " has not been initiated due to invalid function");
        }
        else {
            console.warn("WARNING: trying to inititate listener without client, listener " + type + " has therefor not been set.");
        }
    }
    /**
     *
     * @param key The Discord Login Key.
     */
    setKey(key) {
        if (this.client) {
            if (!this.loggedIn) {
                this.loggedIn = true;
                this.client.login(key);
            }
            else
                this.MainErrorHandler(new Error("Trying to log in when already logged in."));
        }
        else {
            console.warn("WARNING: trying to login while client is not initiated, therefor client will not start.");
        }
    }
}
exports.DiscordInstance = DiscordInstance;
class DiscordRest {
    constructor(Rest, routes, RestOptions = { version: '9' }, dataFilePath) {
        this.slashArray = [];
        this.REST = Rest;
        this.ROUTES = routes;
        this.dataFilePath = dataFilePath;
        this.Restful = new this.REST(RestOptions);
        this.guildCommandArray = new Map();
        this.globalCommandArray = new Map();
    }
    async dRestInit() {
        let guildJSONObject = {};
        let globalJSONObject = Object.fromEntries(this.globalCommandArray.entries());
        for (let [key, value] of this.guildCommandArray.entries()) {
            guildJSONObject[key] = Object.fromEntries(value.entries());
        }
        let JSONObject = {
            GuildCommands: guildJSONObject,
            GlobalCommands: globalJSONObject
        };
        if (fs_1.default.existsSync(this.dataFilePath + "/restfulData.json")) {
            try {
                let jsonFile = JSON.parse(fs_1.default.readFileSync(this.dataFilePath + "/restfulData.json", "utf-8"));
                // console.log(deepEqual(JSONObject,jsonFile),JSON.stringify(JSONObject),JSON.stringify(jsonFile))
                if (deepEqual(JSON.parse(JSON.stringify(JSONObject, null, "\t")), JSON.parse(JSON.stringify(jsonFile, null, "\t"))))
                    return;
            }
            catch (err) {
                return this.MainErrorHandler(err);
            }
        }
        for (let [key, value] of this.guildCommandArray.entries()) {
            try {
                let guildCommands = [];
                for (let [key2, value2] of value.entries())
                    guildCommands[key2] = value2;
                await this.Restful.put(this.ROUTES.applicationGuildCommands(this.client.user?.id, key), { body: guildCommands });
            }
            catch (error) {
                return this.MainErrorHandler(error);
            }
        }
        if (this.globalCommandArray.size > 0) {
            try {
                let globalcommands = [];
                for (let [key, value] of this.globalCommandArray.entries())
                    globalcommands[key] = value;
                await this.Restful.put(this.ROUTES.applicationCommands(this.client.user?.id), { body: globalcommands });
            }
            catch (error) {
                return this.MainErrorHandler(error);
            }
            ;
        }
        fs_1.default.writeFileSync(this.dataFilePath + "/restfulData.json", JSON.stringify(JSONObject, null, "\t"));
    }
    addGuildCommand(guildID, command, functionType) {
        if (this.loggedIn)
            return console.warn("Guild slash comand added after login, command will not be added/updated. (make sure to only add new slash commands before logging in)");
        let mapObject = this.guildCommandArray.get(guildID) || new Map();
        mapObject.set(mapObject.size, command);
        this.guildCommandArray.set(guildID, mapObject);
        if (functionType instanceof Function) {
            this.slashArray.push({ function: functionType, command, guildID});
            return;
        }
        if (typeof functionType == "string") {
            let executionFIle = require(functionType);
            if (executionFIle instanceof Function) {
                this.slashArray.push({ function: executionFIle, command, guildID});
                return;
            }
        }
        console.warn("Guild command " + command.name + " for guild " + guildID + " has not been initiated due to invalid function (slash command is sitll registered.)");
    }
    addGlobalCommand(command, functionType) {
        if (this.loggedIn)
            return console.warn("Global Slash comand added after login, command will not be added/updated. (make sure to only add new slash commands before logging in) ");
        this.globalCommandArray.set(this.globalCommandArray.size, command);
        if (functionType instanceof Function) {
            this.slashArray.push({ function: functionType, command });
            return;
        }
        if (typeof functionType == "string") {
            let executionFIle = require(functionType);
            if (executionFIle instanceof Function) {
                this.slashArray.push({ function: executionFIle, command });
                return;
            }
        }
        console.warn("Global command " + command.name + " has not been initiated due to invalid function (slash command is sitll registered.)");
    }
    setKey(key) {
        if (this.client) {
            if (!this.loggedIn) {
                this.loggedIn = true;
                this.Restful.setToken(key);
                this.client.login(key).then((() => { this.dRestInit(); }));
                ;
            }
            else
                this.MainErrorHandler(new Error("Trying to log in when already logged in."));
        }
        else {
            console.warn("WARNING: trying to login while client is not initiated, therefor client will not start.");
        }
    }
}
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = val1 != null && typeof val1 === 'object' && val2 != null && typeof val2 === 'object';
        if (areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2) {
            return false;
        }
    }
    return true;
}
