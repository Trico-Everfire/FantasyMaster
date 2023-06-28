import { SlashCommandBuilder } from '@discordjs/builders';
import { type API, type APIApplicationCommandInteraction as SlashCommand } from '@discordjs/core';
import { createCanvas } from 'canvas';
import Maze from '../maze generation/Maze';
import Command from '../structures/Command';

class GenerateMaze extends Command {
    public readonly name = 'genmaze';
    public readonly aliases = ['generate_maze'];
    public readonly description = 'This is a command to generate a maze';
    public readonly structure = new SlashCommandBuilder();

    public execute(interaction: SlashCommand, api: API): void {
        const canvas = createCanvas(1024, 1024);
        const maze = new Maze(1024, 60, 60);
        maze.generate();
        maze.draw(canvas);

        api.interactions.reply(interaction.id, interaction.token, { files: [{ data: canvas.toBuffer(), name: 'Maze.png', contentType: 'png' }] });
    }
}

export default GenerateMaze;
