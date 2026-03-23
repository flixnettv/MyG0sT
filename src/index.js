import dotenv from 'dotenv';

import app from './app.js';
import { startTelegramBot } from './interfaces/telegram-bot.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`🤖 MyGhost running on port ${PORT}`);
  await startTelegramBot();
});
