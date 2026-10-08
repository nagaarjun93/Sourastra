const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// --- Load Verified Datasets ---
let words = [];
let lessons = [];
let quizQuestions = [];

function loadData() {
  const possibleWordPaths = [
    path.join(__dirname, '..', 'data', 'sourashtra', 'verified_seed_words.json'),
    path.join(__dirname, 'src', 'main', 'resources', 'data', 'sourashtra', 'verified_seed_words.json'),
    path.join(__dirname, 'data', 'verified_seed_words.json')
  ];

  const possibleLessonPaths = [
    path.join(__dirname, '..', 'data', 'sourashtra', 'verified_seed_lessons.json'),
    path.join(__dirname, 'src', 'main', 'resources', 'data', 'sourashtra', 'verified_seed_lessons.json')
  ];

  const possibleQuizPaths = [
    path.join(__dirname, '..', 'data', 'sourashtra', 'verified_seed_quiz.json'),
    path.join(__dirname, 'src', 'main', 'resources', 'data', 'sourashtra', 'verified_seed_quiz.json')
  ];

  for (const p of possibleWordPaths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 10) {
      try {
        words = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`Loaded ${words.length} verified words from ${p}`);
        break;
      } catch (err) {
        console.warn(`Error reading words from ${p}:`, err.message);
      }
    }
  }

  for (const p of possibleLessonPaths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 10) {
      try {
        lessons = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`Loaded ${lessons.length} verified lessons from ${p}`);
        break;
      } catch (err) {
        console.warn(`Error reading lessons from ${p}:`, err.message);
      }
    }
  }

  for (const p of possibleQuizPaths) {
    if (fs.existsSync(p) && fs.statSync(p).size > 10) {
      try {
        quizQuestions = JSON.parse(fs.readFileSync(p, 'utf8'));
        console.log(`Loaded ${quizQuestions.length} verified quiz questions from ${p}`);
        break;
      } catch (err) {
        console.warn(`Error reading quiz from ${p}:`, err.message);
      }
    }
  }
}

loadData();

// --- 1. Health API ---
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Operation successful',
    data: {
      status: 'UP',
      app: 'Sourashtra Learn Backend (Node.js Express)',
      version: '2.0.0',
      wordsCount: words.length,
      lessonsCount: lessons.length,
      quizCount: quizQuestions.length
    },
    timestamp: Date.now()
  });
});

// --- 2. Words / Dictionary APIs ---
app.get('/api/words', (req, res) => {
  res.json({
    success: true,
    message: 'Operation successful',
    data: words,
    timestamp: Date.now()
  });
});

app.get('/api/words/search', (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  if (!q) {
    return res.json({ success: true, data: words });
  }

  const results = words.filter(w => 
    (w.sourashtra && w.sourashtra.toLowerCase().includes(q)) ||
    (w.tamil && w.tamil.toLowerCase().includes(q)) ||
    (w.english && w.english.toLowerCase().includes(q)) ||
    (w.pronunciation && w.pronunciation.toLowerCase().includes(q))
  );

  res.json({
    success: true,
    message: 'Operation successful',
    data: results,
    timestamp: Date.now()
  });
});

app.get('/api/words/category/:category', (req, res) => {
  const cat = req.params.category.toLowerCase();
  const filtered = words.filter(w => w.category && w.category.toLowerCase() === cat);
  res.json({
    success: true,
    message: 'Operation successful',
    data: filtered,
    timestamp: Date.now()
  });
});

app.post('/api/words/custom', (req, res) => {
  const newWord = req.body;
  if (!newWord || !newWord.sourashtra || !newWord.tamil) {
    return res.status(400).json({ success: false, message: 'Invalid word payload' });
  }

  const exists = words.some(w => 
    w.sourashtra.toLowerCase() === newWord.sourashtra.toLowerCase() ||
    (w.english && newWord.english && w.english.toLowerCase() === newWord.english.toLowerCase())
  );

  if (!exists) {
    const wordEntry = {
      id: newWord.id || `custom_${Date.now()}`,
      sourashtra: newWord.sourashtra,
      tamil: newWord.tamil,
      english: newWord.english || '',
      pronunciation: newWord.pronunciation || newWord.sourashtra,
      category: newWord.category || 'AI Learned',
      source: newWord.source || 'Google Gemini AI Live Tutor',
      sourcePage: 'AI',
      verified: true,
      examples: newWord.examples || []
    };
    words.unshift(wordEntry);
    console.log(`[AI Learn] Added new custom word: ${wordEntry.sourashtra} (${wordEntry.english})`);
  }

  res.json({
    success: true,
    message: 'Word saved to dictionary successfully',
    data: words
  });
});

// --- 3. Lessons APIs ---
app.get('/api/lessons', (req, res) => {
  res.json({
    success: true,
    message: 'Operation successful',
    data: lessons,
    timestamp: Date.now()
  });
});

app.get('/api/lessons/:id', (req, res) => {
  const lesson = lessons.find(l => l.id === req.params.id);
  if (!lesson) {
    return res.status(404).json({ success: false, message: 'Lesson not found' });
  }
  res.json({
    success: true,
    message: 'Operation successful',
    data: lesson,
    timestamp: Date.now()
  });
});

// --- Dynamic Quiz Generator Engine ---
function generateDynamicQuiz(count = 10, category = '') {
  let pool = words.filter(w => w.sourashtra && w.tamil && w.english);
  if (category) {
    const catFiltered = pool.filter(w => w.category && w.category.toLowerCase() === category.toLowerCase());
    if (catFiltered.length >= 4) pool = catFiltered;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, shuffled.length));

  return selected.map((w, idx) => {
    const otherWords = pool.filter(ow => ow.id !== w.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const qType = idx % 5;
    let questionText = "";
    let questionTamil = "";
    let correctAnswer = "";
    let options = [];

    if (qType === 0) {
      // Sourashtra -> Tamil
      questionText = `What is the Tamil meaning of Sourashtra word "${w.sourashtra}"?`;
      questionTamil = `"${w.sourashtra}" என்ற சௌராஷ்ட்ர சொல்லின் தமிழ் அர்த்தம் என்ன?`;
      correctAnswer = w.tamil;
      options = [w.tamil, ...shuffledOthers.map(o => o.tamil)].sort(() => 0.5 - Math.random());
    } else if (qType === 1) {
      // Tamil -> Sourashtra
      questionText = `What is the Sourashtra word for "${w.tamil}" (${w.english})?`;
      questionTamil = `"${w.tamil}" (${w.english}) என்பதற்கான சௌராஷ்ட்ர சொல் எது?`;
      correctAnswer = w.sourashtra;
      options = [w.sourashtra, ...shuffledOthers.map(o => o.sourashtra)].sort(() => 0.5 - Math.random());
    } else if (qType === 2) {
      // Sourashtra -> English
      questionText = `What is the English meaning of Sourashtra word "${w.sourashtra}"?`;
      questionTamil = `"${w.sourashtra}" என்பதன் ஆங்கிலப் பொருள் என்ன?`;
      correctAnswer = w.english;
      options = [w.english, ...shuffledOthers.map(o => o.english)].sort(() => 0.5 - Math.random());
    } else if (qType === 3) {
      // English -> Sourashtra
      questionText = `What is the Sourashtra word for English "${w.english}"?`;
      questionTamil = `"${w.english}" என்ற ஆங்கிலச் சொல்லுக்குரிய சௌராஷ்ட்ர சொல் எது?`;
      correctAnswer = w.sourashtra;
      options = [w.sourashtra, ...shuffledOthers.map(o => o.sourashtra)].sort(() => 0.5 - Math.random());
    } else {
      // Pronunciation
      questionText = `What is the correct phonetic pronunciation of "${w.sourashtra}"?`;
      questionTamil = `"${w.sourashtra}" சொல்லின் சரியான உச்சரிப்பு ஒலிப்பு எது?`;
      correctAnswer = w.pronunciation || w.sourashtra;
      options = [w.pronunciation || w.sourashtra, ...shuffledOthers.map(o => o.pronunciation || o.sourashtra)].sort(() => 0.5 - Math.random());
    }

    const correctIndex = options.indexOf(correctAnswer);

    return {
      id: `dyn_quiz_${w.id}_${idx}`,
      question: questionText,
      questionTamil: questionTamil,
      sourashtraWord: w.sourashtra,
      pronunciation: w.pronunciation,
      options,
      correctOptionIndex: correctIndex,
      correctAnswer,
      explanation: `"${w.sourashtra}" (${w.pronunciation || ''}) means "${w.english}" in English and "${w.tamil}" in Tamil.`,
      category: w.category || 'General',
      source: w.source || 'Learn-English-Through-Sourashtra.pdf',
      sourcePage: w.sourcePage || 7,
      verified: true
    };
  });
}

// --- 4. Quiz APIs ---
app.get('/api/quiz', (req, res) => {
  const isDynamic = req.query.dynamic === 'true' || req.query.fresh === 'true';
  const count = parseInt(req.query.count) || 10;
  const category = (req.query.category || '').trim().toLowerCase();

  if (isDynamic) {
    const dynamicQuestions = generateDynamicQuiz(count, category);
    return res.json({ success: true, message: 'Dynamic quiz generated', data: dynamicQuestions });
  }

  if (category) {
    const filtered = quizQuestions.filter(q => q.category && q.category.toLowerCase() === category);
    return res.json({ success: true, message: 'Operation successful', data: filtered });
  }
  res.json({
    success: true,
    message: 'Operation successful',
    data: quizQuestions,
    timestamp: Date.now()
  });
});

app.get('/api/quiz/generate', (req, res) => {
  const count = parseInt(req.query.count) || 10;
  const category = (req.query.category || '').trim();
  const generated = generateDynamicQuiz(count, category);
  res.json({
    success: true,
    message: 'Dynamic quiz generated successfully',
    data: generated,
    timestamp: Date.now()
  });
});

app.post('/api/quiz/evaluate', (req, res) => {
  const answers = req.body.answers || {};
  let correctCount = 0;
  let evaluatedCount = 0;

  for (const q of quizQuestions) {
    if (answers[q.id] !== undefined) {
      evaluatedCount++;
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    }
  }

  const total = evaluatedCount > 0 ? evaluatedCount : quizQuestions.length;
  const percentage = total > 0 ? (correctCount / total) * 100 : 0;
  const feedback = percentage >= 80 ? 'Excellent! You are mastering verified Sourashtra!' :
                   percentage >= 50 ? 'Good effort! Keep practicing the lessons.' :
                   'Keep practicing with verified Sourashtra dictionary lessons.';

  res.json({
    success: true,
    message: 'Operation successful',
    data: {
      totalQuestions: total,
      correctCount,
      scorePercentage: Math.round(percentage * 10) / 10,
      feedback
    },
    timestamp: Date.now()
  });
});

// --- 5. AI Tutor Powered by Google Gemini AI & Textbook RAG ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.8-flash'];

async function callGeminiAI(userPrompt, conversationHistory = []) {
  if (!GEMINI_API_KEY) return null;

  const systemPrompt = `You are the ultimate Native Sourashtra Language AI Tutor & Translator.
Your mission is to teach and answer questions about Sourashtra language (சௌராஷ்ட்ர பாஷை), translating accurately between Sourashtra, Tamil, and English.
Guidelines:
1. Always provide Sourashtra in Tamil script (e.g. "துமி கொந்தே ஜாஸ்?") and English phonetic pronunciation (e.g. "Dhumi konthe jaas?").
2. Provide the clear Tamil meaning and English translation.
3. Provide word-by-word breakdown and everyday usage example where helpful.
4. Keep the tone warm, welcoming, respectful, and educational.`;

  const contents = [
    { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userPrompt}` }] }
  ];

  for (const model of GEMINI_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents }),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      const data = await response.json();
      if (response.ok && data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return {
          answer: data.candidates[0].content.parts[0].text,
          modelUsed: model,
          provider: 'Google Gemini AI'
        };
      }
    } catch (err) {
      console.warn(`Gemini model ${model} attempt failed:`, err.message);
    }
  }
  return null;
}

app.post('/api/ai/ask', async (req, res) => {
  const query = (req.body.question || req.body.prompt || req.body.text || '').trim();
  
  if (!query) {
    return res.json({
      success: true,
      data: {
        answer: 'I am your Sourashtra AI Tutor. Please ask any word, phrase, or question in Tamil, English, or Sourashtra!',
        sources: []
      }
    });
  }

  // 1. First, attempt real-time Gemini AI generation
  try {
    const geminiResult = await callGeminiAI(query);
    if (geminiResult && geminiResult.answer) {
      return res.json({
        success: true,
        data: {
          answer: geminiResult.answer,
          model: geminiResult.modelUsed,
          provider: geminiResult.provider,
          sources: [{ source: 'Google Gemini 2.0 / 3.0 Multilingual AI + 160-page Verified Syllabus', sourcePage: 'AI' }]
        },
        timestamp: Date.now()
      });
    }
  } catch (err) {
    console.warn('Gemini AI call error, falling back to local RAG:', err.message);
  }

  // 2. Fallback to Local RAG Dataset matching
  const matched = [];
  const pages = new Set();
  const sources = [];
  const queryLower = query.toLowerCase();
  const queryTokens = queryLower.split(/[\s,?.!]+/).filter(t => t.length > 1);

  for (const w of words) {
    const s = (w.sourashtra || '').toLowerCase();
    const t = (w.tamil || '').toLowerCase();
    const e = (w.english || '').toLowerCase();
    const p = (w.pronunciation || '').toLowerCase();

    const directMatch = queryLower.includes(s) || (s && s.includes(queryLower)) ||
                        queryLower.includes(t) || (t && t.includes(queryLower)) ||
                        queryLower.includes(e) || (e && e.includes(queryLower)) ||
                        (p && (queryLower.includes(p) || p.includes(queryLower)));

    const tokenMatch = queryTokens.some(tok => 
      (s && s.includes(tok)) || (t && t.includes(tok)) || (e && e.includes(tok)) || (p && p.includes(tok))
    );

    if (directMatch || tokenMatch) {
      matched.push(w);
      if (w.sourcePage && !pages.has(w.sourcePage)) {
        pages.add(w.sourcePage);
        sources.push({ source: w.source || 'Learn-English-Through-Sourashtra.pdf', sourcePage: w.sourcePage });
      }
    }
  }

  if (matched.length === 0) {
    return res.json({
      success: true,
      data: {
        answer: 'I am your Sourashtra Tutor. Ask me any word, numbers, or everyday phrases in Tamil or English!',
        sources: []
      }
    });
  }

  let answerText = "Based on the verified Sourashtra knowledge base:\n\n";
  for (const w of matched.slice(0, 6)) {
    answerText += `• **Sourashtra:** ${w.sourashtra}\n`;
    answerText += `  **Tamil:** ${w.tamil}\n`;
    answerText += `  **English:** ${w.english}\n`;
    if (w.pronunciation) answerText += `  **Pronunciation:** ${w.pronunciation}\n`;
    if (w.examples && w.examples.length > 0) {
      const ex = w.examples[0];
      answerText += `  *Example:* ${ex.sourashtra} — ${ex.tamil} (${ex.english})\n`;
    }
    answerText += `\n`;
  }

  res.json({
    success: true,
    data: {
      answer: answerText.trim(),
      sources
    },
    timestamp: Date.now()
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Sourashtra Learn Node.js Backend Server`);
  console.log(`📡 Listening live on http://localhost:${PORT}`);
  console.log(`📖 Total Verified Words: ${words.length}`);
  console.log(`📚 Total Lessons: ${lessons.length}`);
  console.log(`❓ Total Quiz Questions: ${quizQuestions.length}`);
  console.log(`=========================================`);
});
