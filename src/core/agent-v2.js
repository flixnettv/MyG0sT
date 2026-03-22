import { modelManager } from './model-manager.js';
import { saveConversation, getConversationHistory } from '../services/supabase.js';

export async function processMessage(userId, userMessage) {
  const history = await getConversationHistory(userId, 10);
  const messages = [
    ...history.reverse().flatMap((item) => ([
      { role: 'user', content: item.message },
      { role: 'assistant', content: item.response }
    ])),
    { role: 'user', content: userMessage }
  ];

  const response = await modelManager.call(messages, 'You are MyGhost, a helpful AI assistant.');

  await saveConversation(userId, {
    userMessage,
    agentResponse: response.content,
    modelUsed: response.model
  });

  return response;
}
