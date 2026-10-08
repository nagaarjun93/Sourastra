# Sourashtra Learn (SOURASTRA)
### Learn • Practice • Grow | சௌராஷ்ட்ர பாஷை கற்போம்

<p align="center">
  <img src="mobile/assets/app_logo.png" alt="Sourashtra Learn Logo" width="180" />
</p>

A modern, comprehensive, 4-language digital learning ecosystem for the **Sourashtra language (சௌராஷ்ட்ர பாஷை)**, connecting native heritage with modern interactive mobile learning.

---

## 🌟 Key Features

### 📖 1. 11,488+ Master Words Dictionary (முழு அகராதி)
- Complete 4-language support: **Sourashtra Script (ꢱꣁꢬꢵꢰ꣄ꢜ꣄ꢬ), Tamil (தமிழ்), Tanglish (Tamil in English), and English**.
- 2,350+ authentic contextual example sentences across 54 life categories.
- Real-time voice audio pronunciation.
- Fast virtualized search (FlatList) with 60 FPS performance.

### 🔱 2. Gothru & Lineage Finder (கோத்ரங்கள் & குடும்பப் பெயர்கள்)
- **65 Rishi Gotras & 1,129 Ancestral Family Surnames**.
- Instant Lineage Search: Type your family surname (e.g. *Kesavun*, *Sengun*, *Aathin*) to instantly discover your Rishi Gotra and related lineages.

### 🧵 3. Weaving & Cultural Heritage (நெசவு & மரபு)
- **Handloom & Weaving (கைத்தறி நெசவு):** 32 traditional handloom terms with full contextual usage sentences.
- **Marriage & Rituals (திருமணம் & சடங்குகள்):** 93 ceremonial and cultural terms with audio.
- **Classical Literature (ராமாயண இலக்கியம்):** 644 classical Ramayanam literary vocabulary words.

### 🦉 4. Duolingo-Style Interactive Stories (உரையாடல் கதைகள்)
- Real-life dialogue scenarios with audio, checkpoints, character speech, and comprehension quizzes.
- Sequential progression unlocking system.

### 📅 5. 14-Day Learning Challenge (14-நாள் சவால்)
- Structured beginner pathway covering root words, verbs, household objects, shopping, and everyday dialogues.
- Level 1 Final Assessment gating access to Level 2 intermediate stories.

### 🎧 6. Hands-Free Audio Podcast Player (தானியங்கி ஆடியோ முறை)
- Continuous listening player: Speaks Sourashtra -> Pauses -> Speaks Tamil translation automatically.
- Sleep timer, speed controls, and repeat modes.

### 🤖 7. Google Gemini AI Tutor (சௌராஷ்ட்ர ஆசிரியர்)
- Conversational AI tutor answering queries in Tamil, Tanglish, and English with one-tap dictionary saving.

### 📜 8. Junnavaachu Proverbs & Wisdom (பழமொழிகள்)
- Authentic ancestral proverbs with cultural explanations, audio, and social sharing.

---

## 📁 Project Structure

```
sourashtra-learn/
├── mobile/                   # React Native (Expo) Mobile & Web App
│   ├── assets/               # Official App Logo, Icons, Splash
│   ├── src/
│   │   ├── components/       # Header, Cards, AudioButton, Badges
│   │   ├── constants/        # Theme & API config
│   │   ├── data/             # Master 11,488 Words, Gotras, Heritage, Stories
│   │   ├── navigation/       # AppNavigator (Tabs & Stacks)
│   │   ├── screens/          # Home, Dictionary, GotraFinder, Heritage, etc.
│   │   ├── services/         # ProgressService, GeminiService, SpeechService
│   │   └── utils/            # Tanglish converter & helpers
│   ├── app.json              # Expo configuration
│   └── vercel.json           # Vercel Web deployment config
├── backend/                  # Node.js Express REST API
│   ├── data/                 # Verified seed datasets
│   └── server.js             # API routes (/api/words, /api/quiz, etc.)
└── README.md
```

---

## 🚀 Quick Start Guide

### 📱 Running the Mobile App
```bash
cd mobile
npm install
npx expo start
```
- Scan the QR code using **Expo Go** on Android or iOS.
- Press `w` to run in the web browser.

### 🖥️ Running the Backend Server
```bash
cd backend
npm install
node server.js
```
Runs at `http://localhost:8080`.

---

## 📜 License
Open source for language preservation and community education.
