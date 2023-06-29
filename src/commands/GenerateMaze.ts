import { SlashCommandBuilder } from '@discordjs/builders';
import { type API, type APIApplicationCommandInteraction as SlashCommand } from '@discordjs/core';
import { createCanvas } from 'canvas';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import Maze from '../genertation/maze/Maze';
import Command from '../structures/Command';

class GenerateMaze extends Command {
    public readonly name = 'genmaze';
    public readonly aliases = ['generate_maze'];
    public readonly description = 'This is a command to generate a maze';
    public readonly structure = new SlashCommandBuilder();

    public execute(interaction: SlashCommand, api: API): void {
        const canvas = createCanvas(1024, 1024);
        const doesFileExist = existsSync(__dirname + '/temp.maze');
        if (!doesFileExist) {
            const maze = new Maze(1024, 60, 60);
            maze.generate();
            maze.draw(canvas);
            writeFileSync(__dirname + '/temp.maze', maze.saveMazeData(), 'binary');
        } else {
            const data = readFileSync(__dirname + '/temp.maze', 'binary');
            const pData = new DataView(Buffer.from(data).buffer);
            console.log(data);
            const maze = new Maze(0, 0, 0);
            maze.insertExistingMaze(pData);
            maze.draw(canvas);
        }

        api.interactions.reply(interaction.id, interaction.token, { files: [{ data: canvas.toBuffer(), name: 'Maze.png', contentType: 'png' }] });
    }
}

export default GenerateMaze;
