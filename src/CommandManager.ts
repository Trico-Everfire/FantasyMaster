import { Collection } from '@discordjs/collection';
import { MessageFlags, type API, type APIApplicationCommandInteraction as SlashCommand } from '@discordjs/core';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import ClientConfiguerations from './ClientConfiguerations';
import Command from './structures/Command';

class CommandManager {
    private readonly commands = new Collection<string, Command>();
    private readonly commandAlises = new Collection<string, string>();

    public async loadCommands() {
        // Clear out all commands for hot reloading.
        this.commands.clear();
        this.commandAlises.clear();

        // Get all commands paths in the commands directory and loop through them.
        const commandFilePaths = await readdir(join(__dirname, 'commands'), { recursive: true, withFileTypes: true });
        for (const filePath of commandFilePaths) {
            // Check if is a .js file.
            if (!filePath.isFile()) continue;
            if (!filePath.name.endsWith('.js')) continue;

            // Import the .js file and create an instance of it.
            const commandFilePath = join(filePath.path, filePath.name);
            const command = await import(commandFilePath);
            const commandInstance = new command.default.default();

            // Check if the file instance is a command class.
            // This doesn't error as you might want to have classes that commands import.
            if (!(commandInstance instanceof Command)) continue;

            // Add the command and all aliases to the collection.
            this.commands.set(commandInstance.name, commandInstance);
            for (const alias of commandInstance.aliases) {
                this.commandAlises.set(alias, commandInstance.name);
            }
        }
    }

    public async registerCommands(api: API, clientID: string) {
        // TODO: Check if bot is ran in production to load commands in global.

        const registeredCommands = await api.applicationCommands.getGuildCommands(clientID, ClientConfiguerations.GUILD_ID);

        // TODO: Have a system where it manages the diffrence of loaded commands.
        for (const registeredCommand of registeredCommands) {
            await api.applicationCommands.deleteGuildCommand(clientID, ClientConfiguerations.GUILD_ID, registeredCommand.id);
        }

        // Load all commands
        this.commands.forEach((command) => {
            // TODO: Handle the error that can be thrown.
            api.applicationCommands.createGuildCommand(clientID, ClientConfiguerations.GUILD_ID, command.builtCommand);
        });

        // Load all alises commands
        this.commandAlises.forEach((alias, commandName) => {
            const command = this.commands.get(commandName);

            if (!command) return;

            // TODO: Handle the error that can be thrown.
            api.applicationCommands.createGuildCommand(
                // Is there a better way to do this?
                clientID,
                ClientConfiguerations.GUILD_ID,
                command.structure.setDescription(command.description).setName(alias).toJSON()
            );
        });
    }

    public async runCommand(interaction: SlashCommand, api: API) {
        const command = this.commands.get(this.commandAlises.get(interaction.data.name) ?? interaction.data.name);

        if (!command) {
            api.interactions.reply(interaction.id, interaction.token, { content: 'Command does not exist!', flags: MessageFlags.Ephemeral });
            return;
        }

        command.execute(interaction, api);
    }
}

export default CommandManager;
