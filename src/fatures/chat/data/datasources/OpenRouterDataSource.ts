import { Message } from '../../domain/entities/Message';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free';
export class OpenRouterDataSource {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ?? '';
  }

  async generateResponse(userMessage: string, history: Message[]): Promise<string> {
    const messages = [
      ...history.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: userMessage },
    ];

    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ model: MODEL, messages, max_tokens: 1000 }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`OpenRouter respondió ${response.status}: ${detail}`);
    }

    const data = await response.json();
    return data.choices[0].message.content as string;
  }
}