import * as Discord from "discord.js";
import { REST, RESTOptions } from "@discordjs/rest";
import { Routes, RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9";
declare type FunctionUnion = (message: Discord.Message) => void;
declare type InstanceClientEvents = {
    [K in keyof Discord.ClientEvents]: [..._: Discord.ClientEvents[K], DiscordInstance: DiscordInstance];
};
declare type MessagePrefixType = (guild: Discord.Guild | null, DiscordInstance: DiscordInstance) => string;
/**
 * DiscordInstance
 *
 * Discord Instance is a class designed to make making a discord bot easier.
 */
export declare class DiscordInstance {
    private discord;
    private client;
    private commandCollection;
    private slashArray;
    private loggedIn;
    class: typeof DiscordInstance;
    Middleware: Discord.Collection<Discord.Snowflake, Function>;
    private cache;
    private prefixLambda;
    private middlewareFunctions;
    private MainErrorHandler;
    private REST;
    private Restful;
    private ROUTES;
    private guildCommandArray;
    private globalCommandArray;
    private dRestInit;
    private dataFilePath;
    /**
     * The DiscordJS class.
     * @param discord
     */
    constructor(discord: typeof Discord);
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
    setRestful(Rest: typeof REST, routes: typeof Routes, RestOptions?: Partial<RESTOptions>, dataFilePath?: string): void;
    /**
     *
     * @param guildID A DiscordJS Guild Snowflake (ID).
     * @param command A RESTPostAPIApplicationCommandsJSONBody (This can be used with slash command builder, make sure you .toJSON() at the end.)
     * @param functionType The function that executes when the slash command is triggered.
     */
    addGuildCommand(guildID: Discord.Snowflake, command: RESTPostAPIApplicationCommandsJSONBody, functionType: FunctionUnion | string): void;
    /**
     *
     * @param command A RESTPostAPIApplicationCommandsJSONBody (This can be used with slash command builder, make sure you .toJSON() at the end.)
     * @param functionType The function that executes when the slash command is triggered.
     */
    addGlobalCommand(command: RESTPostAPIApplicationCommandsJSONBody, functionType: FunctionUnion | string): void;
    /**
     * getPrefix gets the bot's prefix on a per guild basis, this is dictated by the internal prefix predicate (settable via setPrefix).
     * @param guild The Discord Guild Class Instance.
     * @param discordInstance The Discord Instance (this).
     * @returns
     */
    getPrefix(guild: Discord.Guild | null, discordInstance: DiscordInstance): string;
    /**
     *
     * @param prefix either a string or a message prefix predicate that returns the prefix string, allowing you to set a global or per guild prefix.
     */
    setPrefix(prefix: string | MessagePrefixType): void;
    /**
     * Gets the discordjs class.
     * @returns
     */
    getDiscord(): typeof Discord;
    /**
     * Gets the client instance.
     * @returns
     */
    getClient(): Discord.Client<boolean> | null;
    /**
     *
     * Use is used to set Middleware, Middleware is a (bunch of) function(s) that can change, set or remove aspects of the DiscordInstance instance.
     *
     * @param name The name of the middleware.
     * @param funct An array of functions used by the middleware.
     */
    use(name: string, ...funct: Function[]): void;
    /**
     * This is used to unset Middleware.
     * @param name the name of the middleware you wish to unuse.
     */
    unuse(name: string): void;
    /**
     * Error handling is a big part of running a discord bot, DiscordInstance will try to catch these errors and forward them to this predicate.
     * @param funct the Error handler function, internally the default will throw any error passed through, set this to change that behaviour.
     */
    setErrorHandler(funct: (error: Error) => void): void;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to add contents to the Cache. (setting a value with a key that already exists will override the previous value.)
     * @param key the name of the element.
     * @param value the value the element contains.
     */
    addToCache(key: string, value: any): void;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to get contents from the Cache.
     * @param key the name of the element.
     * @returns
     */
    fetchFromCache(key: string): any;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to remove contents from the Cache.
     * @param key the name of the element.
     */
    deleteFromCache(key: string): void;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Allows you to check if a element exists in the cache.
     * @param key the name of the element.
     * @returns
     */
    doesCacheContain(key: string): boolean;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * Gets the cache size, how many elements are stored in the cache.
     * @returns
     */
    cacheSize(): number;
    /**
     * The Cache can be used to share between different listeners, message commands or Middleware and can be used throughout the entire DiscordInstance class.
     *
     * WARNING: clearing the cache will remove all elements from the cache, only use this if you're sure you know what you're doing.
     */
    clearCache(): void;
    private init;
    /**
     * The client initiator, this will set the client up.
     * @param options The Discord Client options (like intents and partials).
     */
    initiateClient(options: Discord.ClientOptions): void;
    /**
     * gets a emoji from a server.
     *
     * @param guildID The Discord Guild Snowflake (Guild ID).
     * @param emojiID The Discord Emoji Snowflake (Emoji ID).
     * @returns
     */
    getEmojiFromServer(guildID: Discord.Snowflake, emojiID: Discord.Snowflake): Discord.GuildEmoji | undefined;
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
    addMessageCommand(trigger: string, functionType: FunctionUnion | string, pullLowerCase?: boolean, predicate?: (message: Discord.Message, DiscordInstance: DiscordInstance) => boolean): void;
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
    addListener<K extends keyof InstanceClientEvents>(type: K, functionType: (...args: InstanceClientEvents[K]) => void | string, predicate?: (...args: InstanceClientEvents[K]) => boolean): void;
    /**
     *
     * @param key The Discord Login Key.
     */
    setKey(key: string): void;
}
export {};
