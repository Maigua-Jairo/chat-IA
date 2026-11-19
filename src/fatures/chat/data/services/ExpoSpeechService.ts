import * as Speech from 'expo-speech';
import { SpeechService } from '../../domain/services/SpeechService';

// Convierte Markdown en texto natural para que la voz no lea los símbolos.
// Es una transformación propia de la voz, por eso vive en el adaptador.
export const toSpeakableText = (markdown: string): string =>
  markdown
    .replace(/```[\s\S]*?```/g, '')            // bloques de código: no se leen
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '')    // imágenes
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')   // enlaces: solo el texto
    .replace(/`([^`]+)`/g, '$1')               // código en línea
    .replace(/^#{1,6}\s+/gm, '')               // encabezados (#, ##, ...)
    .replace(/^\s*>\s?/gm, '')                 // citas
    .replace(/^\s*[-*+]\s+/gm, '')             // viñetas
    .replace(/(\*\*|__)(.*?)\1/g, '$2')        // negrita
    .replace(/(\*|_)(.*?)\1/g, '$2')           // cursiva
    .replace(/~~(.*?)~~/g, '$1')               // tachado
    .replace(/\*+/g, '')                       // asteriscos sueltos
    .replace(/\s+/g, ' ')                      // saltos de línea -> espacios
    .trim();

export class ExpoSpeechService implements SpeechService {
  speak(text: string, onFinish?: () => void): void {
    Speech.stop();
    Speech.speak(toSpeakableText(text), {
      language: 'es-ES',
      rate: 1.0,
      onDone: onFinish,
      onStopped: onFinish,
      onError: onFinish,
    });
  }

  stop(): void {
    Speech.stop();
  }
}