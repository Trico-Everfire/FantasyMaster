import { APIUser, Client, GatewayDispatchEvents, InteractionType } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import ClientConfiguerations from './ClientConfiguerations';
import CommandManager from './CommandManager';

class FantasyMaster extends Client {
    private readonly gatewayAPI: WebSocketManager;
    private readonly commandManager = new CommandManager();
    private userData!: APIUser;

    public constructor() {
        const rest = new REST({ version: ClientConfiguerations.API_VERSION }).setToken(ClientConfiguerations.CLIENT_TOKEN);
        const gateway = new WebSocketManager({
            intents: ClientConfiguerations.CLIENT_INTENT,
            rest,
            token: ClientConfiguerations.CLIENT_TOKEN,
            version: ClientConfiguerations.API_VERSION,
        });

        super({ gateway, rest });
        this.gatewayAPI = gateway;

        this.once(GatewayDispatchEvents.Ready, ({ data }) => {
            this.userData = data.user;
            console.log('Bot is ready');
        });

        this.on(GatewayDispatchEvents.InteractionCreate, ({ data: interaction, api }) => {
            if (interaction.type === InteractionType.ApplicationCommand) {
                this.commandManager.runCommand(interaction, api);
                return;
            }
        });
    }

    public async startBot() {
        await this.commandManager.loadCommands();
        await this.gatewayAPI.connect();
        await this.commandManager.registerCommands(this.api, this.user.id);
    }

    // This should be used only after the bot is connected.
    public get user() {
        return this.userData;
    }
}

export default FantasyMaster;
