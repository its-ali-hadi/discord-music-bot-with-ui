# Discord Music Bot Web Control

A powerful Discord Music Bot featuring a dedicated Web Dashboard for seamless playback control. This project combines the robustness of **Discord.js** with a user-friendly **Express.js** web interface, allowing users to search, queue, and control music playback directly from their browser without spamming chat commands.

![Project Banner](https://via.placeholder.com/1200x400?text=Discord+Music+Bot+Web+Interface)

## 🚀 Features

-   **Web Dashboard**: A clean, responsive EJS-based web interface to control the bot.
-   **YouTube Integration**: Search and play high-quality audio directly from YouTube.
-   **Playback Controls**: Play, Pause, Resume, and Stop functionality via the web UI.
-   **Queue System**: Add songs to a queue and let the music play continuously.
-   **Real-time Status**: View "Now Playing" track information and queue status.
-   **Multi-Guild Support**: Capable of joining different guilds (configuration dependent).
-   **Robust Audio**: Built on `@discordjs/voice` for high-performance audio streaming.

## 🛠 Tech Stack

### Backend
-   **Node.js**: Runtime environment.
-   **Express.js**: Web server framework for the dashboard and API.
-   **Discord.js**: Core library for interacting with the Discord API.
-   **@discordjs/voice**: Advanced audio handling for Discord.
-   **play-dl / ytdl-core**: YouTube stream extraction and search.
-   **FFmpeg**: Audio processing.

### Frontend
-   **EJS**: Server-side templating for dynamic views.
-   **Vanilla CSS**: Custom styling for a modern dark-themed UI.
-   **JavaScript (ES6+)**: Client-side logic for API interaction and UI updates.

## ⚙️ Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/discord-music-bot-web.git
    cd discord-music-bot-web
    ```

2.  **Install Dependencies**
    Ensure you have Node.js (v16.9.0 or higher) and FFmpeg installed.
    ```bash
    npm install
    ```

3.  **Configuration**
    Create a `.env` file in the root directory and add your credentials:
    ```env
    DISCORD_TOKEN=your_discord_bot_token
    CLIENT_ID=your_discord_application_id
    GUILD_ID=your_target_guild_id (optional, for specific guild focus)
    DEFAULT_VOICE_CHANNEL_ID=your_default_voice_channel_id (optional)
    PORT=3000
    ```

## 🏃‍♂️ How to Run

### Development Mode
Runs the bot with hot-reloading (if nodemon is set up) or standard node watch:
```bash
npm run dev
```

### Production Mode
```bash
npm start
```
### or open `start-dev.bat`

Once running, access the web dashboard at: `http://localhost:3000`

## 📸 Screenshots

| Dashboard Home | Search Results |
|:---:|:---:|
| ![Dashboard](https://via.placeholder.com/600x400?text=Dashboard+UI) | ![Search](https://via.placeholder.com/600x400?text=Search+Results) |

| Now Playing | Mobile View |
|:---:|:---:|
| ![Now Playing](https://via.placeholder.com/600x400?text=Now+Playing) | ![Mobile](https://via.placeholder.com/600x400?text=Mobile+Responsive) |

## 🔌 API Endpoints

The web frontend communicates with the bot via a RESTful API. You can also use these endpoints programmatically.

### Player Control
-   `POST /api/play`: Play a track. Requires body `{ url: "youtube_url", voiceChannelId: "id", guildId: "id" }`.
-   `POST /api/pause`: Pause playback.
-   `POST /api/resume`: Resume playback.
-   `POST /api/stop`: Stop playback and clear queue.
-   `GET /api/status`: Get current player status (playing, idle) and queue.

### Search
-   `GET /api/search?q=query`: Search YouTube for videos. Returns top 10 results.

## 🏗 Architecture Overview

The system uses a **Hybrid Architecture** where a single Node.js process hosts both the Discord Client and the Express Web Server.

1.  **Entry Point (`src/index.js`)**: Initializes the Discord Client and logs in. Once ready, it starts the Express Server.
2.  **Web Server (`src/server.js`)**: Serves EJS templates and exposes API routes. It holds a reference to the Discord Client to access Guilds and Voice Adapters.
3.  **Player Controller (`src/controllers/playerController.js`)**: Bridges the API requests to the Discord Player logic.
4.  **Discord Player Service (`src/services/discordPlayer.js`)**: Manages the `@discordjs/voice` AudioPlayer, VoiceConnection, and Queue system per guild.

## 📝 Notes

-   **Performance**: The bot uses `play-dl` or `ytdl-core` for efficient streaming. Ensure the host machine has sufficient bandwidth for audio streaming.
-   **Scaling**: Currently designed as a single-process application. For sharding or multi-process scaling, the state management (queues) would need to be moved to an external store like Redis.
-   **Security**: The web interface is currently open (no auth). For public deployment, it is **highly recommended** to implement an authentication layer (e.g., Discord OAuth2) to prevent unauthorized control.

---
*Built with ❤️ for the Discord Community.*
