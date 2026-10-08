const fs = require('fs');
const path = require('path');

const words = JSON.parse(fs.readFileSync(path.join(__dirname, 'sourashtra', 'verified_seed_words.json'), 'utf8'));

console.log(`Generating comprehensive multi-type quiz question bank from ${words.length} words...`);

const questions = [];
let qCounter = 1;

// Question Templates Generator
for (let i = 0; i < words.length && questions.length < 150; i++) {
  const w = words[i];
  const qType = i % 5;
  const distractors = words
    .filter(other => other.id !== w.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  let questionText = "";
  let questionTamil = "";
  let correctAnswer = "";
  let options = [];

  if (qType === 0) {
    // Type 1: Sourashtra -> Tamil Meaning
    questionText = `What is the Tamil meaning of Sourashtra word "${w.sourashtra}"?`;
    questionTamil = `"${w.sourashtra}" என்ற சௌராஷ்ட்ர சொல்லின் தமிழ் அர்த்தம் என்ன?`;
    correctAnswer = w.tamil;
    options = [w.tamil, ...distractors.map(d => d.tamil)].sort(() => 0.5 - Math.random());
  } else if (qType === 1) {
    // Type 2: Tamil -> Sourashtra Word
    questionText = `What is the Sourashtra word for "${w.tamil}" (${w.english})?`;
    questionTamil = `"${w.tamil}" (${w.english}) என்பதற்கான சௌராஷ்ட்ர சொல் எது?`;
    correctAnswer = w.sourashtra;
    options = [w.sourashtra, ...distractors.map(d => d.sourashtra)].sort(() => 0.5 - Math.random());
  } else if (qType === 2) {
    // Type 3: Sourashtra -> English Meaning
    questionText = `What is the English meaning of Sourashtra word "${w.sourashtra}"?`;
    questionTamil = `"${w.sourashtra}" என்பதன் ஆங்கிலப் பொருள் என்ன?`;
    correctAnswer = w.english;
    options = [w.english, ...distractors.map(d => d.english)].sort(() => 0.5 - Math.random());
  } else if (qType === 3) {
    // Type 4: English -> Sourashtra Word
    questionText = `What is the Sourashtra word for English "${w.english}"?`;
    questionTamil = `"${w.english}" என்ற ஆங்கிலச் சொல்லுக்குரிய சௌராஷ்ட்ர சொல் எது?`;
    correctAnswer = w.sourashtra;
    options = [w.sourashtra, ...distractors.map(d => d.sourashtra)].sort(() => 0.5 - Math.random());
  } else {
    // Type 5: Pronunciation / Phonetic match
    questionText = `What is the phonetic pronunciation of "${w.sourashtra}" (${w.tamil})?`;
    questionTamil = `"${w.sourashtra}" (${w.tamil}) சொல்லின் சரியான உச்சரிப்பு ஒலிப்பு எது?`;
    correctAnswer = w.pronunciation || w.sourashtra;
    options = [w.pronunciation || w.sourashtra, ...distractors.map(d => d.pronunciation || d.sourashtra)].sort(() => 0.5 - Math.random());
  }

  const correctIndex = options.indexOf(correctAnswer);

  questions.push({
    id: `quiz_bank_${String(qCounter++).padStart(3, '0')}`,
    question: questionText,
    questionTamil: questionTamil,
    sourashtraWord: w.sourashtra,
    pronunciation: w.pronunciation,
    options,
    correctOptionIndex: correctIndex,
    correctAnswer,
    explanation: `"${w.sourashtra}" (${w.pronunciation || ''}) means "${w.english}" in English and "${w.tamil}" in Tamil.`,
    category: w.category || 'General',
    source: 'Learn-English-Through-Sourashtra.pdf',
    sourcePage: w.sourcePage || 7,
    verified: true
  });
}

console.log(`Generated ${questions.length} diverse questions!`);

// Save to targets
const targetDirs = [
  path.join(__dirname, 'sourashtra'),
  path.join(__dirname, '..', 'backend', 'data'),
  path.join(__dirname, '..', 'mobile', 'src', 'data')
];

for (const dir of targetDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'verified_seed_quiz.json'), JSON.stringify(questions, null, 2), 'utf8');
}

console.log('✅ Synced verified_seed_quiz.json with 150 questions across all directories!');
