const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Fast and reliable multi-lingual Gemini models
const FALLBACK_MODELS = [
  'gemini-flash-lite-latest',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
];

const SYSTEM_INSTRUCTION = `You are an expert native Sourashtra AI Tutor & Conversation Partner (சௌராஷ்ட்ர ஆசிரியர்).
You can converse fluently like ChatGPT on ANY topic in the world, translating and teaching Sourashtra (சௌராஷ்ட்ர பாஷை), Tamil, Tanglish (Tamil in English script), and English.

Whenever the user asks a question, chats with you, or asks for words/sentences in English, Tamil, or Tanglish:
1. ALWAYS provide the Sourashtra translation/response in Tamil script (e.g. "துமி கொந்தே ஜாஸ்?" / "மொகொ ஆநந்துக் அஸா").
2. ALWAYS provide the Romanized English Phonetic pronunciation (e.g. "Dhumi konthe jaas?" / "Moko aanandhuk asa").
3. ALWAYS provide the clear Tamil meaning (தமிழ் அர்த்தம்) in Tamil script.
4. ALWAYS provide the Tanglish version (Tamil written in English script, e.g. "Neenga engae poreenga?" / "Enakku romba sandhoshama irukku").
5. ALWAYS provide the English meaning and short word-by-word breakdown.
6. If the user is just having a conversation (saying hello, asking how you are, talking about their day), respond in conversational Sourashtra first, then explain what you said in Tamil, Tanglish, and English!

Format your answers with clean labels:
🔤 **Sourashtra**: ...
🗣️ **Pronunciation**: [...]
🇮🇳 **Tamil**: ...
🅰️ **Tanglish**: ...
🇬🇧 **English**: ...

Keep your tone very warm, encouraging, respectful, and friendly!`;

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export class GeminiService {
  /**
   * Send multi-turn conversation to Gemini AI
   */
  static async chat(userMessage: string, history: ChatMessage[] = []): Promise<string> {
    // Format conversation history for Gemini API
    const formattedContents: any[] = [];

    // Include recent history (up to last 10 messages for rich conversational context)
    const recentHistory = history.slice(-10);
    for (const msg of recentHistory) {
      if (msg.sender === 'user') {
        formattedContents.push({
          role: 'user',
          parts: [{ text: msg.text }],
        });
      } else {
        formattedContents.push({
          role: 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current user message with system instruction context
    formattedContents.push({
      role: 'user',
      parts: [
        {
          text: `[SYSTEM CONTEXT: ${SYSTEM_INSTRUCTION}]\n\nUser Question/Message: ${userMessage}`,
        },
      ],
    });

    // Try models in order until one succeeds
    for (const model of FALLBACK_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        const data = await response.json();

        if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err: any) {
        console.warn(`Gemini model ${model} error:`, err?.message);
      }
    }

    // Secondary attempt: Try backend proxy if available
    try {
      const beRes = await fetch('http://10.209.6.53:8080/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      });
      const beData = await beRes.json();
      if (beData?.data?.answer) {
        return beData.data.answer;
      }
    } catch (e) {
      // Backend proxy unavailable
    }

    return `நமஸ்காரு! I encountered a temporary connection glitch. Please try sending your message again!`;
  }

  /**
   * Send recorded voice audio directly to Gemini Multimodal AI
   */
  static async chatWithAudio(
    audioBase64: string,
    mimeType: string = 'audio/m4a',
    history: ChatMessage[] = []
  ): Promise<string> {
    const formattedContents: any[] = [];

    const recentHistory = history.slice(-6);
    for (const msg of recentHistory) {
      if (msg.sender === 'user') {
        formattedContents.push({
          role: 'user',
          parts: [{ text: msg.text }],
        });
      } else {
        formattedContents.push({
          role: 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add audio part + prompt
    formattedContents.push({
      role: 'user',
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: audioBase64,
          },
        },
        {
          text: `[SYSTEM INSTRUCTION: ${SYSTEM_INSTRUCTION}]\n\nThe user spoke this audio question in Tamil, English, or Sourashtra. Transcribe what they said in your mind, then answer their question as their Sourashtra tutor with: 1) Sourashtra in Tamil script & English phonetics, 2) Tamil meaning/explanation, 3) English meaning & breakdown.`,
        },
      ],
    });

    for (const model of FALLBACK_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 16000);

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: formattedContents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
            signal: controller.signal,
          }
        );
        clearTimeout(timeoutId);

        const data = await response.json();
        if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (err: any) {
        console.warn(`Gemini audio model ${model} error:`, err?.message);
      }
    }

    return `நமஸ்காரு! I heard your voice message but couldn't process the audio cleanly. Please try speaking a bit closer to the microphone or typing your question!`;
  }

  /**
   * Intelligently parses a structured word entry from an AI tutor response
   */
  static parseWordFromResponse(
    aiResponse: string,
    userQuery: string
  ): {
    sourashtra: string;
    tamil: string;
    english: string;
    pronunciation: string;
    category: string;
    exampleSourashtra?: string;
    exampleTamil?: string;
    exampleEnglish?: string;
  } {
    let sourashtra = '';
    let tamil = '';
    let english = userQuery.replace(/how to say|what is|translate|meaning of|in sourashtra/gi, '').trim();
    let pronunciation = '';

    const lines = aiResponse.split('\n');

    for (const line of lines) {
      const clean = line.replace(/[*_#`]/g, '').trim();

      // Look for Sourashtra phrase
      if ((clean.includes('Sourashtra') || clean.includes('சௌராஷ்ட்ர')) && !sourashtra) {
        const parts = clean.split(/[:：-]/);
        if (parts.length > 1 && parts[1].trim()) {
          sourashtra = parts[1].trim();
        }
      }

      // Look for Tamil meaning
      if ((clean.includes('Tamil Meaning') || clean.includes('தமிழ் அர்த்தம்') || clean.includes('தமிழ் விளக்கம்')) && !tamil) {
        const parts = clean.split(/[:：-]/);
        if (parts.length > 1 && parts[1].trim()) {
          tamil = parts[1].trim();
        }
      }

      // Look for Pronunciation
      if ((clean.includes('Pronunciation') || clean.includes('ஒலிப்பு') || clean.includes('Phonetic')) && !pronunciation) {
        const parts = clean.split(/[:：-]/);
        if (parts.length > 1 && parts[1].trim()) {
          pronunciation = parts[1].trim();
        }
      }
    }

    // Fallback extraction from Tamil Unicode characters in response
    if (!sourashtra) {
      const tamilMatches = aiResponse.match(/[\u0B80-\u0BFF\s]+/g);
      if (tamilMatches && tamilMatches.length > 0) {
        sourashtra = tamilMatches[0].trim().slice(0, 60);
      } else {
        sourashtra = userQuery;
      }
    }

    if (!tamil) {
      tamil = userQuery;
    }

    if (!pronunciation) {
      pronunciation = sourashtra;
    }

    return {
      sourashtra,
      tamil,
      english: english || userQuery,
      pronunciation,
      category: 'AI Learned',
    };
  }
}

