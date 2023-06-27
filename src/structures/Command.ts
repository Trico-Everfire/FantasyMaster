import { type SlashCommandBuilder } from '@discordjs/builders';
import { API, type APIApplicationCommandInteraction as SlashCommand } from '@discordjs/core';

abstract class Command {
    public abstract readonly name: string;
    public abstract readonly aliases: string[];
    public abstract readonly description: string;
    public abstract readonly structure: SlashCommandBuilder;

    public abstract execute(interaction: SlashCommand, api: API): void;

    public get builtCommand() {
        return this.structure.setName(this.name).setDescription(this.description).toJSON();
    }
}

export default Command;
