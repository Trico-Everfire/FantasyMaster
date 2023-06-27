import 'dotenv/config';
import { env } from 'node:process';

const API_VERSION = '10';

const CLIENT_INTENT = 0;

const botToken = env['BOT_TOKEN'];
if (!botToken) throw new Error('Bot token not found!');
const CLIENT_TOKEN = botToken;

export { API_VERSION, CLIENT_INTENT, CLIENT_TOKEN };
