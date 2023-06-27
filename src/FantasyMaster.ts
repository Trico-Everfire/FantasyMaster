import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import ClientConfiguerations from './ClientConfiguerations';

class FantasyMaster {
    private readonly rest = new REST({ version: ClientConfiguerations.API_VERSION }).setToken(ClientConfiguerations.CLIENT_TOKEN);
    private readonly gateway = new WebSocketManager({
        intents: ClientConfiguerations.CLIENT_INTENT,
        rest: this.rest,
        token: ClientConfiguerations.CLIENT_TOKEN,
        version: ClientConfiguerations.API_VERSION,
    });
    private readonly client = new Client({ gateway: this.gateway, rest: this.rest });

    public constructor() {
        this.client.once(GatewayDispatchEvents.Ready, () => console.log('Bot is ready'));
    }

    public async startBot() {
        await this.gateway.connect();
    }
}

export default FantasyMaster;
