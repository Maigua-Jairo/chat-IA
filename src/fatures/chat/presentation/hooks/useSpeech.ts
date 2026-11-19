import { useCallback, useEffect, useState } from 'react';
import { ExpoSpeechService } from '../../data/services/ExpoSpeechService';

// Composition root: aquí se decide qué implementación se usa,
// igual que en useChat. Cambiar de librería de voz = cambiar esta línea.
const speechService = new ExpoSpeechService();

export const useSpeech = () => {
  // Guardamos el id del mensaje que se está leyendo, para
  // mostrar "Detener" solo en ese mensaje.
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const speak = useCallback((id: string, text: string) => {
    setSpeakingId(id);
    speechService.speak(text, () =>
      setSpeakingId(prev => (prev === id ? null : prev))
    );
  }, []);

  const stop = useCallback(() => {
    speechService.stop();
    setSpeakingId(null);
  }, []);

  // Si el usuario sale de la pantalla, dejamos de hablar
  useEffect(() => () => speechService.stop(), []);

  return { speakingId, speak, stop };
};