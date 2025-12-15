import { config } from './config.js';
import { createDiscordClient } from './bot.js';
import { createServer } from './server.js';

async function main() {
  const client = createDiscordClient();
  await client.login(config.token);
  createServer(client);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});