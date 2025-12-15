import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import webRoutes from './routes/web.js';
import apiRoutes from './routes/api.js';
import { config } from './config.js';
import { log } from './utils/logger.js';

export function createServer(discordClient) {
  const app = express();

  app.set('adapterCreator', (guildId) => {
    const guild = discordClient.guilds.cache.get(guildId);
    if (!guild) throw new Error('Guild not found in client cache');
    return guild.voiceAdapterCreator;
  });


  app.use(morgan('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'ejs');
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/', webRoutes);
  app.use('/api', apiRoutes);

  app.listen(config.port, () => log(`Web server listening on http://localhost:${config.port}`));
  return app;
}