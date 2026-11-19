import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Message } from '../../domain/entities/Message';

import { TouchableOpacity } from 'react-native';

interface Props {
  message: Message;
  isSpeaking?: boolean;
  onToggleSpeak?: () => void;
}

export const MessageBubble: React.FC<Props> = ({ message, isSpeaking, onToggleSpeak }) => {
  const isUser = message.role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {isUser ? (
          <Text style={[styles.text, styles.userText]}>{message.content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message.content}</Markdown>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {message.timestamp.toLocaleTimeString('es-EC', {
            hour: '2-digit', minute: '2-digit',
          })}
        </Text>

        {/* Solo la IA tiene botón de voz */}
        {!isUser && onToggleSpeak && (
          <TouchableOpacity
            onPress={onToggleSpeak}
            style={[styles.speakBtn, isSpeaking && styles.speakBtnActive]}
            accessibilityLabel={isSpeaking ? 'Detener audio' : 'Escuchar mensaje'}
          >
            <Text style={styles.speakIcon}>{isSpeaking ? '⏹️' : '🔊'}</Text>
            <Text style={[styles.speakText, isSpeaking && styles.speakTextActive]}>
              {isSpeaking ? 'Detener' : 'Escuchar'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:     { marginVertical: 6, marginHorizontal: 12, maxWidth: '82%' },
  userContainer: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  aiContainer:   { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: {
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 11,
    shadowColor: '#4F46E5',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  userBubble: { backgroundColor: '#4F46E5', borderBottomRightRadius: 6 },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },
  text:      { fontSize: 15, lineHeight: 22 },
  userText:  { color: '#FFFFFF' },
  timestamp: { fontSize: 11, color: '#94A3B8' },
  footer:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4, paddingHorizontal: 4 },
  speakBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
  },
  speakBtnActive:  { backgroundColor: '#FEE2E2' },
  speakIcon:       { fontSize: 12 },
  speakText:       { fontSize: 11, color: '#4F46E5', fontWeight: '700' },
  speakTextActive: { color: '#DC2626' },
});

// Estilos para cada elemento Markdown. Las claves son los nombres
// de los nodos que produce la librería (body, strong, code_inline...).
const markdownStyles = StyleSheet.create({
  body:        { fontSize: 15, lineHeight: 22, color: '#1E293B' },
  heading1:    { fontSize: 20, fontWeight: '700', color: '#312E81', marginVertical: 4 },
  heading2:    { fontSize: 18, fontWeight: '700', color: '#312E81', marginVertical: 4 },
  heading3:    { fontSize: 16, fontWeight: '700', color: '#3730A3', marginVertical: 2 },
  strong:      { fontWeight: '700', color: '#312E81' },
  em:          { fontStyle: 'italic' },
  link:        { color: '#4F46E5', textDecorationLine: 'underline' },
  code_inline: {
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    fontFamily: 'monospace',
    paddingHorizontal: 5,
    borderRadius: 4,
  },
  fence: {
    backgroundColor: '#1E1B4B',
    color: '#E0E7FF',
    fontFamily: 'monospace',
    borderRadius: 10,
    padding: 10,
    borderWidth: 0,
  },
  blockquote: {
    backgroundColor: '#F5F3FF',
    borderLeftColor: '#8B5CF6',
    borderLeftWidth: 3,
    paddingHorizontal: 10,
  },
  bullet_list: { marginVertical: 4 },
});