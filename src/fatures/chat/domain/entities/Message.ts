export type MessageRole= 'user' | 'assistant';

export interface Message{
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
}

//Factory: funcion pura que crea mensajes de forma consistnte
export const createMessage=(
    role: MessageRole,
    content: string
): Message=>({
    id: Date.now().toString(),
    role,
    content,
    timestamp: new Date(),
});