<div align="center">
  <h1>🤖 FenBot 🔥</h1>
  <p><em>The ultimate Discord bot for mass messaging mayhem</em></p>
  <p><em>100% vibe coded<em></p>
  
  ![Discord](https://img.shields.io/badge/Discord-Bot-7289da?style=for-the-badge&logo=discord&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
</div>

## ✨ Features

- 💬 **Mass DM Command**: Send messages to all users with a specific role
- ⏰ **Smart Cooldowns**: 15-minute cooldown system to prevent spam
- 🚫 **Anti-Pertichini Protection**: Automatic timeout for spam attempts
- 🏥 **Health Check**: Built-in HTTP server for monitoring
- 🛡️ **Error Handling**: Robust error management (not even a try/catch block in sight...)

## 🚀 Quick Start

### Prerequisites
- Node.js latest 📦
- Discord Bot Token 🔑
- A Discord server with proper permissions 🏠

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd fenbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Then edit .env with your credentials
```

### Environment Setup

Create a `.env` file with:

```env
DISCORD_TOKEN=your_bot_token_here
GUILD_ID=your_server_id
ROLE_ID=target_role_id
```

### Running the Bot

```bash
# Install the dependencies
npm install

# Development
npm run dev

# Production
npm build
npm start
```

## 🎮 Commands

| Command | Description | Cooldown |
|---------|-------------|----------|
| `/fen` | 📨 Send "fen" to all users with the target role | 15 minutes |

## ⚙️ How It Works

1. 🎯 User runs `/fen` command
2. 🔍 Bot checks for cooldown and spam protection
3. 📋 Fetches all members with the specified role
4. 💌 Sends DM to each member
5. ✅ Reports success with member count

## 🛡️ Anti-Spam Features

- **Cooldown System**: 15-minute wait between uses
- **Pertichini Detection**: 3 attempts during cooldown = 5-minute timeout
- **Auto-Moderation**: Automatic member timeout for spam

## 📊 Health Monitoring

The bot includes a health check endpoint:
- **URL**: `http://localhost:3000`
- **Response**: Bot status and readiness

## 🤝 Contributing

Contributions are welcome! Feel free to:
- 🐛 Report bugs
- 💡 Suggest features
- 🔧 Submit pull requests
---

<div align="center">
  <p>Made with Claude 4 Sonnet and 35 minutes of vibe coding</p>
  <p><em>"Fen responsibly!"</em> 😄</p>
</div>