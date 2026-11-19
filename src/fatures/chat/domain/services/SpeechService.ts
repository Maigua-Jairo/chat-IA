// Contrato: el dominio solo sabe que existe "algo que puede hablar".
// No sabe qué librería lo hace. TypeScript puro.
export interface SpeechService {
  speak(text: string, onFinish?: () => void): void;
  stop(): void;
}