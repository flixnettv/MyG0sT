import dotenv from 'dotenv';

import app from './app.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import modelsRoutes from './api/models-routes.js';
import chatRoutes from './api/chat-routes.js';
import toolsRoutes from './api/tools-routes.js';
import { startTelegramBot } from './interfaces/telegram-bot.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.0.0' });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'MyGhost',
    version: '2.0.0',
    features: ['Multi-Model AI', 'Telegram Bot', 'Docker Support']
  });
});

app.use('/api/models', modelsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tools', toolsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, async () => {
  console.log(`🤖 MyGhost running on port ${PORT}`);
  await startTelegramBot();
});
