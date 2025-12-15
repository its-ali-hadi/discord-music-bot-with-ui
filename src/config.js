import dotenv from 'dotenv';
dotenv.config();

export const config = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID || null,
  defaultVoiceChannelId: process.env.DEFAULT_VOICE_CHANNEL_ID || null,
  port: Number(process.env.PORT || 3000),
};