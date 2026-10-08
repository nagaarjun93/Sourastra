const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'sourashtra');
fs.mkdirSync(dataDir, { recursive: true });

const verifiedWords = [
  // Page 7 - Essential Action Verbs
  {
    "id": "w_001",
    "sourashtra": "Deko",
    "tamil": "பார்",
    "english": "See",
    "pronunciation": "De-ko",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "The Deko",
        "tamil": "அதைப் பார்",
        "english": "See that"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_002",
    "sourashtra": "Aavo",
    "tamil": "வா",
    "english": "Come",
    "pronunciation": "Aa-vo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Gher Aavo",
        "tamil": "வீட்டுக்கு வா",
        "english": "Come home"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_003",
    "sourashtra": "Jaavo",
    "tamil": "போ",
    "english": "Go",
    "pronunciation": "Jaa-vo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Aata Jaavo",
        "tamil": "இப்போது போ",
        "english": "Go now"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_004",
    "sourashtra": "Khaavo",
    "tamil": "சாப்பிடு",
    "english": "Eat",
    "pronunciation": "Khaa-vo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Bhaath Khaavo",
        "tamil": "சாதம் சாப்பிடு",
        "english": "Eat rice"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_005",
    "sourashtra": "Piyo",
    "tamil": "குடி",
    "english": "Drink",
    "pronunciation": "Pi-yo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Haal Piyo",
        "tamil": "தண்ணீர் குடி",
        "english": "Drink water"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_006",
    "sourashtra": "Diye",
    "tamil": "கொடு",
    "english": "Give",
    "pronunciation": "Di-ye",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Ropiyo Diye",
        "tamil": "பணம் கொடு",
        "english": "Give money"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_007",
    "sourashtra": "Ghevo",
    "tamil": "எடு",
    "english": "Take",
    "pronunciation": "Ghe-vo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Pusthak Ghevo",
        "tamil": "புத்தகத்தை எடு",
        "english": "Take the book"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_008",
    "sourashtra": "Saango",
    "tamil": "சொல்",
    "english": "Say / Tell",
    "pronunciation": "Saan-go",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Khara Saango",
        "tamil": "உண்மையைச் சொல்",
        "english": "Tell the truth"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_009",
    "sourashtra": "Aiko",
    "tamil": "கேள்",
    "english": "Listen / Hear",
    "pronunciation": "Ai-ko",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Mho Aiko",
        "tamil": "நான் சொல்வதைக் கேள்",
        "english": "Listen to me"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "w_010",
    "sourashtra": "Dhovo",
    "tamil": "ஓடு",
    "english": "Run",
    "pronunciation": "Dho-vo",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Vegam Dhovo",
        "tamil": "வேகமாக ஓடு",
        "english": "Run fast"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },

  // Page 8 - Action Verbs Continued
  {
    "id": "w_011",
    "sourashtra": "Vaacho",
    "tamil": "படி",
    "english": "Read",
    "pronunciation": "Vaa-cho",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Paadam Vaacho",
        "tamil": "பாடம் படி",
        "english": "Read lesson"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 8,
    "verified": true
  },
  {
    "id": "w_012",
    "sourashtra": "Liko",
    "tamil": "எழுது",
    "english": "Write",
    "pronunciation": "Li-ko",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Aksharu Liko",
        "tamil": "எழுத்து எழுது",
        "english": "Write letters"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 8,
    "verified": true
  },
  {
    "id": "w_013",
    "sourashtra": "Nidro",
    "tamil": "தூங்கு",
    "english": "Sleep",
    "pronunciation": "Ni-dro",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Ratri Nidro",
        "tamil": "இரவில் தூங்கு",
        "english": "Sleep at night"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 8,
    "verified": true
  },
  {
    "id": "w_014",
    "sourashtra": "Baiso",
    "tamil": "உட்கார்",
    "english": "Sit",
    "pronunciation": "Bai-so",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Hetu Baiso",
        "tamil": "கீழே உட்கார்",
        "english": "Sit down"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 8,
    "verified": true
  },
  {
    "id": "w_015",
    "sourashtra": "Utto",
    "tamil": "எழுந்திரு",
    "english": "Stand / Rise",
    "pronunciation": "Ut-to",
    "category": "Verbs",
    "examples": [
      {
        "sourashtra": "Upari Utto",
        "tamil": "மேலே எழுந்திரு",
        "english": "Stand up"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 8,
    "verified": true
  },

  // Page 24 - Common Nouns & Objects
  {
    "id": "w_016",
    "sourashtra": "Haal",
    "tamil": "தண்ணீர்",
    "english": "Water",
    "pronunciation": "Haal",
    "category": "Nouns",
    "examples": [
      {
        "sourashtra": "Thanno Haal",
        "tamil": "குளிர்ந்த தண்ணீர்",
        "english": "Cold water"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_017",
    "sourashtra": "Dhudhu",
    "tamil": "பால்",
    "english": "Milk",
    "pronunciation": "Dhu-dhu",
    "category": "Nouns",
    "examples": [
      {
        "sourashtra": "Garom Dhudhu",
        "tamil": "சூடான பால்",
        "english": "Hot milk"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_018",
    "sourashtra": "Gher",
    "tamil": "வீடு",
    "english": "House",
    "pronunciation": "Gher",
    "category": "Nouns",
    "examples": [
      {
        "sourashtra": "Amko Gher",
        "tamil": "எங்கள் வீடு",
        "english": "Our house"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_019",
    "sourashtra": "Pusthak",
    "tamil": "புத்தகம்",
    "english": "Book",
    "pronunciation": "Pus-thak",
    "category": "Nouns",
    "examples": [
      {
        "sourashtra": "Soru Pusthak",
        "tamil": "நல்ல புத்தகம்",
        "english": "Good book"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_020",
    "sourashtra": "Ropiyo",
    "tamil": "பணம்",
    "english": "Money",
    "pronunciation": "Ro-pi-yo",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_021",
    "sourashtra": "Suriyo",
    "tamil": "சூரியன்",
    "english": "Sun",
    "pronunciation": "Su-ri-yo",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_022",
    "sourashtra": "Chondro",
    "tamil": "சந்திரன்",
    "english": "Moon",
    "pronunciation": "Chon-dro",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_023",
    "sourashtra": "Aakhi",
    "tamil": "கண்",
    "english": "Eye",
    "pronunciation": "Aa-khi",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_024",
    "sourashtra": "Haath",
    "tamil": "கை",
    "english": "Hand",
    "pronunciation": "Haath",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "w_025",
    "sourashtra": "Thembo",
    "tamil": "கால்",
    "english": "Leg",
    "pronunciation": "Them-bo",
    "category": "Nouns",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },

  // Page 43 - Family & Relationships
  {
    "id": "w_026",
    "sourashtra": "Baapu",
    "tamil": "அப்பா",
    "english": "Father",
    "pronunciation": "Baa-pu",
    "category": "Family",
    "examples": [
      {
        "sourashtra": "Mho Baapu",
        "tamil": "என் அப்பா",
        "english": "My father"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "w_027",
    "sourashtra": "Amma",
    "tamil": "அம்மா",
    "english": "Mother",
    "pronunciation": "Am-ma",
    "category": "Family",
    "examples": [
      {
        "sourashtra": "Mho Amma",
        "tamil": "என் அம்மா",
        "english": "My mother"
      }
    ],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "w_028",
    "sourashtra": "Dhaadha",
    "tamil": "அண்ணன்",
    "english": "Elder Brother",
    "pronunciation": "Dhaa-dha",
    "category": "Family",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "w_029",
    "sourashtra": "Bhaau",
    "tamil": "தம்பி",
    "english": "Younger Brother",
    "pronunciation": "Bhaa-u",
    "category": "Family",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "w_030",
    "sourashtra": "Baayi",
    "tamil": "அக்காள்",
    "english": "Elder Sister",
    "pronunciation": "Baa-yi",
    "category": "Family",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "w_031",
    "sourashtra": "Bohini",
    "tamil": "தங்கை",
    "english": "Younger Sister",
    "pronunciation": "Bo-hi-ni",
    "category": "Family",
    "examples": [],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  }
];

const verifiedLessons = [
  {
    "id": "les_001",
    "lessonNumber": 1,
    "title": "Essential Verbs & Actions",
    "titleTamil": "அடிப்படை வினைச்சொற்கள்",
    "description": "Learn foundational daily action verbs in Sourashtra with Tamil and English meanings.",
    "category": "Verbs",
    "wordIds": ["w_001", "w_002", "w_003", "w_004", "w_005", "w_006", "w_007", "w_008", "w_009", "w_010"],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "les_002",
    "lessonNumber": 2,
    "title": "Everyday Objects & Nature",
    "titleTamil": "அன்றாடப் பொருட்கள் மற்றும் இயற்கை",
    "description": "Common nouns for home, environment, body parts, and nature.",
    "category": "Nouns",
    "wordIds": ["w_016", "w_017", "w_018", "w_019", "w_020", "w_021", "w_022", "w_023", "w_024", "w_025"],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "les_003",
    "lessonNumber": 3,
    "title": "Family & Relationships",
    "titleTamil": "குடும்ப உறவுகள்",
    "description": "Learn terms for parents, siblings, and relations in Sourashtra.",
    "category": "Family",
    "wordIds": ["w_026", "w_027", "w_028", "w_029", "w_030", "w_031"],
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  }
];

const verifiedQuiz = [
  {
    "id": "quiz_001",
    "question": "What is the Sourashtra word for 'Mother' (அம்மா)?",
    "questionTamil": "'அம்மா' என்பதற்கான சௌராஷ்ட்ர சொல் எது?",
    "options": ["Amma", "Baapu", "Bhaau", "Baayi"],
    "correctOptionIndex": 0,
    "explanation": "According to page 43 of Learn-English-Through-Sourashtra.pdf, 'Amma' means Mother (அம்மா).",
    "category": "Family",
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  },
  {
    "id": "quiz_002",
    "question": "What is the English meaning of the Sourashtra word 'Deko' (பார்)?",
    "questionTamil": "'Deko' என்ற சௌராஷ்ட்ர சொல்லின் பொருள் என்ன?",
    "options": ["Come", "See", "Go", "Eat"],
    "correctOptionIndex": 1,
    "explanation": "According to page 7 of the PDF, 'Deko' means 'See' / 'பார்'.",
    "category": "Verbs",
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "quiz_003",
    "question": "Which Sourashtra word means 'Water' (தண்ணீர்)?",
    "questionTamil": "'தண்ணீர்' என்பதன் சௌராஷ்ட்ர சொல் எது?",
    "options": ["Dhudhu", "Haal", "Ropiyo", "Gher"],
    "correctOptionIndex": 1,
    "explanation": "According to page 24 of the PDF, 'Haal' means 'Water' (தண்ணீர்).",
    "category": "Nouns",
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 24,
    "verified": true
  },
  {
    "id": "quiz_004",
    "question": "What does 'Aavo' mean in Tamil?",
    "questionTamil": "'Aavo' என்ற சௌராஷ்ட்ர சொல்லின் தமிழ் அர்த்தம் என்ன?",
    "options": ["போ (Go)", "வா (Come)", "சாப்பிடு (Eat)", "தூங்கு (Sleep)"],
    "correctOptionIndex": 1,
    "explanation": "According to page 7 of the PDF, 'Aavo' corresponds to Tamil 'வா' (Come).",
    "category": "Verbs",
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 7,
    "verified": true
  },
  {
    "id": "quiz_005",
    "question": "What is the Sourashtra word for 'Father' (அப்பா)?",
    "questionTamil": "'அப்பா' என்பதற்கான சௌராஷ்ட்ர சொல் எது?",
    "options": ["Baapu", "Dhaadha", "Bhaau", "Mithru"],
    "correctOptionIndex": 0,
    "explanation": "According to page 43 of the PDF, 'Baapu' means Father (அப்பா).",
    "category": "Family",
    "source": "Learn-English-Through-Sourashtra.pdf",
    "sourcePage": 43,
    "verified": true
  }
];

fs.writeFileSync(path.join(dataDir, 'verified_seed_words.json'), JSON.stringify(verifiedWords, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'verified_seed_lessons.json'), JSON.stringify(verifiedLessons, null, 2), 'utf8');
fs.writeFileSync(path.join(dataDir, 'verified_seed_quiz.json'), JSON.stringify(verifiedQuiz, null, 2), 'utf8');

console.log('Successfully wrote verified seed data:');
console.log(' - Words:', verifiedWords.length, 'records');
console.log(' - Lessons:', verifiedLessons.length, 'records');
console.log(' - Quiz:', verifiedQuiz.length, 'records');
