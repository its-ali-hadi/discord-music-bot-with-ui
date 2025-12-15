import {
    joinVoiceChannel,
    createAudioPlayer,
    NoSubscriberBehavior,
    createAudioResource,
    AudioPlayerStatus,
    entersState,
    VoiceConnectionStatus,
  } from '@discordjs/voice';
  import { Collection } from 'discord.js';
  import { streamFromUrl } from './youtubeService.js';
  import { log, warn } from '../utils/logger.js';
  
  class GuildPlayer {
    constructor(guildId) {
      this.guildId = guildId;
      this.connection = null;
      this.player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Play },
      });
      this.current = null; // { meta, resource }
      this.queue = [];
      this._setupEvents();
    }
  
    _setupEvents() {
      this.player.on(AudioPlayerStatus.Playing, () => log(`Playing in guild ${this.guildId}`));
      this.player.on(AudioPlayerStatus.Idle, () => {
        if (this.queue.length > 0) {
          const next = this.queue.shift();
          this._playMeta(next.meta);
        } else {
          log(`Idle in guild ${this.guildId}`);
          this.current = null;
        }
      });
      this.player.on('error', (e) => warn('Player error', e.message));
    }
  
    async connect(voiceChannelId, adapterCreator) {
      if (this.connection) return this.connection;
      this.connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: this.guildId,
        adapterCreator,
        selfDeaf: true,
        selfMute: false,
      });
      await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
      this.connection.subscribe(this.player);
      return this.connection;
    }
  
    async _playMeta(meta) {
      const { stream, type } = await streamFromUrl(meta.url);
      const resource = createAudioResource(stream, { inputType: type });
      this.current = { meta, resource };
      this.player.play(resource);
      return meta;
    }
  
    async play(meta, { enqueueIfPlaying = true } = {}) {
      if (this.player.state.status === AudioPlayerStatus.Playing && enqueueIfPlaying) {
        this.queue.push({ meta });
        return { enqueued: true, meta };
      }
      return { enqueued: false, meta: await this._playMeta(meta) };
    }
  
    pause() {
      return this.player.pause();
    }
  
    resume() {
      return this.player.unpause();
    }
  
    stop() {
      this.queue = [];
      const stopped = this.player.stop();
      this.current = null;
      return stopped;
    }
  
    nowPlaying() {
      return this.current?.meta || null;
    }
  
    status() {
      return {
        status: this.player.state.status,
        current: this.current?.meta || null,
        queue: this.queue.map(q => q.meta),
      };
    }
  }
  
  export const players = new Collection(); // guildId -> GuildPlayer
  
  export function getGuildPlayer(guildId) {
    if (!players.has(guildId)) players.set(guildId, new GuildPlayer(guildId));
    return players.get(guildId);
  }