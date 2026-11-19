import React, { useState, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity,
  Text, StyleSheet, KeyboardAvoidingView, Platform,
  ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/MessageBubble';
import { useSpeech } from '../hooks/useSpeech';


export const ChatScreen: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const { messages, isLoading, error, sendMessage, clearChat } = useChat();
  const { speakingId, speak, stop } = useSpeech();

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>IA</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>Chat con IA</Text>
            <Text style={styles.headerSubtitle}>
              {isLoading ? 'Escribiendo...' : 'En línea'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={clearChat} style={styles.clearBtn}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
         renderItem={({ item }) => (
  <MessageBubble
    message={item}
    isSpeaking={speakingId === item.id}
    onToggleSpeak={
      item.role === 'assistant'
        ? () => (speakingId === item.id ? stop() : speak(item.id, item.content))
        : undefined
    }
  />
)}  
          contentContainerStyle={[styles.messagesList, messages.length === 0 && styles.flexGrow]}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>👋</Text>
              <Text style={styles.emptyTitle}>¡Hola! ¿En qué te ayudo?</Text>
              <Text style={styles.emptyText}>Escribe un mensaje para comenzar la conversación.</Text>
            </View>
          }
        />
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='small' color='#4F46E5' />
            <Text style={styles.loadingText}>La IA está escribiendo...</Text>
          </View>
        )}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder='Escribe un mensaje...'
            placeholderTextColor='#94A3B8'
            multiline
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            style={[styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Text style={styles.sendIcon}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FF' },
  flex: { flex: 1 },
  flexGrow: { flexGrow: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E7FF',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#1E1B4B' },
  headerSubtitle: { fontSize: 12, color: '#10B981', fontWeight: '600' },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#FEF2F2',
  },
  clearText: { color: '#EF4444', fontSize: 13, fontWeight: '700' },
  messagesList: { paddingVertical: 16, paddingBottom: 8 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#312E81', marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#64748B', textAlign: 'center' },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    gap: 8,
  },
  loadingText: { color: '#4F46E5', fontSize: 13, fontWeight: '600' },
  errorContainer: {
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: { color: '#B91C1C', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E7FF',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderWidth: 1.5,
    borderColor: '#C7D2FE',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#F8FAFF',
  },
  sendButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 22,
    height: 44,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  sendButtonDisabled: { backgroundColor: '#A5B4FC', shadowOpacity: 0, elevation: 0 },
  sendIcon: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
});
