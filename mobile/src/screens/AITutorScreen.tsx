import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SHADOWS } from '../constants/theme';
import { Header } from '../components/Header';
import { GeminiService, ChatMessage } from '../services/geminiService';
import { CustomWordsService } from '../services/customWordsService';
import seedWords from '../data/verified_seed_words.json';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: `நமஸ்காரு! (Namaskaru) 🙏\n\nI am your live **Google Gemini Conversational AI Tutor** for Sourashtra (சௌராஷ்ட்ர பாஷை).\n\nYou can chat or ask me **ANY question** in English, Tamil, or Tanglish!\n• 🔤 Sourashtra Script & Phonetics\n• 🇮🇳 Tamil (தமிழ்)\n• 🅰️ Tanglish (Tamil in English letters)\n• 🇬🇧 English\n\n💡 *Tip:* Tap **"➕ Save Word to Dictionary"** under any AI answer to permanently save it to your Dictionary!`,
    timestamp: 'Just now',
  },
];

const SUGGESTED_PROMPTS = [
  'How to say "I am going to office by bus"?',
  'What is the Sourashtra word for "Aeroplane" and "Computer"?',
  'Translate: "Did you drink tea in the morning?"',
  'How to speak politely with elders in Sourashtra?',
  'Tell me a small conversation between two friends',
  'துமி சொஜ்ஞொ க்கொனொய்? (Have you eaten?)',
];

const QUICK_VOICE_TOPICS = [
  { emoji: '🤝', title: 'வணக்கம் சொல்வது எப்படி?', prompt: 'சௌராஷ்ட்ராவில் காலை வணக்கம், மாலை வணக்கம் மற்றும் மரியாதை வணக்கங்களை எப்படி சொல்வது?' },
  { emoji: '🍛', title: 'சாப்பிட்டீர்களா என்று கேட்பது', prompt: 'சாப்பிட்டீர்களா, என்ன உணவு சமைத்தீர்கள் என்பதை சௌராஷ்ட்ராவில் எப்படி கேட்பது?' },
  { emoji: '🚌', title: 'எங்கே போகிறீர்கள்?', prompt: 'How do you say "Where are you going and when will you come back?" in Sourashtra?' },
  { emoji: '🛒', title: 'கடைவீதி & விலை விசாரிப்பு', prompt: 'காய்கறி மற்றும் துணிக்கடையில் விலை விசாரிப்பது எப்படி?' },
  { emoji: '🏥', title: 'மருத்துவர் & உடல்நல பேச்சு', prompt: 'எனக்கு உடம்பு சரியில்லை, மருந்து வேண்டும் என்பதை சௌராஷ்ட்ராவில் எப்படி சொல்வது?' },
  { emoji: '👨‍👩‍👧', title: 'அம்மா, அப்பா, குடும்ப உறவுகள்', prompt: 'சௌராஷ்ட்ராவில் குடும்ப உறவுப் பெயர்கள் (அம்மா, அப்பா, அண்ணன், தங்கை) என்ன?' },
  { emoji: '✈️', title: 'விமானம், கம்ப்யூட்டர் புதிய சொற்கள்', prompt: 'விமானம் (Aeroplane), கணினி (Computer), அலுவலகம் (Office) ஆகிய சொற்கள் சௌராஷ்ட்ராவில் எப்படி அழைக்கப்படும்?' },
];

export default function AITutorScreen({ navigation }: any) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceModalVisible, setVoiceModalVisible] = useState(false);
  const [savedMsgIds, setSavedMsgIds] = useState<Set<string>>(new Set());

  const scrollViewRef = useRef<ScrollView>(null);
  const textInputRef = useRef<TextInput>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const userQuery = (textToSend || inputText).trim();
    if (!userQuery || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userQuery,
      timestamp: 'Just now',
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // 1. Search our local verified dictionary database first
    const norm = userQuery.toLowerCase().replace(/[\?\!\.,'"]/g, '').trim();
    let searchTerm = norm;
    const prefixes = [
      /^what is the meaning of\s+/i,
      /^what is\s+/i,
      /^meaning of\s+/i,
      /^how to say\s+/i,
      /^tell me the meaning of\s+/i,
      /^translate\s+/i,
      /^பொருள் என்ன\s*/i,
      /^அர்த்தம் என்ன\s*/i,
    ];
    for (const rx of prefixes) {
      if (rx.test(searchTerm)) {
        searchTerm = searchTerm.replace(rx, '').replace(/in sourashtra/i, '').replace(/in tamil/i, '').replace(/in english/i, '').trim();
        break;
      }
    }

    // Direct dictionary lookup in 8,585-word database
    const directMatches = (seedWords as any[]).filter((w: any) => {
      const s = (w.sourashtra || '').toLowerCase().trim();
      const t = (w.tanglish || '').toLowerCase().trim();
      const tam = (w.tamil || '').toLowerCase().trim();
      const eng = (w.english || '').toLowerCase().trim();
      const scr = (w.sourashtraScript || '').toLowerCase().trim();

      if (searchTerm.length >= 2) {
        if (s === searchTerm || t === searchTerm || tam === searchTerm || eng === searchTerm || scr === searchTerm) return true;
        if (s.includes(searchTerm) || t.includes(searchTerm) || tam.includes(searchTerm) || eng.includes(searchTerm)) return true;
      }
      return false;
    });

    if (directMatches.length > 0 && searchTerm.split(' ').length <= 4) {
      // Return instant verified dictionary entry
      const match = directMatches[0];
      const otherMatches = directMatches.slice(1, 4);

      let replyText = `📖 **நமது அகராதி விடை (Verified Dictionary Match):**\n\n`;
      if (match.sourashtraScript) {
        replyText += `🔤 **சௌராஷ்ட்ர அசல் எழுத்துரு:** ${match.sourashtraScript}\n`;
      }
      replyText += `🇮🇳 **சௌராஷ்ட்ர ஒலிப்பு:** ${match.sourashtra}\n`;
      replyText += `🅰️ **டங்லீஷ் (Tanglish):** ${match.tanglish || match.pronunciation || match.sourashtra}\n`;
      replyText += `📖 **தமிழ் பொருள்:** ${match.tamil}\n`;
      replyText += `🇬🇧 **ஆங்கில பொருள்:** ${match.english}\n`;
      if (match.category) {
        replyText += `🏷️ **பிரிவு (Category):** ${match.category}\n`;
      }

      if (otherMatches.length > 0) {
        replyText += `\n✨ **தொடர்புடைய பிற சொற்கள் (Related Words):**\n`;
        otherMatches.forEach((om: any) => {
          replyText += `• ${om.sourashtra} (${om.tanglish || ''}) = ${om.tamil} / ${om.english}\n`;
        });
      }

      replyText += `\n💡 *இது நமது அதிகாரப்பூர்வ சௌராஷ்ட்ர அகராதியில் உள்ள சொல்! மேலும் சந்தேகங்களுக்கு கீழே கேட்கலாம்.*`;

      const aiMsg: ChatMessage = {
        id: `ai-dict-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      return;
    }

    // 2. If not found in dictionary or query is complex, query Gemini AI!
    try {
      const reply = await GeminiService.chat(userQuery, messages);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: 'Connection glitch. Please try asking your question again!',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, errorMsg]);
      setIsTyping(false);
    }
  };

  const handleOpenVoicePanel = () => {
    setVoiceModalVisible(true);
  };

  const handleOpenStories = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('DuolingoStories');
    }
  };

  const handleSelectQuickVoiceTopic = (prompt: string) => {
    setVoiceModalVisible(false);
    handleSend(prompt);
  };

  const handleFocusVoiceTyping = () => {
    setVoiceModalVisible(false);
    setTimeout(() => {
      textInputRef.current?.focus();
    }, 200);
  };

  const handleSaveToDictionary = async (msg: ChatMessage) => {
    try {
      const msgIndex = messages.findIndex((m) => m.id === msg.id);
      const precedingUserMsg = msgIndex > 0 ? messages[msgIndex - 1]?.text : 'Custom AI Word';

      const parsed = GeminiService.parseWordFromResponse(msg.text, precedingUserMsg);

      await CustomWordsService.addCustomWord({
        sourashtra: parsed.sourashtra,
        tamil: parsed.tamil,
        english: parsed.english,
        pronunciation: parsed.pronunciation,
        category: parsed.category,
      });

      setSavedMsgIds((prev) => new Set(prev).add(msg.id));
    } catch (e) {
      console.warn('Error saving word to dictionary:', e);
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setSavedMsgIds(new Set());
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <Header
        title="🤖 AI Tutor & Translator"
        subtitle="Google Gemini Live Multi-turn Conversational AI"
      />

      {/* Top Action Bar with Duolingo Stories Button */}
      <View style={styles.statusBar}>
        <TouchableOpacity
          style={styles.voiceCallHeaderBtn}
          onPress={handleOpenStories}
          activeOpacity={0.8}
        >
          <Text style={styles.voiceCallHeaderIcon}>🦉</Text>
          <Text style={styles.voiceCallHeaderText}>Duolingo Stories</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearBtn} onPress={handleClearChat}>
          <Text style={styles.clearBtnText}>Clear 🗑️</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isSaved = savedMsgIds.has(msg.id);

            return (
              <View
                key={msg.id}
                style={[
                  styles.messageBubbleWrapper,
                  isUser ? styles.userBubbleWrapper : styles.aiBubbleWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                    SHADOWS.small,
                  ]}
                >
                  <View style={styles.senderHeader}>
                    <Text style={[styles.senderName, isUser && styles.senderNameUser]}>
                      {isUser ? '👤 You' : '🤖 Gemini Tutor'}
                    </Text>
                  </View>

                  <Text style={[styles.messageText, isUser && styles.messageTextUser]}>
                    {msg.text}
                  </Text>

                  {/* One-Click Save to Dictionary for AI responses */}
                  {!isUser && msg.id !== 'msg-1' && (
                    <View style={styles.saveActionRow}>
                      <TouchableOpacity
                        style={[styles.saveDictBtn, isSaved && styles.saveDictBtnActive]}
                        onPress={() => handleSaveToDictionary(msg)}
                        disabled={isSaved}
                      >
                        <Text
                          style={[
                            styles.saveDictBtnText,
                            isSaved && styles.saveDictBtnTextActive,
                          ]}
                        >
                          {isSaved ? '✅ Saved to App Dictionary' : '➕ Save Word to Dictionary'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          {isTyping && (
            <View style={styles.typingIndicator}>
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginRight: 8 }} />
              <Text style={styles.typingText}>✨ Gemini AI is thinking & translating...</Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Suggested Prompts */}
        <View style={styles.suggestedContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestedScroll}
          >
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestedChip}
                onPress={() => handleSend(prompt)}
              >
                <Text style={styles.suggestedChipText}>💡 {prompt}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input Bar with Customer Voice Mic Button */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.micButton}
            onPress={handleOpenVoicePanel}
            activeOpacity={0.7}
          >
            <Text style={styles.micEmoji}>🎙️</Text>
          </TouchableOpacity>

          <TextInput
            ref={textInputRef}
            style={styles.textInput}
            placeholder="Ask in English, Tamil or Tanglish (tap 🎙️ for voice)..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
            multiline={false}
          />

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isTyping) && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
          >
            <Text style={styles.sendButtonText}>Send 🚀</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Quick Voice Topics & Mic Assistant Modal */}
      <Modal
        visible={voiceModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setVoiceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, SHADOWS.medium]}>
            <View style={styles.modalHeaderIcon}>
              <Text style={styles.modalMicEmoji}>🎙️</Text>
            </View>

            <Text style={styles.modalTitle}>Voice & Conversation Assistant</Text>
            <Text style={styles.modalSub}>
              Select any topic below to ask instantly, or use your keyboard's built-in 🎙️ mic button!
            </Text>

            {/* Voice Typing Prompt Banner */}
            <TouchableOpacity style={styles.voiceKeyboardBanner} onPress={handleFocusVoiceTyping}>
              <Text style={styles.voiceKeyboardEmoji}>🗣️</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.voiceKeyboardTitle}>Tap here to speak with Keyboard Mic</Text>
                <Text style={styles.voiceKeyboardSub}>Your phone's keyboard microphone will type in Tamil/English</Text>
              </View>
              <Text style={styles.voiceKeyboardArrow}>⌨️</Text>
            </TouchableOpacity>

            {/* Quick Topic Questions List */}
            <Text style={styles.quickVoiceLabel}>Popular Conversation Questions:</Text>
            <ScrollView style={styles.quickVoiceScroll} showsVerticalScrollIndicator={false}>
              {QUICK_VOICE_TOPICS.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.quickVoiceItem}
                  onPress={() => handleSelectQuickVoiceTopic(item.prompt)}
                >
                  <Text style={styles.quickVoiceEmoji}>{item.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.quickVoiceItemTitle}>{item.title}</Text>
                    <Text style={styles.quickVoiceItemSub}>{item.prompt}</Text>
                  </View>
                  <Text style={styles.quickVoiceItemArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setVoiceModalVisible(false)}
            >
              <Text style={styles.modalCloseBtnText}>Close ✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  voiceCallHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
    gap: 6,
  },
  voiceCallHeaderIcon: {
    fontSize: 14,
  },
  voiceCallHeaderText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#4338CA',
  },
  modelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  greenDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#16A34A',
    marginRight: 6,
  },
  modelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#166534',
  },
  clearBtn: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  messageBubbleWrapper: {
    marginBottom: 14,
    maxWidth: '92%',
  },
  userBubbleWrapper: {
    alignSelf: 'flex-end',
  },
  aiBubbleWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 18,
    padding: 14,
  },
  userBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomLeftRadius: 4,
  },
  senderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  senderName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  senderNameUser: {
    color: '#E0E7FF',
  },
  messageText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 22,
  },
  messageTextUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  saveActionRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    alignItems: 'flex-start',
  },
  saveDictBtn: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  saveDictBtnActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  saveDictBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  saveDictBtnTextActive: {
    color: '#166534',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  typingText: {
    fontSize: 12,
    color: '#4338CA',
    fontWeight: '600',
  },
  suggestedContainer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
  },
  suggestedScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  suggestedChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  suggestedChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
  },
  micButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EEF2FF',
    borderWidth: 1,
    borderColor: '#C7D2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micEmoji: {
    fontSize: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '85%',
    alignItems: 'center',
  },
  modalHeaderIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalMicEmoji: {
    fontSize: 28,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
    textAlign: 'center',
  },
  voiceKeyboardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
    width: '100%',
    gap: 10,
  },
  voiceKeyboardEmoji: {
    fontSize: 22,
  },
  voiceKeyboardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  voiceKeyboardSub: {
    fontSize: 11,
    color: '#15803D',
    marginTop: 2,
  },
  voiceKeyboardArrow: {
    fontSize: 18,
  },
  quickVoiceLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#64748B',
    alignSelf: 'flex-start',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  quickVoiceScroll: {
    width: '100%',
    maxHeight: 200,
    marginBottom: 16,
  },
  quickVoiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  quickVoiceEmoji: {
    fontSize: 20,
  },
  quickVoiceItemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickVoiceItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  quickVoiceItemArrow: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalCloseBtn: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 14,
  },
});
