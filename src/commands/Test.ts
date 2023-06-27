import { SlashCommandBuilder } from '@discordjs/builders';
import { type API, type APIApplicationCommandInteraction as SlashCommand } from '@discordjs/core';
import Command from '../structures/Command';

class Test extends Command {
    public readonly name = 'test';
    public readonly aliases = ['testing'];
    public readonly description = 'This is a command to test if commands work.';
    public readonly structure = new SlashCommandBuilder();

    public execute(interaction: SlashCommand, api: API): void {
        api.interactions.reply(interaction.id, interaction.token, { content: 'test!' });
    }
}

export default Test;
