import 'dotenv/config';
import { env } from 'node:process';

class ClientConfiguerations {
    public static readonly API_VERSION = '10';
    public static readonly CLIENT_INTENT = 0;
    public static readonly CLIENT_TOKEN = this.getToken('BOT_TOKEN');
    public static readonly GUILD_ID = this.getToken('DEV_GUILD');

    private static getToken(tokenName: string): string {
        const token = env[tokenName];

        if (!token) throw new Error(`Could not get token ${tokenName}`);

        return token;
    }
}

export default ClientConfiguerations;
