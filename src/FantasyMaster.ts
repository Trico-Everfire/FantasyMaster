import { Client, GatewayDispatchEvents } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { WebSocketManager } from '@discordjs/ws';
import { API_VERSION, CLIENT_INTENT, CLIENT_TOKEN } from './ClientConfiguerations';

class FantasyMaster {
    private readonly rest = new REST({ version: API_VERSION }).setToken(CLIENT_TOKEN);
    private readonly gateway = new WebSocketManager({ intents: CLIENT_INTENT, rest: this.rest, token: CLIENT_TOKEN, version: API_VERSION });
    private readonly client = new Client({ gateway: this.gateway, rest: this.rest });

    public constructor() {
        this.client.once(GatewayDispatchEvents.Ready, () => console.log('Bot is ready'));
    }

    public async startBot() {
        await this.gateway.connect();
    }
}

export default FantasyMaster;
