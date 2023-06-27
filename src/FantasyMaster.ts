import { APIUser, Client, GatewayDispatchEvents, InteractionType } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import ClientConfiguerations from './ClientConfiguerations';
import CommandManager from './CommandManager';

class FantasyMaster {
    private readonly rest = new REST({ version: ClientConfiguerations.API_VERSION }).setToken(ClientConfiguerations.CLIENT_TOKEN);
    private readonly gateway = new WebSocketManager({
        intents: ClientConfiguerations.CLIENT_INTENT,
        rest: this.rest,
        token: ClientConfiguerations.CLIENT_TOKEN,
        version: ClientConfiguerations.API_VERSION,
    });
    private readonly client = new Client({ gateway: this.gateway, rest: this.rest }); // TODO: extend this
    private readonly commands = new CommandManager();
    private userData!: APIUser;

    public constructor() {
        this.client.once(GatewayDispatchEvents.Ready, ({ data }) => {
            this.userData = data.user;
            console.log('Bot is ready');
        });

        this.client.on(GatewayDispatchEvents.InteractionCreate, ({ data: interaction, api }) => {
            if (interaction.type === InteractionType.ApplicationCommand) {
                this.commands.runCommand(interaction, api);
                return;
            }
        });
    }

    public async startBot() {
        await this.commands.loadCommands();
        await this.gateway.connect();
        await this.commands.registerCommands(this.client.api, this.user.id);
    }

    // This is not undefined as the bot will always be logged in.
    public get user() {
        return this.userData;
    }
}

export default FantasyMaster;
