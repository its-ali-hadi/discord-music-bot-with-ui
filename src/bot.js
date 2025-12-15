import { Client, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import { config } from './config.js';
import { log } from './utils/logger.js';

export function createDiscordClient() {
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
    partials: [Partials.Channel],
  });

  client.once('clientReady', () => log(`Bot logged in as ${client.user.tag}`));
  return client;
}

// Optional: register slash commands (not required for web control)
export async function registerCommands() {
  const commands = [
    {
      name: 'ping',
      description: 'Replies with pong',
    },
  ];
  const rest = new REST({ version: '10' }).setToken(config.token);
  if (config.guildId) {
    await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: commands });
    log('Registered guild commands');
  } else {
    await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
    log('Registered global commands');
  }
}

if (process.argv[2] === 'register') {
  registerCommands().catch(console.error);
}