import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { Message } from '../../domain/entities/Message';

// Contrato de la capa Data: cualquier proveedor con este método sirve
export interface LLMDataSource {
  generateResponse(userMessage: string, history: Message[]): Promise<string>;
}

export class ChatRepositoryImp implements ChatRepository {
  constructor(private dataSource: LLMDataSource) {}

  async sendMessage(userMessage: string, history: Message[]): Promise<string> {
    return this.dataSource.generateResponse(userMessage, history);
  }
}