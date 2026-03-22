import { Telegraf } from 'telegraf';
import { modelManager } from '../core/model-manager.js';
import { saveConversation } from '../services/supabase.js';

let bot = null;

export async function startTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('Telegram token not set');
    return;
  }

  bot = new Telegraf(token);

  bot.command('start', async (ctx) => {
    await ctx.reply('🤖 مرحباً! أنا MyGhost\n\n/help - المساعدة\n/models - النماذج');
  });

  bot.command('help', async (ctx) => {
    await ctx.reply(`
🆘 المساعدة

/start - بدء جديد
/models - النماذج المتاحة
/switch - تبديل النموذج
/stats - الإحصائيات
/clear - حذف الذاكرة
    `);
  });

  bot.command('models', async (ctx) => {
    const models = modelManager.getAvailableModels();
    let text = '📋 النماذج:\n\n';
    models.forEach((m) => {
      text += `• ${m.id} - ${m.name}\n`;
    });
    await ctx.reply(text);
  });

  bot.command('switch', async (ctx) => {
    const args = ctx.message.text.split(' ');
    const modelId = args[1];

    if (!modelId) {
      return ctx.reply('استخدام: /switch <model-id>');
    }

    try {
      modelManager.switchModel(modelId);
      await ctx.reply(`✅ تم التبديل إلى: ${modelId}`);
    } catch (error) {
      await ctx.reply(`❌ خطأ: ${error.message}`);
    }
  });

  bot.on('message', async (ctx) => {
    try {
      const userId = ctx.from.id.toString();
      const userMessage = ctx.message.text;

      await ctx.sendChatAction('typing');

      const response = await modelManager.call(
        [{ role: 'user', content: userMessage }],
        'You are MyGhost, a helpful AI assistant.'
      );

      await saveConversation(userId, {
        userMessage,
        agentResponse: response.content,
        modelUsed: response.model
      });

      await ctx.reply(response.content);
    } catch (error) {
      console.error(error);
      await ctx.reply('❌ حدث خطأ');
    }
  });

  await bot.launch();
  console.log('✅ Telegram Bot started');

  return bot;
}

export function stopTelegramBot() {
  if (bot) {
    bot.stop();
  }
}
