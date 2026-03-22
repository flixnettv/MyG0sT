import Anthropic from '@anthropic-ai/sdk';
import { Groq } from 'groq-sdk';

export class ModelManager {
  constructor() {
    this.activeModel = process.env.ACTIVE_MODEL || 'ace3';
    this.models = {
      claude: {
        name: 'Claude',
        client: process.env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) : null,
        modelId: 'claude-3-5-sonnet-20241022'
      },
      groq: {
        name: 'Groq',
        client: process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null,
        modelId: 'mixtral-8x7b-32768'
      },
      ace3: {
        name: 'ACE3',
        type: 'local',
        speed: 'ultra-fast'
      },
      custom: {
        name: 'Custom',
        type: 'custom',
        url: process.env.CUSTOM_API_URL
      }
    };
  }

  async call(messages, systemPrompt) {
    if (this.activeModel === 'claude') {
      return this.models.claude.client
        ? this._callClaude(messages, systemPrompt)
        : { content: 'Claude API key is not configured', model: 'claude' };
    }

    if (this.activeModel === 'groq') {
      return this.models.groq.client
        ? this._callGroq(messages, systemPrompt)
        : { content: 'Groq API key is not configured', model: 'groq' };
    }

    if (this.activeModel === 'ace3') {
      return {
        content: 'ACE3 local model response simulation.',
        model: 'ace3'
      };
    }

    return { content: 'Model not available', model: this.activeModel };
  }

  async _callClaude(messages, systemPrompt) {
    const response = await this.models.claude.client.messages.create({
      model: this.models.claude.modelId,
      max_tokens: 8000,
      system: systemPrompt,
      messages
    });

    return {
      content: response.content?.[0]?.text || '',
      model: 'claude'
    };
  }

  async _callGroq(messages, systemPrompt) {
    const response = await this.models.groq.client.chat.completions.create({
      model: this.models.groq.modelId,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 8000
    });

    return {
      content: response.choices?.[0]?.message?.content || '',
      model: 'groq'
    };
  }

  switchModel(modelId) {
    if (!this.models[modelId]) {
      throw new Error('Model not found');
    }

    this.activeModel = modelId;
    return { success: true, model: modelId };
  }

  getActiveModel() {
    return this.activeModel;
  }

  getAvailableModels() {
    return Object.entries(this.models).map(([id, model]) => ({
      id,
      name: model.name
    }));
  }
}

export const modelManager = new ModelManager();
