const fs = require('fs');
const path = require('path');

const ALL_19_STORIES = [
  // STORY 1
  {
    id: "story_1",
    storyNumber: 1,
    title: "டீக்கடை உரையாடல்",
    tanglishTitle: "Teakkadai Uraiyaadal",
    sourashtraTitle: "சாய் துகான் மெலிவு",
    englishTitle: "At the Tea Shop",
    category: "Daily Life",
    icon: "cafe",
    xpReward: 30,
    difficulty: "Beginner",
    characters: [
      { id: "ramu", name: "ராமு (Ramu)", avatar: "👨‍💼", color: "#4F46E5" },
      { id: "krishna", name: "கிருஷ்ணன் (Krishna)", avatar: "👨‍🌾", color: "#059669" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "ramu",
        sourashtra: "நமஸ்காரு கிருஷ்ணா! துமி கெஸ்கொ அஸாஸ்?",
        pronunciation: "Namaskaru Krishna! Dhumi khesko asaasa?",
        tamil: "வணக்கம் கிருஷ்ணா! நீங்கள் எப்படி இருக்கிறீர்கள்?",
        tanglish: "Vanakkam Krishna! Neengal eppadi irukkireergal?",
        english: "Hello Krishna! How are you?"
      },
      {
        type: "dialogue",
        speaker: "krishna",
        sourashtra: "மொகொ ஆநந்துக் அஸா ராமு! துமி சாய் பிய்யாஸ்?",
        pronunciation: "Moko aanandhuk asa Ramu! Dhumi chaai biyyaasa?",
        tamil: "நான் நலமாக இருக்கிறேன் ராமு! நீங்கள் டீ குடிக்கிறீர்களா?",
        tanglish: "Naan nalamaaga irukkiraen Ramu! Neengal tea kudikkireergalaa?",
        english: "I am doing well Ramu! Will you drink tea?"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "கிருஷ்ணன் ராமுவிடம் என்ன கேட்கிறார்?",
        tanglishQuestion: "Krishna Ramuvidam enna kekkiraar?",
        englishQuestion: "What does Krishna ask Ramu?",
        options: [
          "டீ குடிக்கிறீர்களா? (Will you drink tea?)",
          "எங்கே போகிறீர்கள்? (Where are you going?)",
          "உங்கள் பெயர் என்ன? (What is your name?)"
        ],
        correctIndex: 0,
        explanation: "'துமி சாய் பிய்யாஸ்?' என்றால் 'நீங்கள் டீ குடிக்கிறீர்களா?' என்று பொருள்.",
        tanglishExplanation: "'Dhumi chaai biyyaasa?' endral 'Neengal tea kudikkireergalaa?' endru artham."
      },
      {
        type: "dialogue",
        speaker: "ramu",
        sourashtra: "ஹொவ், ஏக் கப் சாய் திய்யா!",
        pronunciation: "Hov, ek cup chaai dhiyya!",
        tamil: "ஆம், ஒரு கப் டீ கொடுங்கள்!",
        tanglish: "Aam, oru cup tea kodungal!",
        english: "Yes, please give one cup of tea!"
      },
      {
        type: "question",
        questionType: "fill_blank",
        questionText: "விடுபட்ட சொல்லை நிரப்புக:",
        tanglishQuestion: "Vidupatta sollai nirappuga:",
        promptSentence: "______, ஏக் கப் சாய் திய்யா!",
        options: [
          "ஹொவ் (Yes / ஆம்)",
          "நாஹி (No / இல்லை)",
          "காய் (What / என்ன)"
        ],
        correctIndex: 0,
        explanation: "'ஹொவ்' என்றால் சௌராஷ்ட்ராவில் 'ஆம் (Yes)' என்று பொருள்.",
        tanglishExplanation: "'Hov' endral Sourashtra-vil 'Aam (Yes)' endru artham."
      },
      {
        type: "dialogue",
        speaker: "krishna",
        sourashtra: "துமி சொஜ்ஞொ க்கொனொய்?",
        pronunciation: "Dhumi sojjno khonoi?",
        tamil: "நீங்கள் சாப்பிட்டீர்களா?",
        tanglish: "Neengal saappitteergalaa?",
        english: "Have you eaten lunch/food?"
      },
      {
        type: "dialogue",
        speaker: "ramu",
        sourashtra: "ஹொவ், மீ க்காதோஸ்! தன்யவாத்³!",
        pronunciation: "Hov, mee khaadhos! Dhanyavaadh!",
        tamil: "ஆம், நான் சாப்பிட்டேன்! மிக்க நன்றி!",
        tanglish: "Aam, naan saappittaen! Mikka nandri!",
        english: "Yes, I have eaten! Thank you!"
      }
    ]
  },

  // STORY 2
  {
    id: "story_2",
    storyNumber: 2,
    title: "துணிக்கடை பேரம்",
    tanglishTitle: "Thunikkadai Baeram",
    sourashtraTitle: "லுங்குடொ துகான் மோல்",
    englishTitle: "Buying Clothes at the Market",
    category: "Shopping",
    icon: "shirt",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "meena", name: "மீனா (Meena)", avatar: "👩‍💼", color: "#D97706" },
      { id: "seller", name: "துணிக்கடைக்காரர் (Seller)", avatar: "👳‍♂️", color: "#7C3AED" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "meena",
        sourashtra: "அவொ அய்யா! யே லுங்குடொ மோல் காய்?",
        pronunciation: "Avo ayya! Ye lungudo mol kaai?",
        tamil: "வணக்கம் அண்ணா! இந்த சேலையின் விலை என்ன?",
        tanglish: "Vanakkam anna! Indha seelaiyin vilai enna?",
        english: "Hello brother! What is the price of this saree/cloth?"
      },
      {
        type: "dialogue",
        speaker: "seller",
        sourashtra: "யே லுங்குடொ மோல் பாஞ்ச்ஸொ ரூபியா அக்கா!",
        pronunciation: "Ye lungudo mol paanchso roopiya akka!",
        tamil: "இந்த சேலையின் விலை ஐந்நூறு ரூபாய் அக்கா!",
        tanglish: "Indha seelaiyin vilai ainooru roobai akka!",
        english: "The price of this cloth is 500 rupees, sister!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "'பாஞ்ச்ஸொ ரூபியா' என்றால் எத்தனை ரூபாய்?",
        tanglishQuestion: "'Paanchso roopiya' endral ethanai roobai?",
        englishQuestion: "How much is 'paanchso roopiya'?",
        options: [
          "500 ரூபாய் (500 Rupees)",
          "100 ரூபாய் (100 Rupees)",
          "50 ரூபாய் (50 Rupees)"
        ],
        correctIndex: 0,
        explanation: "'பாஞ்ச்ஸொ' என்றால் சௌராஷ்ட்ராவில் ஐந்நூறு (500) என்று பொருள்.",
        tanglishExplanation: "'Paanchso' endral Sourashtra-vil ainooru (500) endru artham."
      },
      {
        type: "dialogue",
        speaker: "meena",
        sourashtra: "மோல் சிய்யா கமி கெரா! தீன்ஸொ ரூபியாக் தெஸ்?",
        pronunciation: "Mol chiyya kami kera! Theenso roopiyaak dhes?",
        tamil: "விலை கொஞ்சம் குறையுங்கள்! முந்நூறு ரூபாய்க்கு தருவீர்களா?",
        tanglish: "Vilai konjam kuraiyungal! Munnooru roobaikku tharuveergalaa?",
        english: "Please reduce the price a bit! Will you give it for 300 rupees?"
      },
      {
        type: "question",
        questionType: "reply",
        questionText: "வியாபாரி சம்மதித்து என்ன பதில் சொல்வார்?",
        tanglishQuestion: "Viyaabaari sammadhithu enna badhil solvaar?",
        englishQuestion: "What would the seller reply politely in Sourashtra?",
        options: [
          "ஹொவ் அக்கா, கோ! (சரி அக்கா, எடுங்கள்!)",
          "நாஹி ஜா! (இல்லை போ!)",
          "காய் நவ்? (பெயர் என்ன?)"
        ],
        correctIndex: 0,
        explanation: "'ஹொவ் அக்கா, கோ!' என்றால் 'சரி அக்கா, எடுத்துக் கொள்ளுங்கள்!' என்று பொருள்.",
        tanglishExplanation: "'Hov akka, kho!' endral 'Sari akka, eduthuk kollungal!' endru artham."
      },
      {
        type: "dialogue",
        speaker: "seller",
        sourashtra: "சரி அக்கா, சிய்யா கமி கெரி சா³ர்ஸொ ரூபியாக் திய்யா!",
        pronunciation: "Sari akka, chiyya kami keri chaarso roopiyaak dhiyya!",
        tamil: "சரி அக்கா, கொஞ்சம் குறைத்து நானூறு ரூபாய்க்கு எடுத்துக் கொள்ளுங்கள்!",
        tanglish: "Sari akka, konjam kuraithu naanooru roobaikku eduthuk kollungal!",
        english: "Okay sister, with a small discount, please give 400 rupees!"
      }
    ]
  },

  // STORY 3
  {
    id: "story_3",
    storyNumber: 3,
    title: "பேருந்து பயணம்",
    tanglishTitle: "Paerundhu Payanam",
    sourashtraTitle: "பஸ் யோத்ரா",
    englishTitle: "Bus Travel to Madurai",
    category: "Travel",
    icon: "bus",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "suresh", name: "சுரேஷ் (Suresh)", avatar: "👨‍🎓", color: "#0284C7" },
      { id: "conductor", name: "நடத்துனர் (Conductor)", avatar: "👮‍♂️", color: "#EA580C" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "suresh",
        sourashtra: "அய்யா, யே பஸ் மதுரைக் ஜாஸா கா?",
        pronunciation: "Ayya, ye bus Madhuraik jaasaa kaa?",
        tamil: "அண்ணா, இந்த பேருந்து மதுரைக்கு போகிறதா?",
        tanglish: "Anna, indha paerundhu Madhuraikku pogiradhaa?",
        english: "Brother, does this bus go to Madurai?"
      },
      {
        type: "dialogue",
        speaker: "conductor",
        sourashtra: "ஹொவ் தம்பி, சீக்கிரம் அந்தர் அவொ!",
        pronunciation: "Hov thambi, seekkiram andhar avo!",
        tamil: "ஆம் தம்பி, சீக்கிரம் உள்ளே வாருங்கள்!",
        tanglish: "Aam thambi, seekkiram ullae vaarungal!",
        english: "Yes brother, come inside quickly!"
      },
      {
        type: "question",
        questionType: "fill_blank",
        questionText: "'உள்ளே வாருங்கள்' என்பதை சௌராஷ்ட்ராவில் என்ன சொல்வர்?",
        tanglishQuestion: "'Ullae vaarungal' enbadhai Sourashtra-vil enna solvar?",
        promptSentence: "சீக்கிரம் ______ அவொ!",
        options: [
          "அந்தர் (Inside / உள்ளே)",
          "பாஹார் (Outside / வெளியே)",
          "கெத்தெ (Where / எங்கே)"
        ],
        correctIndex: 0,
        explanation: "'அந்தர்' என்றால் உள்ளே (Inside) என்று பொருள்.",
        tanglishExplanation: "'Andhar' endral ullae (Inside) endru artham."
      },
      {
        type: "dialogue",
        speaker: "suresh",
        sourashtra: "மதுரைக் ஏக் டிக்கெட் திய்யா, எத்ரொ ரூபியா?",
        pronunciation: "Madhuraik ek ticket dhiyya, ethro roopiya?",
        tamil: "மதுரைக்கு ஒரு டிக்கெட் கொடுங்கள், எத்தனை ரூபாய்?",
        tanglish: "Madhuraikku oru ticket kodungal, ethanai roobai?",
        english: "Give one ticket to Madurai, how many rupees?"
      },
      {
        type: "dialogue",
        speaker: "conductor",
        sourashtra: "வீஸ் ரூபியா திய்யா! ஒத்தி போய் பொஸ்ஸொ!",
        pronunciation: "Vees roopiya dhiyya! Othi poi bosso!",
        tamil: "இருபது ரூபாய் கொடுங்கள்! அங்கே போய் உட்காருங்கள்!",
        tanglish: "Irubadhu roobai kodungal! Angae poi utkaarungal!",
        english: "Give 20 rupees! Go sit there!"
      }
    ]
  },

  // STORY 4
  {
    id: "story_4",
    storyNumber: 4,
    title: "மருத்துவரிடம் நலம் விசாரிப்பு",
    tanglishTitle: "Maruthuvaridam Nalam Visaarippu",
    sourashtraTitle: "டாக்டர் தெகோடு³னு",
    englishTitle: "Doctor Consultation",
    category: "Health",
    icon: "medkit",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "doctor", name: "டாக்டர் (Doctor)", avatar: "👨‍⚕️", color: "#059669" },
      { id: "patient", name: "நோயாளி (Patient)", avatar: "🤒", color: "#DC2626" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "doctor",
        sourashtra: "நமஸ்காரு! துமகொ காய் து³கய் அஸா?",
        pronunciation: "Namaskaru! Dhumako kaai dhukay asa?",
        tamil: "வணக்கம்! உங்களுக்கு என்ன உடம்பு சரியில்லை?",
        tanglish: "Vanakkam! Ungalukku enna udambu sariyillai?",
        english: "Hello! What is your ailment/problem?"
      },
      {
        type: "dialogue",
        speaker: "patient",
        sourashtra: "டாக்டர் அய்யா, மொகொ தீன் தி³வஸ் தப்ப் அஸா, மாதா து³கய்!",
        pronunciation: "Doctor ayya, moko theen dhivas thapp asa, maatha dhukay!",
        tamil: "டாக்டர் ஐயா, எனக்கு மூன்று நாளாக காய்ச்சல் மற்றும் தலைவலி இருக்கிறது!",
        tanglish: "Doctor ayya, enakku moonru naalaaga kaaichal matrum thalaivali irukkiradhu!",
        english: "Doctor, I have had a fever and headache for three days!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "நோயாளிக்கு என்ன பிரச்சனை உள்ளது?",
        tanglishQuestion: "Noyaalikku enna pirachanai ulladhu?",
        englishQuestion: "What symptoms does the patient describe?",
        options: [
          "காய்ச்சல் மற்றும் தலைவலி (Fever & Headache)",
          "வயிற்று வலி மட்டும் (Stomach ache only)",
          "கால் வலி (Leg pain)"
        ],
        correctIndex: 0,
        explanation: "'தப்ப்' என்றால் காய்ச்சல் (Fever), 'மாதா து³கய்' என்றால் தலைவலி (Headache).",
        tanglishExplanation: "'Thapp' endral kaaichal (Fever), 'Maatha dhukay' endral thalaivali (Headache)."
      },
      {
        type: "dialogue",
        speaker: "doctor",
        sourashtra: "பயபடோ³ நகா! யே ஒளஷத்³ காலொ சாஞ்ஜொ க்கா! சுகுக் ஹோயி!",
        pronunciation: "Bhayapado naka! Ye oushadh kaalo chaanjo kha! Shukuk hoyi!",
        tamil: "பயப்பட வேண்டாம்! இந்த மருந்தை காலை மாலை சாப்பிடுங்கள்! குணமாகிவிடும்!",
        tanglish: "Bayappada vaendaam! Indha marundhai kaalai maalai saappidungal! Gunamaagividum!",
        english: "Don't worry! Take this medicine morning and evening! You will recover!"
      }
    ]
  },

  // STORY 5 (NEW 1)
  {
    id: "story_5",
    storyNumber: 5,
    title: "பாட்டியின் அன்பு அறிவுரை",
    tanglishTitle: "Paattiyin Anbu Arivurai",
    sourashtraTitle: "ஆஜி சொங்கொடு³",
    englishTitle: "Grandmother's Advice at Home",
    category: "Family",
    icon: "heart",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "aaji", name: "ஆஜி / பாட்டி (Grandmother)", avatar: "👵", color: "#EC4899" },
      { id: "manoj", name: "மனோஜ் / பேரன் (Manoj)", avatar: "👦", color: "#3B82F6" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "aaji",
        sourashtra: "மனோஜ், சீக்கிரம் உடோ³! சூரஜ் உகாவ்லா!",
        pronunciation: "Manoj, seekkiram udo! Sooraj ugaavla!",
        tamil: "மனோஜ், சீக்கிரம் எழுந்திரு! சூரியன் உதித்துவிட்டது!",
        tanglish: "Manoj, seekkiram ezhundhiru! Sooriyan udhithuvittadhu!",
        english: "Manoj, wake up quickly! The sun has risen!"
      },
      {
        type: "dialogue",
        speaker: "manoj",
        sourashtra: "ஹொவ் ஆஜி, மீ உட்தோஸ்! ஆஜி, காலி காய் ரந்தோ?",
        pronunciation: "Hov aaji, mee udh-thos! Aaji, kaali kaai rantho?",
        tamil: "சரி பாட்டி, நான் எழுந்திருக்கிறேன்! பாட்டி, இன்று காலை என்ன சமையல்?",
        tanglish: "Sari paatti, naan ezhundhirukkiraen! Paatti, indru kaalai enna samaiyal?",
        english: "Yes grandma, I am getting up! Grandma, what's for breakfast today?"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'பாட்டி' என்பதை என்ன சொல்வார்கள்?",
        tanglishQuestion: "Sourashtra-vil 'Paatti' enbadhai enna solvaargal?",
        englishQuestion: "What is Grandmother called in Sourashtra?",
        options: [
          "ஆஜி (Aaji / Grandmother)",
          "அம்மா (Amma / Mother)",
          "அக்கா (Akka / Sister)"
        ],
        correctIndex: 0,
        explanation: "சௌராஷ்ட்ராவில் தந்தையின் அல்லது தாயின் அம்மாவை 'ஆஜி (Aaji)' என்று அழைப்பார்கள்.",
        tanglishExplanation: "Sourashtra-vil thaaiyin alladhu thandhaiyin ammavai 'Aaji' endru azhaippaargal."
      },
      {
        type: "dialogue",
        speaker: "aaji",
        sourashtra: "ஊனு இட்லி அண்ட் சட்னி! நாவாணி கெரி க்கா!",
        pronunciation: "Oonu idli and chutney! Naavaani keri kha!",
        tamil: "சூடான இட்லி மற்றும் சட்னி! குளித்துவிட்டு வந்து சாப்பிடு!",
        tanglish: "Soodaana idli matrum chutney! Kulithuvittu vandhu saappidu!",
        english: "Hot idli and chutney! Take a bath and come eat!"
      },
      {
        type: "dialogue",
        speaker: "manoj",
        sourashtra: "ஆஜி, தும்கொ மொகொ மாதா பிரேம் அஸா!",
        pronunciation: "Aaji, dhumko moko maatha praem asa!",
        tamil: "பாட்டி, உங்கள் மேல் எனக்கு மிகுந்த அன்பு இருக்கிறது!",
        tanglish: "Paatti, ungal mael enakku migundha anbu irukkiradhu!",
        english: "Grandma, I love you so much!"
      }
    ]
  },

  // STORY 6 (NEW 2)
  {
    id: "story_6",
    storyNumber: 6,
    title: "பண்டிகை சமையல் தயாரிப்பு",
    tanglishTitle: "Pandigai Samaiyal Thayaarippu",
    sourashtraTitle: "ரந்தோ பக்வொ",
    englishTitle: "Cooking the Festival Feast",
    category: "Culture",
    icon: "restaurant",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "radha", name: "ராதா (Radha)", avatar: "👩‍🍳", color: "#F59E0B" },
      { id: "anbu", name: "அன்பு (Anbu)", avatar: "👨", color: "#10B981" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "radha",
        sourashtra: "அன்பு, ஆஜி பர்வொ தி³வஸ்! ரந்தோ சீக்கிரம் கெரா!",
        pronunciation: "Anbu, aaji parvo dhivas! Rantho seekkiram kera!",
        tamil: "அன்பு, இன்று பண்டிகை நாள்! சமையலை சீக்கிரம் செய்யுங்கள்!",
        tanglish: "Anbu, indru pandigai naal! Samaiyalai seekkiram seyyungal!",
        english: "Anbu, today is festival day! Let's cook quickly!"
      },
      {
        type: "dialogue",
        speaker: "anbu",
        sourashtra: "ஹொவ் ராதா, பாத், தா³ளி, அண்ட் பாயசம் ரந்தோஸ்!",
        pronunciation: "Hov Radha, bhaath, dhaali, and paayasam ranthos!",
        tamil: "ஆம் ராதா, சாதம், பருப்பு மற்றும் பாயாசம் சமைக்கிறேன்!",
        tanglish: "Aam Radha, saadham, paruppu matrum paayasam samaikkiraen!",
        english: "Yes Radha, I am cooking rice, dal, and payasam!"
      },
      {
        type: "question",
        questionType: "fill_blank",
        questionText: "சௌராஷ்ட்ராவில் 'சாதம்' என்பதை குறிக்கும் சொல் எது?",
        tanglishQuestion: "Sourashtra-vil 'Saadham' enbadhai kurikkum sol edhu?",
        promptSentence: "ராதா, ______ ரந்தோஸ்! (I am cooking rice)",
        options: [
          "பாத் (Bhaath / சாதம்)",
          "பானி (Paani / தண்ணீர்)",
          "தூத்³ (Dhoodh / பால்)"
        ],
        correctIndex: 0,
        explanation: "'பாத் (Bhaath)' என்றால் சௌராஷ்ட்ராவில் 'சாதம் (Cooked Rice)' என்று பொருள்.",
        tanglishExplanation: "'Bhaath' endral Sourashtra-vil 'Saadham (Rice)' endru artham."
      },
      {
        type: "dialogue",
        speaker: "radha",
        sourashtra: "மீட் சிய்யா ஸாக்கொ! ருசி அஸா கா?",
        pronunciation: "Meet chiyya saakko! Ruchi asa kaa?",
        tamil: "உப்பு கொஞ்சம் பாருங்கள்! சுவையாக இருக்கிறதா?",
        tanglish: "Uppu konjam paarungal! Suvaiyaaga irukkiradhaa?",
        english: "Taste the salt a bit! Is it delicious?"
      },
      {
        type: "dialogue",
        speaker: "anbu",
        sourashtra: "ஆஹா, சப்ப் ருசி போஹுத் சங்கிலொ அஸா!",
        pronunciation: "Aaha, sapp ruchi bohut sangilo asa!",
        tamil: "ஆஹா, எல்லா சுவையும் மிகவும் நன்றாக இருக்கிறது!",
        tanglish: "Aaha, ellaa suvaiyum migavum nandraaga irukkiradhu!",
        english: "Aha, all the taste is very good and delicious!"
      }
    ]
  },

  // STORY 7 (NEW 3)
  {
    id: "story_7",
    storyNumber: 7,
    title: "ரயில் நிலையத்தில் டிக்கெட் முன்பதிவு",
    tanglishTitle: "Rail Nilaiyathil Ticket Munpadhivu",
    sourashtraTitle: "ரயில் ஸ்டேஷன் யோத்ரா",
    englishTitle: "Railway Ticket Booking",
    category: "Travel",
    icon: "train",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "vignesh", name: "விக்னேஷ் (Vignesh)", avatar: "🧑‍💼", color: "#6366F1" },
      { id: "clerk", name: "முன்பதிவு அதிகாரி (Clerk)", avatar: "👨‍💻", color: "#14B8A6" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "vignesh",
        sourashtra: "நமஸ்காரு சார்! காலியொ சேலம்க் ஏக் ரயில் டிக்கெட் அஸா கா?",
        pronunciation: "Namaskaru sir! Kaaliyo Salemk ek rail ticket asa kaa?",
        tamil: "வணக்கம் சார்! நாளை சேலத்திற்கு ஒரு ரயில் டிக்கெட் இருக்கிறதா?",
        tanglish: "Vanakkam sir! Naalai Salemukku oru train ticket irukkiradhaa?",
        english: "Hello sir! Is there a train ticket to Salem tomorrow?"
      },
      {
        type: "dialogue",
        speaker: "clerk",
        sourashtra: "ஹொவ், காலியொ ஸஞ்சார் ரயில் அஸா! தும்கொ பெர்த் ஜொயீ கா?",
        pronunciation: "Hov, kaaliyo sanchaar rail asa! Dhumko berth joyee kaa?",
        tamil: "ஆம், நாளை மாலை ரயில் இருக்கிறது! உங்களுக்கு படுக்கை வசதி வேண்டுமா?",
        tanglish: "Aam, naalai maalai train irukkiradhu! Ungalukku berth vaendumaa?",
        english: "Yes, there is an evening train tomorrow! Do you need a sleeper berth?"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "ரயில் எப்போது புறப்படுகிறது?",
        tanglishQuestion: "Train eppodhu purappadugiradhu?",
        englishQuestion: "When does the train depart?",
        options: [
          "ஸஞ்சார் / மாலை (Evening)",
          "காலொ / காலை (Morning)",
          "ராதி / இரவு (Night)"
        ],
        correctIndex: 0,
        explanation: "'ஸஞ்சார் (Sanchaar)' என்றால் சௌராஷ்ட்ராவில் 'மாலை (Evening)' என்று பொருள்.",
        tanglishExplanation: "'Sanchaar' endral Sourashtra-vil 'Maalai (Evening)' endru artham."
      },
      {
        type: "dialogue",
        speaker: "vignesh",
        sourashtra: "ஹொவ் சார், தீன்ஸொ ரூபியா கோ, டிக்கெட் திய்யா!",
        pronunciation: "Hov sir, theenso roopiya kho, ticket dhiyya!",
        tamil: "ஆம் சார், முந்நூறு ரூபாய் எடுத்துக் கொள்ளுங்கள், டிக்கெட் கொடுங்கள்!",
        tanglish: "Aam sir, munnooru roobai eduthuk kollungal, ticket kodungal!",
        english: "Yes sir, take 300 rupees, please give the ticket!"
      },
      {
        type: "dialogue",
        speaker: "clerk",
        sourashtra: "யே கோ டிக்கெட்! சுப யோத்ரா!",
        pronunciation: "Ye kho ticket! Shubha yothra!",
        tamil: "இந்தாருங்கள் டிக்கெட்! இனிய பயண வாழ்த்துகள்!",
        tanglish: "Indhaarungal ticket! Iniya payana vaazhthugal!",
        english: "Here is your ticket! Have a safe and happy journey!"
      }
    ]
  },

  // STORY 8 (NEW 4)
  {
    id: "story_8",
    storyNumber: 8,
    title: "பட்டுச் சேலை நெசவுத் தறி",
    tanglishTitle: "Pattu Seelai Nesavu Thari",
    sourashtraTitle: "பாட்டு லுங்குடொ ஓடு³னு",
    englishTitle: "Silk Saree Handloom Weaving",
    category: "Culture",
    icon: "color-palette",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "gopal", name: "கோபால் நெசவாளர் (Weaver)", avatar: "👴", color: "#8B5CF6" },
      { id: "priya", name: "பிரியா வாடிக்கையாளர் (Priya)", avatar: "👩", color: "#EC4899" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "priya",
        sourashtra: "நமஸ்காரு அய்யா! துமி பாட்டு லுங்குடொ கைகூ ஓடாஸ்?",
        pronunciation: "Namaskaru ayya! Dhumi paattu lungudo kaigoo odaas?",
        tamil: "வணக்கம் அண்ணா! நீங்கள் பட்டுச் சேலையை கைத்தறியில் நெய்கிறீர்களா?",
        tanglish: "Vanakkam anna! Neengal pattu seelaiyai kaithariyil neygeereergalaa?",
        english: "Hello brother! Are you weaving silk sarees on the handloom?"
      },
      {
        type: "dialogue",
        speaker: "gopal",
        sourashtra: "ஹொவ் அம்மா! யே சொளராஷ்ட்ர பாட்டு த³ரி! போஹுத் மஹிம அஸா!",
        pronunciation: "Hov amma! Ye Sourashtra paattu dhari! Bohut mahima asa!",
        tamil: "ஆம் அம்மா! இது சௌராஷ்ட்ர பாரம்பரிய பட்டுத்தறி! மிகுந்த பெருமை மிக்கது!",
        tanglish: "Aam amma! Idhu Sourashtra paarambariya pattuthari! Migundha perumai mikkadhu!",
        english: "Yes sister! This is the traditional Sourashtra silk loom, full of heritage!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'பட்டு' என்பதற்கு என்ன சொல்?",
        tanglishQuestion: "Sourashtra-vil 'Pattu' enbadharku enna sol?",
        englishQuestion: "What is Silk called in Sourashtra?",
        options: [
          "பாட்டு (Paattu / பட்டு)",
          "கபாஸ் (Kapaas / பருத்தி)",
          "லுங்குடொ (Lungudo / ஆடை)"
        ],
        correctIndex: 0,
        explanation: "'பாட்டு (Paattu)' என்றால் பட்டு (Silk) என்று பொருள். சௌராஷ்ட்ர மக்கள் பட்டு நெசவில் உலகப் புகழ் பெற்றவர்கள்.",
        tanglishExplanation: "'Paattu' endral Pattu (Silk) endru artham. Sourashtra makkal pattu nesavil pugazh petravargal."
      },
      {
        type: "dialogue",
        speaker: "priya",
        sourashtra: "ரங்கு போஹுத் சுந்தர் அஸா! ஏக் லுங்குடொ மொகொ திய்யா!",
        pronunciation: "Rangu bohut sundhar asa! Ek lungudo moko dhiyya!",
        tamil: "வண்ணம் மிகவும் அழகாக இருக்கிறது! ஒரு சேலை எனக்கு கொடுங்கள்!",
        tanglish: "Vannam migavum azhagaaga irukkiradhu! Oru seelai enakku kodungal!",
        english: "The color is so beautiful! Please give one saree to me!"
      },
      {
        type: "dialogue",
        speaker: "gopal",
        sourashtra: "மகிழ்ச்சி அம்மா! யே கோ, தும்கொ சங்கிலொ ஹோயி!",
        pronunciation: "Magizhchi amma! Ye kho, dhumko sangilo hoyi!",
        tamil: "மிக்க மகிழ்ச்சி அம்மா! இந்தாருங்கள், உங்களுக்கு மங்களம் உண்டாகட்டும்!",
        tanglish: "Mikka magizhchi amma! Indhaarungal, ungalukku mangalam undaagattum!",
        english: "Very happy sister! Here it is, may it bring prosperity and joy!"
      }
    ]
  },

  // STORY 9 (NEW 5)
  {
    id: "story_9",
    storyNumber: 9,
    title: "பள்ளியின் முதல் நாள்",
    tanglishTitle: "Palliyin Mudhal Naal",
    sourashtraTitle: "இஸ்கூல் மெலிவு",
    englishTitle: "First Day at School",
    category: "Education",
    icon: "school",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "anand", name: "ஆனந்த் (Anand)", avatar: "👦", color: "#3B82F6" },
      { id: "karthik", name: "கார்த்திக் (Karthik)", avatar: "🧑", color: "#10B981" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "anand",
        sourashtra: "நமஸ்காரு! தும்கொ நவ் காய்?",
        pronunciation: "Namaskaru! Dhumko nav kaai?",
        tamil: "வணக்கம்! உங்கள் பெயர் என்ன?",
        tanglish: "Vanakkam! Ungal peyar enna?",
        english: "Hello! What is your name?"
      },
      {
        type: "dialogue",
        speaker: "karthik",
        sourashtra: "மொகொ நவ் கார்த்திக்! துமி கோந்தெ ஸீக்கோஸ்?",
        pronunciation: "Moko nav Karthik! Dhumi khonthe seekkos?",
        tamil: "என் பெயர் கார்த்திக்! நீங்கள் எந்த வகுப்பில் படிக்கிறீர்கள்?",
        tanglish: "En peyar Karthik! Neengal endha vaguppil padikkireergal?",
        english: "My name is Karthik! Which class/standard are you studying?"
      },
      {
        type: "question",
        questionType: "fill_blank",
        questionText: "'உங்கள் பெயர் என்ன?' என்பதற்குரிய சௌராஷ்ட்ர வினா எது?",
        tanglishQuestion: "'Ungal peyar enna?' enbadharkuriya Sourashtra vinaa edhu?",
        promptSentence: "தும்கொ ______ காய்?",
        options: [
          "நவ் (Nav / பெயர்)",
          "க்கா³ர் (Khaar / வீடு)",
          "காம் (Kaam / வேலை)"
        ],
        correctIndex: 0,
        explanation: "'நவ் (Nav)' என்றால் பெயர் (Name) என்று பொருள்.",
        tanglishExplanation: "'Nav' endral peyar (Name) endru artham."
      },
      {
        type: "dialogue",
        speaker: "anand",
        sourashtra: "மீ ஆட்டொ வர்குக் அஸாஸ்! அம்கொ தோஸ்த் ஹோயீஸ் கா?",
        pronunciation: "Mee aatto varguk asaasa! Amko dhosth hoyees kaa?",
        tamil: "நான் எட்டாம் வகுப்பில் படிக்கிறேன்! நாம் இருவரும் நண்பர்களாகலாமா?",
        tanglish: "Naan ettaam vaguppil padikkiraen! Naam iruvarum nanbargalaagalaamaa?",
        english: "I am in 8th standard! Shall we become friends?"
      },
      {
        type: "dialogue",
        speaker: "karthik",
        sourashtra: "ஹொவ் ஆனந்த்! ஆஜி முதல் அம்கொ தோஸ்த்!",
        pronunciation: "Hov Anand! Aaji mudhal amko dhosth!",
        tamil: "ஆம் ஆனந்த்! இன்று முதல் நாம் நண்பர்கள்!",
        tanglish: "Aam Anand! Indru mudhal naam nanbargal!",
        english: "Yes Anand! From today onwards we are good friends!"
      }
    ]
  },

  // STORY 10 (NEW 6)
  {
    id: "story_10",
    storyNumber: 10,
    title: "நகைக்கடையில் தங்கம் வாங்குதல்",
    tanglishTitle: "Nagaikkadaiyil Thangam Vaangudhal",
    sourashtraTitle: "சோனா துகான்",
    englishTitle: "Jewelry & Gold Shop",
    category: "Shopping",
    icon: "diamond",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "geetha", name: "கீதா (Geetha)", avatar: "👩", color: "#F59E0B" },
      { id: "goldsmith", name: "நகைக்கடைக்காரர் (Jeweler)", avatar: "👨‍💼", color: "#6366F1" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "geetha",
        sourashtra: "நமஸ்காரு அய்யா! ஆஜி சோனா மோல் எத்ரொ?",
        pronunciation: "Namaskaru ayya! Aaji sona mol ethro?",
        tamil: "வணக்கம் அண்ணா! இன்று தங்கம் விலை எவ்வளவு?",
        tanglish: "Vanakkam anna! Indru thangam vilai evvalavu?",
        english: "Hello brother! What is the gold rate today?"
      },
      {
        type: "dialogue",
        speaker: "goldsmith",
        sourashtra: "ஏக் கிராம் சோனா சா³ர் ஹஜார் ரூபியா அம்மா!",
        pronunciation: "Ek gram sona chaar hajaar roopiya amma!",
        tamil: "ஒரு கிராம் தங்கம் நான்காயிரம் ரூபாய் அம்மா!",
        tanglish: "Oru gram thangam naangaayiram roobai amma!",
        english: "One gram of gold is 4,000 rupees, sister!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'சோனா' என்றால் என்ன?",
        tanglishQuestion: "Sourashtra-vil 'Sona' endral enna?",
        englishQuestion: "What is 'Sona' in Sourashtra?",
        options: [
          "தங்கம் (Gold)",
          "வெள்ளி (Silver)",
          "வைரம் (Diamond)"
        ],
        correctIndex: 0,
        explanation: "'சோனா (Sona)' என்றால் தங்கம் (Gold). 'ரூபியா' என்றால் வெள்ளி/பணம்.",
        tanglishExplanation: "'Sona' endral Thangam (Gold). 'Roopa' endral Velli (Silver)."
      },
      {
        type: "dialogue",
        speaker: "geetha",
        sourashtra: "மொகொ ஏக் சங்கிலொ கான்னொ கம்மல் தெகாடா!",
        pronunciation: "Moko ek sangilo kaanno kammal thekaada!",
        tamil: "எனக்கு ஒரு அழகான காதணி (கம்மல்) காட்டுங்கள்!",
        tanglish: "Enakku oru azhagaana kaadhani (kammal) kaattungal!",
        english: "Please show me a nice pair of gold earrings!"
      },
      {
        type: "dialogue",
        speaker: "goldsmith",
        sourashtra: "யே தெகா அம்மா! போஹுத் நவீ டிசைன் அஸா!",
        pronunciation: "Ye theka amma! Bohut navee design asa!",
        tamil: "இதைப் பாருங்கள் அம்மா! மிக புதிய டிசைன் மாடல்!",
        tanglish: "Idhai paarungal amma! Miga pudhiya design model!",
        english: "Look at this sister! This is a brand new design!"
      }
    ]
  },

  // STORY 11 (NEW 7)
  {
    id: "story_11",
    storyNumber: 11,
    title: "காலை காய்கறி சந்தை",
    tanglishTitle: "Kaalai Kaaikari Sandhai",
    sourashtraTitle: "சா³க் துகான் மோல்",
    englishTitle: "Morning Vegetable Market",
    category: "Shopping",
    icon: "nutrition",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "selvi", name: "செல்வி (Selvi)", avatar: "👩‍🌾", color: "#10B981" },
      { id: "vendor", name: "வியாபாரி (Vendor)", avatar: "👨‍🌾", color: "#F97316" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "selvi",
        sourashtra: "அய்யா, ஆஜி காந்தோ அண்ட் ஆலு எத்ரொ மோல்?",
        pronunciation: "Ayya, aaji kaantho and aalu ethro mol?",
        tamil: "அண்ணா, இன்று வெங்காயம் மற்றும் உருளைக்கிழங்கு என்ன விலை?",
        tanglish: "Anna, indru vengaayam matrum urulaikizhangu enna vilai?",
        english: "Brother, what is the price of onions and potatoes today?"
      },
      {
        type: "dialogue",
        speaker: "vendor",
        sourashtra: "காந்தோ ஏக் கிலோ வீஸ் ரூபியா, ஆலு தீஸ் ரூபியா அம்மா!",
        pronunciation: "Kaantho ek kilo vees roopiya, aalu thees roopiya amma!",
        tamil: "வெங்காயம் ஒரு கிலோ இருபது ரூபாய், உருளை முப்பது ரூபாய் அம்மா!",
        tanglish: "Vengaayam oru kilo irubadhu roobai, urulai muppadhu roobai amma!",
        english: "Onion is 20 rupees a kilo, potato is 30 rupees, sister!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "'காந்தோ (Kaantho)' என்றால் எந்த காய்கறி?",
        tanglishQuestion: "'Kaantho' endral endha kaaikari?",
        englishQuestion: "Which vegetable is 'Kaantho' in Sourashtra?",
        options: [
          "வெங்காயம் (Onion)",
          "தக்காளி (Tomato)",
          "கத்தரிக்காய் (Brinjal)"
        ],
        correctIndex: 0,
        explanation: "'காந்தோ (Kaantho)' என்றால் வெங்காயம் (Onion). 'ஆலு (Aalu)' என்றால் உருளைக்கிழங்கு.",
        tanglishExplanation: "'Kaantho' endral Vengaayam (Onion). 'Aalu' endral Urulaikizhangu (Potato)."
      },
      {
        type: "dialogue",
        speaker: "selvi",
        sourashtra: "தோன் கிலோ காந்தோ அண்ட் ஏக் கிலோ டொமேட்டோ திய்யா!",
        pronunciation: "Dhon kilo kaantho and ek kilo tomato dhiyya!",
        tamil: "இரண்டு கிலோ வெங்காயம் மற்றும் ஒரு கிலோ தக்காளி கொடுங்கள்!",
        tanglish: "Irandu kilo vengaayam matrum oru kilo thakkaali kodungal!",
        english: "Give 2 kilos of onions and 1 kilo of tomatoes!"
      },
      {
        type: "dialogue",
        speaker: "vendor",
        sourashtra: "சரி அம்மா! யே கோ பை! தன்யவாத்³!",
        pronunciation: "Sari amma! Ye kho bai! Dhanyavaadh!",
        tamil: "சரி அம்மா! இந்தாருங்கள் பை! நன்றி!",
        tanglish: "Sari amma! Indhaarungal pai! Nandri!",
        english: "Okay sister! Take this bag! Thank you!"
      }
    ]
  },

  // STORY 12 (NEW 8)
  {
    id: "story_12",
    storyNumber: 12,
    title: "பிறந்தநாள் கொண்டாட்ட வாழ்த்து",
    tanglishTitle: "Pirandhanaal Kondaatta Vaazhthu",
    sourashtraTitle: "ஜொனொ தி³வஸ் உத்சவ்",
    englishTitle: "Birthday Celebration & Wishes",
    category: "Family",
    icon: "gift",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "deepa", name: "தீபா (Deepa)", avatar: "👧", color: "#EC4899" },
      { id: "mohan", name: "மோகன் (Mohan)", avatar: "👦", color: "#3B82F6" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "mohan",
        sourashtra: "தீபா, ஆஜி தும்கொ ஜொனொ தி³வஸ் கா?",
        pronunciation: "Deepa, aaji dhumko jono dhivas kaa?",
        tamil: "தீபா, இன்று உனக்கு பிறந்தநாளா?",
        tanglish: "Deepa, indru unakku pirandhanaalaa?",
        english: "Deepa, is today your birthday?"
      },
      {
        type: "dialogue",
        speaker: "deepa",
        sourashtra: "ஹொவ் மோகன்! ஆஜி மொகொ பந்தரொ வர்ஷ்!",
        pronunciation: "Hov Mohan! Aaji moko pandharo varsh!",
        tamil: "ஆம் மோகன்! இன்று எனக்கு பதினைந்து வயது நிறைவடைகிறது!",
        tanglish: "Aam Mohan! Indru enakku padhinaindhu vayadhu niraivaadaigiradhu!",
        english: "Yes Mohan! Today I turn 15 years old!"
      },
      {
        type: "question",
        questionType: "reply",
        questionText: "பிறந்தநாளுக்கு சௌராஷ்ட்ராவில் என்ன வாழ்த்து சொல்வார்கள்?",
        tanglishQuestion: "Pirandhanaalukku Sourashtra-vil enna vaazhthu solvaargal?",
        englishQuestion: "What is the birthday blessing in Sourashtra?",
        options: [
          "ஜொனொ தி³வஸ் சுபாஷாயி! (இனிய பிறந்தநாள் வாழ்த்துகள்!)",
          "ராதி நித்ர! (இரவு வணக்கம்!)",
          "ஜா போய் அவொ! (போய் வாருங்கள்!)"
        ],
        correctIndex: 0,
        explanation: "'ஜொனொ தி³வஸ் சுபாஷாயி!' என்றால் பிறந்தநாள் நல்வாழ்த்துகள் (Happy Birthday).",
        tanglishExplanation: "'Jono dhivas shubhaashayi!' endral Iniya Pirandhanaal Vaazhthugal (Happy Birthday)."
      },
      {
        type: "dialogue",
        speaker: "mohan",
        sourashtra: "ஜொனொ தி³வஸ் சுபாஷாயி தீபா! யே கோ மிட்டை!",
        pronunciation: "Jono dhivas shubhaashayi Deepa! Ye kho mittai!",
        tamil: "இனிய பிறந்தநாள் வாழ்த்துகள் தீபா! இந்த இனிப்பை எடுத்துக்கொள்!",
        tanglish: "Iniya pirandhanaal vaazhthugal Deepa! Indha inippai eduthukkol!",
        english: "Happy Birthday Deepa! Have this sweet!"
      },
      {
        type: "dialogue",
        speaker: "deepa",
        sourashtra: "தன்யவாத்³ மோகன்! சாயித் சாயங்காலம் க்கா³ர் அவொ!",
        pronunciation: "Dhanyavaadh Mohan! Saayith saayangaalam khaar avo!",
        tamil: "மிக்க நன்றி மோகன்! மாலையில் எங்கள் வீட்டிற்கு வா!",
        tanglish: "Mikka nandri Mohan! Maalaiyil engal veettirku vaa!",
        english: "Thank you Mohan! Do come to our house this evening!"
      }
    ]
  },

  // STORY 13 (NEW 9)
  {
    id: "story_13",
    storyNumber: 13,
    title: "மீனாட்சி அம்மன் கோவிலுக்கு ஆட்டோ பயணம்",
    tanglishTitle: "Meenakshi Amman Kovilukku Auto Payanam",
    sourashtraTitle: "ஆட்டோ யோத்ரா",
    englishTitle: "Auto Rickshaw Ride to Temple",
    category: "Travel",
    icon: "car",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "tourist", name: "பயணி (Passenger)", avatar: "🧑", color: "#6366F1" },
      { id: "driver", name: "ஆட்டோ ஓட்டுனர் (Auto Driver)", avatar: "🛺", color: "#F59E0B" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "tourist",
        sourashtra: "அய்யா, மீனாட்சி அம்மன் தேவுள்க் ஜாஸா கா?",
        pronunciation: "Ayya, Meenakshi Amman dhevulk jaasaa kaa?",
        tamil: "அண்ணா, மீனாட்சி அம்மன் கோவிலுக்கு போவீர்களா?",
        tanglish: "Anna, Meenakshi Amman kovilukku poveergalaa?",
        english: "Brother, will you go to Meenakshi Amman Temple?"
      },
      {
        type: "dialogue",
        speaker: "driver",
        sourashtra: "ஹொவ் பொஸ்ஸொ! ஐஸொ ரூபியா ஹோயி!",
        pronunciation: "Hov bosso! Aiso roopiya hoyi!",
        tamil: "ஆம் ஏறுங்கள்! ஐம்பது ரூபாய் ஆகும்!",
        tanglish: "Aam aerungal! Aimbadhu roobai aagum!",
        english: "Yes get in! It will be 50 rupees!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'தேவுள் (Dhevul)' என்றால் என்ன இடம்?",
        tanglishQuestion: "Sourashtra-vil 'Dhevul' endral enna idam?",
        englishQuestion: "What is 'Dhevul' in Sourashtra?",
        options: [
          "கோவில் / ஆலயம் (Temple)",
          "பள்ளி (School)",
          "மருத்துவமனை (Hospital)"
        ],
        correctIndex: 0,
        explanation: "'தேவுள் (Dhevul)' என்றால் கோவில் (Temple). 'தேவ் (Dhev)' என்றால் தெய்வம் (God).",
        tanglishExplanation: "'Dhevul' endral Kovil (Temple). 'Dhev' endral Dheivam (God)."
      },
      {
        type: "dialogue",
        speaker: "tourist",
        sourashtra: "சீக்கிரம் லேய் ஜா! பூஜாக் வேள ஹோயி!",
        pronunciation: "Seekkiram ley jaa! Poojaak vela hoyi!",
        tamil: "சீக்கிரம் அழைத்துச் செல்லுங்கள்! பூஜை நேரம் ஆகிவிடும்!",
        tanglish: "Seekkiram azhaithuch chellungal! Poojai neram aagividum!",
        english: "Please take me quickly! Pooja time is approaching!"
      },
      {
        type: "dialogue",
        speaker: "driver",
        sourashtra: "பயபடோ³ நகா! தஸ் மினிட்மெ பூர்த்தி ஹோயி!",
        pronunciation: "Bhayapado naka! Dhas minute-me poorthi hoyi!",
        tamil: "பயப்படாதீர்கள்! பத்து நிமிடத்தில் சென்று சேர்ந்துவிடலாம்!",
        tanglish: "Bayappadaadheergal! Pathu nimidathil sendru saerndhuvidalaam!",
        english: "Don't worry! We will reach in ten minutes!"
      }
    ]
  },

  // STORY 14 (NEW 10)
  {
    id: "story_14",
    storyNumber: 14,
    title: "திடீர் மழை மற்றும் வானிலை பேச்சு",
    tanglishTitle: "Thideer Mazhai matrum Vaanilai Paechu",
    sourashtraTitle: "பாவி³ அண்ட் ஹவா",
    englishTitle: "Heavy Rain & Weather Chat",
    category: "Daily Life",
    icon: "rainy",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "raghu", name: "ரகு (Raghu)", avatar: "👨", color: "#0284C7" },
      { id: "shankar", name: "சங்கர் (Shankar)", avatar: "🧑", color: "#10B981" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "raghu",
        sourashtra: "சங்கர், பாஹார் தெகோ³! போஹுத் பாவி³ வோஸா!",
        pronunciation: "Shankar, baahaar thego! Bohut paavi vosaa!",
        tamil: "சங்கர், வெளியே பார்! பலத்த மழை பெய்கிறது!",
        tanglish: "Shankar, veliyae paar! Balatha mazhai peygiradhu!",
        english: "Shankar, look outside! It is raining very heavily!"
      },
      {
        type: "dialogue",
        speaker: "shankar",
        sourashtra: "ஹொவ் ரகு, மேக் போஹுத் களோ அஸா! க்காடொ அஸா கா?",
        pronunciation: "Hov Raghu, mekh bohut kalo asa! Khaado asa kaa?",
        tamil: "ஆம் ரகு, மேகம் மிகவும் கருப்பாக உள்ளது! குடை இருக்கிறதா?",
        tanglish: "Aam Raghu, maegam migavum karuppaaga ulladhu! Kudai irukkiradhaa?",
        english: "Yes Raghu, the clouds are very dark! Do you have an umbrella?"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'பாவி³ (Paavi)' என்றால் என்ன?",
        tanglishQuestion: "Sourashtra-vil 'Paavi' endral enna?",
        englishQuestion: "What does 'Paavi' mean in Sourashtra?",
        options: [
          "மழை (Rain)",
          "காற்று (Wind)",
          "வெயில் (Sunlight)"
        ],
        correctIndex: 0,
        explanation: "'பாவி³ (Paavi)' என்றால் மழை (Rain). 'ஹவா' என்றால் காற்று.",
        tanglishExplanation: "'Paavi' endral Mazhai (Rain). 'Havaa' endral Kaatru (Wind)."
      },
      {
        type: "dialogue",
        speaker: "raghu",
        sourashtra: "ஹொவ், மொகொ க்காடொ அஸா! தோனோ ஜான் ஏக் க்காடொமெ ஜாஸா!",
        pronunciation: "Hov, moko khaado asa! Dhono jaan ek khaadome jaasaa!",
        tamil: "ஆம், என்னிடம் குடை இருக்கிறது! நாம் இருவரும் ஒரே குடையில் போவோம்!",
        tanglish: "Aam, ennidam kudai irukkiradhu! Naam iruvarum orae kudaiyil povom!",
        english: "Yes, I have an umbrella! Both of us can walk together under it!"
      },
      {
        type: "dialogue",
        speaker: "shankar",
        sourashtra: "சங்கிலொ யோசனா ரகு! சாய் பிய்யி ஜாஸா!",
        pronunciation: "Sangilo yochana Raghu! Chaai biyyi jaasaa!",
        tamil: "நல்ல யோசனை ரகு! டீ குடித்துவிட்டு போவோம்!",
        tanglish: "Nalla yosanai Raghu! Tea kudithuvittu povom!",
        english: "Great idea Raghu! Let's drink hot tea and go!"
      }
    ]
  },

  // STORY 15 (NEW 11)
  {
    id: "story_15",
    storyNumber: 15,
    title: "வேலை நேர்காணல்",
    tanglishTitle: "Vaelai Naerkaanal",
    sourashtraTitle: "காம் மெலிவு",
    englishTitle: "Job Interview & Career",
    category: "Professional",
    icon: "briefcase",
    xpReward: 45,
    difficulty: "Advanced",
    characters: [
      { id: "boss", name: "அதிகாரி (Interviewer)", avatar: "👨‍💼", color: "#1E293B" },
      { id: "prakash", name: "பிரகாஷ் (Candidate)", avatar: "👨‍💻", color: "#4F46E5" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "boss",
        sourashtra: "நமஸ்காரு பிரகாஷ்! பொஸ்ஸொ! துமி காய் காம் கெரி அஸாஸ்?",
        pronunciation: "Namaskaru Prakash! Bosso! Dhumi kaai kaam keri asaasa?",
        tamil: "வணக்கம் பிரகாஷ்! உட்காருங்கள்! நீங்கள் என்ன வேலை செய்திருக்கிறீர்கள்?",
        tanglish: "Vanakkam Prakash! Utkaarungal! Neengal enna vaelai seidhirukkireergal?",
        english: "Hello Prakash! Please sit! What work/experience do you have?"
      },
      {
        type: "dialogue",
        speaker: "prakash",
        sourashtra: "சார், மீ கம்ப்யூட்டர் கம்பெனிமெ தோன் வர்ஷ் காம் கெல்லொஸ்!",
        pronunciation: "Sir, mee computer companyme dhon varsh kaam kellos!",
        tamil: "சார், நான் கணினி நிறுவனத்தில் இரண்டு ஆண்டுகள் பணிபுரிந்தேன்!",
        tanglish: "Sir, naan computer companayil irandu aandugal panipurindhaen!",
        english: "Sir, I worked in a computer software company for two years!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "பிரகாஷ் எத்தனை ஆண்டுகள் பணிபுரிந்துள்ளார்?",
        tanglishQuestion: "Prakash ethanai aandugal panipurindhullaar?",
        englishQuestion: "How many years of work experience does Prakash have?",
        options: [
          "தோன் வர்ஷ் / 2 ஆண்டுகள் (2 Years)",
          "பாஞ்ச் வர்ஷ் / 5 ஆண்டுகள் (5 Years)",
          "ஏக் வர்ஷ் / 1 ஆண்டு (1 Year)"
        ],
        correctIndex: 0,
        explanation: "'தோன் வர்ஷ் (Dhon varsh)' என்றால் இரண்டு ஆண்டுகள் (Two years).",
        tanglishExplanation: "'Dhon varsh' endral Irandu aandugal (Two years)."
      },
      {
        type: "dialogue",
        speaker: "boss",
        sourashtra: "போஹுத் சங்கிலொ! அம்கொ ஆபீஸ்மெ சோமார் முதல் காம்க் அவொ!",
        pronunciation: "Bohut sangilo! Amko officeme somaar mudhal kaamk avo!",
        tamil: "மிக நன்று! எங்கள் அலுவலகத்தில் திங்கட்கிழமை முதல் பணிக்கு வாருங்கள்!",
        tanglish: "Miga nandru! Engal office-il thingatkkizhamai mudhal panikku vaarungal!",
        english: "Very good! Come join work at our office from Monday onwards!"
      },
      {
        type: "dialogue",
        speaker: "prakash",
        sourashtra: "போஹுத் தன்யவாத்³ சார்! மீ நக்கீ சங்கிலொ காம் கெரிஸ்!",
        pronunciation: "Bohut dhanyavaadh sir! Mee nakkee sangilo kaam keris!",
        tamil: "மிக்க நன்றி சார்! நான் நிச்சயமாக சிறப்பாக உழைப்பேன்!",
        tanglish: "Mikka nandri sir! Naan nichayamaaga sirappaaga uzhaippaen!",
        english: "Thank you very much sir! I will definitely work hard and do my best!"
      }
    ]
  },

  // STORY 16 (NEW 12)
  {
    id: "story_16",
    storyNumber: 16,
    title: "விருந்தினரை உபசரித்தல்",
    tanglishTitle: "Virundhinarai Ubasarithal",
    sourashtraTitle: "மனுஸ் க்கார் அவொ",
    englishTitle: "Welcoming Guests at Home",
    category: "Family",
    icon: "people",
    xpReward: 35,
    difficulty: "Beginner",
    characters: [
      { id: "host", name: "வீட்டுக்காரர் (Host)", avatar: "👨", color: "#059669" },
      { id: "guest", name: "விருந்தினர் (Guest)", avatar: "🧓", color: "#D97706" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "host",
        sourashtra: "அவொ அய்யா! அந்தர் அவொ! பொஸ்ஸொ!",
        pronunciation: "Avo ayya! Andhar avo! Bosso!",
        tamil: "வாருங்கள் அண்ணா! உள்ளே வாருங்கள்! உட்காருங்கள்!",
        tanglish: "Vaarungal anna! Ullae vaarungal! Utkaarungal!",
        english: "Welcome brother! Come inside! Please take a seat!"
      },
      {
        type: "dialogue",
        speaker: "guest",
        sourashtra: "நமஸ்காரு! துமி சப்ப் ஜான் சுகுக் அஸாஸ் கா?",
        pronunciation: "Namaskaru! Dhumi sapp jaan shukuk asaasa kaa?",
        tamil: "வணக்கம்! நீங்கள் அனைவரும் நலமாக இருக்கிறீர்களா?",
        tanglish: "Vanakkam! Neengal anaivarum nalamaaga irukkireergalaa?",
        english: "Hello! Are all of you doing well at home?"
      },
      {
        type: "question",
        questionType: "fill_blank",
        questionText: "விருந்தினருக்கு முதலில் என்ன கொடுப்பார்கள்?",
        tanglishQuestion: "Virundhinarkku mudhalil enna koduppaargal?",
        promptSentence: "யே கோ, கூல் ______ பிய்யா! (Drink cold water)",
        options: [
          "பானி (Paani / தண்ணீர்)",
          "பாத் (Bhaath / சாதம்)",
          "தூத்³ (Dhoodh / பால்)"
        ],
        correctIndex: 0,
        explanation: "'பானி (Paani)' என்றால் தண்ணீர் (Water). விருந்தினர் வந்ததும் குடிக்க தண்ணீர் தருவது வழக்கம்.",
        tanglishExplanation: "'Paani' endral Thanneer (Water). Virundhinar vandhadhum kudikka thanneer tharuvadhu vazhakkam."
      },
      {
        type: "dialogue",
        speaker: "host",
        sourashtra: "யே கோ பானி பிய்யா! அம்கொ க்கா³ர்மெ ஜேவி ஜாஸ்!",
        pronunciation: "Ye kho paani biyya! Amko khaarme jevi jaas!",
        tamil: "இந்தாருங்கள் தண்ணீர் குடியுங்கள்! எங்கள் வீட்டில் சாப்பிட்டுவிட்டு போகலாம்!",
        tanglish: "Indhaarungal thanneer kudiyungal! Engal veettil saappittuvittu pogalaam!",
        english: "Please drink this water! You must have lunch with us before leaving!"
      },
      {
        type: "dialogue",
        speaker: "guest",
        sourashtra: "போஹுத் தன்யவாத்³! தும்கொ உபசாரம் போஹுத் ஆநந்துக் அஸா!",
        pronunciation: "Bohut dhanyavaadh! Dhumko ubachaaram bohut aanandhuk asa!",
        tamil: "மிக்க நன்றி! உங்கள் விருந்தோம்பல் மிகுந்த மகிழ்ச்சி தருகிறது!",
        tanglish: "Mikka nandri! Ungal virundhombal migundha magizhchi tharugiradhu!",
        english: "Thank you so much! Your warm hospitality gives great joy!"
      }
    ]
  },

  // STORY 17 (NEW 13)
  {
    id: "story_17",
    storyNumber: 17,
    title: "செல்போன் பழுதுபார்த்தல்",
    tanglishTitle: "Cellphone Pazhudhu Paarthal",
    sourashtraTitle: "மொபைல் போன் ரிப்பேர்",
    englishTitle: "Mobile Phone Repair Shop",
    category: "Technology",
    icon: "phone-portrait",
    xpReward: 40,
    difficulty: "Intermediate",
    characters: [
      { id: "cust", name: "வாடிக்கையாளர் (Customer)", avatar: "🧑", color: "#3B82F6" },
      { id: "tech", name: "மெக்கானிக் (Technician)", avatar: "👨‍🔧", color: "#10B981" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "cust",
        sourashtra: "அய்யா, மொகொ போன் ஸ்கிரீன் புட்டி கெல்லொ!",
        pronunciation: "Ayya, moko phone screen putti kello!",
        tamil: "அண்ணா, என் மொபைல் போன் ஸ்கிரீன் உடைந்துவிட்டது!",
        tanglish: "Anna, en mobile phone screen udaindhuvittadhu!",
        english: "Brother, my phone screen has cracked/broken!"
      },
      {
        type: "dialogue",
        speaker: "tech",
        sourashtra: "தெகாடா தம்பி! டிஸ்பிளே நவீ கெரானி ஹோயி!",
        pronunciation: "Thekaada thambi! Display navee keraani hoyi!",
        tamil: "காட்டுங்கள் தம்பி! புதிய டிஸ்ப்ளே மாற்ற வேண்டும்!",
        tanglish: "Kaattungal thambi! Pudhiya display maatra vaendum!",
        english: "Show it brother! We need to replace it with a new display!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "'நவீ (Navee)' என்றால் என்ன பொருள்?",
        tanglishQuestion: "'Navee' endral enna porul?",
        englishQuestion: "What does 'Navee' mean in Sourashtra?",
        options: [
          "புதிய (New)",
          "பழைய (Old)",
          "உடைந்த (Broken)"
        ],
        correctIndex: 0,
        explanation: "'நவீ (Navee)' என்றால் புதிய (New). 'புரானொ' என்றால் பழைய (Old).",
        tanglishExplanation: "'Navee' endral Pudhiya (New). 'Puraano' endral Pazhaiya (Old)."
      },
      {
        type: "dialogue",
        speaker: "cust",
        sourashtra: "எத்ரொ ரூபியா ஹோயி? கெத்தேள் தெஸ்?",
        pronunciation: "Ethro roopiya hoyi? Keththel dhes?",
        tamil: "எத்தனை ரூபாய் செலவாகும்? எப்போது தருவீர்கள்?",
        tanglish: "Ethanai roobai selavaagum? Eppodhu tharuveergal?",
        english: "How much will it cost? When will you give it back?"
      },
      {
        type: "dialogue",
        speaker: "tech",
        sourashtra: "ஹஜார் ரூபியா ஹோயி! சாயித் ஸஞ்சார் அவொ, ரெடி ஹோயி!",
        pronunciation: "Hajaar roopiya hoyi! Saayith sanchaar avo, ready hoyi!",
        tamil: "ஆயிரம் ரூபாய் ஆகும்! இன்று மாலை வாருங்கள், தயாராகிவிடும்!",
        tanglish: "Aayiram roobai aagum! Indru maalai vaarungal, thayaaraagividum!",
        english: "It will cost 1,000 rupees! Come this evening, it will be ready!"
      }
    ]
  },

  // STORY 18 (NEW 14)
  {
    id: "story_18",
    storyNumber: 18,
    title: "மதுரை சித்திரை திருவிழா",
    tanglishTitle: "Madurai Chithirai Thiruvizha",
    sourashtraTitle: "தேவுள் உத்சவ்",
    englishTitle: "Madurai Temple Festival",
    category: "Culture",
    icon: "sparkles",
    xpReward: 45,
    difficulty: "Advanced",
    characters: [
      { id: "bhakt", name: "பக்தர் (Devotee)", avatar: "🙏", color: "#EC4899" },
      { id: "priest", name: "பூசாரி (Priest)", avatar: "🛕", color: "#F59E0B" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "bhakt",
        sourashtra: "சுவாமி, ஆஜி சித்திரை உத்சவ் போஹுத் மஹா உத்சவ்!",
        pronunciation: "Swami, aaji Chithirai uthsav bohut mahaa uthsav!",
        tamil: "சுவாமி, இன்று சித்திரை திருவிழா மாபெரும் விழாவாக நடக்கிறது!",
        tanglish: "Swami, indru Chithirai thiruvizha maabaerum vizhaavaaga nadakkiradhu!",
        english: "Swamiji, today the Chithirai festival is celebrated with great grandeur!"
      },
      {
        type: "dialogue",
        speaker: "priest",
        sourashtra: "ஹொவ்! அழகர் சுவாமி வைஹை நதீக் அவொஸ்!",
        pronunciation: "Hov! Azhagar Swami Vaigai nadheek avos!",
        tamil: "ஆம்! அழகர் சுவாமி வைகை ஆற்றுக்கு எழுந்தருளுகிறார்!",
        tanglish: "Aam! Azhagar Swami Vaigai aatrukku ezhundharulugiraar!",
        english: "Yes! Lord Azhagar enters the holy Vaigai river!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "அழகர் சுவாமி எந்த ஆற்றுக்கு எழுந்தருளுகிறார்?",
        tanglishQuestion: "Azhagar Swami endha aatrukku ezhundharulugiraar?",
        englishQuestion: "Which river does Lord Azhagar enter?",
        options: [
          "வைகை நதி (Vaigai River)",
          "காவேரி நதி (Kaveri River)",
          "கங்கை நதி (Ganga River)"
        ],
        correctIndex: 0,
        explanation: "மதுரையின் பிரசித்தி பெற்ற சித்திரை திருவிழாவில் அழகர் சுவாமி வைகை ஆற்றில் இறங்குவார்.",
        tanglishExplanation: "Maduraiyin pirasiddhi petra Chithirai thiruvizhaavil Azhagar Swami Vaigai aatril iranguvaar."
      },
      {
        type: "dialogue",
        speaker: "bhakt",
        sourashtra: "யே பூல் அண்ட் நாரியல் தேவுள்க் அர்ச்சி கெரா!",
        pronunciation: "Ye phool and naariyal dhevulk archi kera!",
        tamil: "இந்த மலர்கள் மற்றும் தேங்காயை சுவாமிக்கு அர்ச்சனை செய்யுங்கள்!",
        tanglish: "Indha malargal matrum thengaayai swamikkku archanai seyyungal!",
        english: "Please offer these flowers and coconut in prayer to God!"
      },
      {
        type: "dialogue",
        speaker: "priest",
        sourashtra: "தேவ் ஆசீர்வாத்³ தும்கொ குடும்பாக் ஸதா அஸா!",
        pronunciation: "Dhev aasheervaadh dhumko kutumbaak sadhaa asa!",
        tamil: "இறைவனின் ஆசி உங்கள் குடும்பத்திற்கு எப்போதும் இருக்கும்!",
        tanglish: "Iraivanin aasi ungal kudumbathirku eppodhum irukkum!",
        english: "May God's divine blessings always remain with your family!"
      }
    ]
  },

  // STORY 19 (NEW 15)
  {
    id: "story_19",
    storyNumber: 19,
    title: "மாலையில் நண்பர்களுடன் கால்பந்து",
    tanglishTitle: "Maalaiyil Nanbargaludan Kaalpandhu",
    sourashtraTitle: "ரமொ ரமோடு³னு",
    englishTitle: "Playing Football with Friends",
    category: "Sports",
    icon: "football",
    xpReward: 40,
    difficulty: "Beginner",
    characters: [
      { id: "arun", name: "அருண் (Arun)", avatar: "🏃‍♂️", color: "#EF4444" },
      { id: "siva", name: "சிவா (Siva)", avatar: "⚽", color: "#10B981" }
    ],
    steps: [
      {
        type: "dialogue",
        speaker: "arun",
        sourashtra: "சிவா, ஸஞ்சார் ஹோயி! கிரவுண்ட்க் ரமொ ரமொங்க் அவொ!",
        pronunciation: "Siva, sanchaar hoyi! Groundk ramo ramonk avo!",
        tamil: "சிவா, மாலை நேரமாகிவிட்டது! மைதானத்திற்கு விளையாட வா!",
        tanglish: "Siva, maalai neramaagivittadhu! Maidhaanathirku vilaiyaada vaa!",
        english: "Siva, it's evening! Come to the ground to play sports!"
      },
      {
        type: "dialogue",
        speaker: "siva",
        sourashtra: "ஹொவ் அருண்! மீ பந்து³ லேய் அவோஸ்!",
        pronunciation: "Hov Arun! Mee bandhu ley avos!",
        tamil: "ஆம் அருண்! நான் கால்பந்தை எடுத்துக்கொண்டு வருகிறேன்!",
        tanglish: "Aam Arun! Naan kaalpandhai eduthukkondu varugiraen!",
        english: "Yes Arun! I am bringing the football!"
      },
      {
        type: "question",
        questionType: "comprehension",
        questionText: "சௌராஷ்ட்ராவில் 'பந்து³ (Bandhu)' என்றால் என்ன?",
        tanglishQuestion: "Sourashtra-vil 'Bandhu' endral enna?",
        englishQuestion: "What is 'Bandhu' in Sourashtra?",
        options: [
          "பந்து / கால்பந்து (Ball / Football)",
          "மிதிவண்டி (Cycle)",
          "பேட் (Bat)"
        ],
        correctIndex: 0,
        explanation: "'பந்து³ (Bandhu)' என்றால் பந்து (Ball). 'ரமொ (Ramo)' என்றால் விளையாட்டு (Play/Game).",
        tanglishExplanation: "'Bandhu' endral Pandhu (Ball). 'Ramo' endral Vilaiyaattu (Game)."
      },
      {
        type: "dialogue",
        speaker: "arun",
        sourashtra: "அம்கொ டீம் போஹுத் பாஸ்ட்! கோல் மாரோ!",
        pronunciation: "Amko team bohut fast! Goal maaro!",
        tamil: "நம் அணி மிகவும் வேகமாக ஆடுகிறது! கோல் அடி!",
        tanglish: "Nam ani migavum vaegamaaga aadugiradhu! Goal adi!",
        english: "Our team is playing very fast! Kick a goal!"
      },
      {
        type: "dialogue",
        speaker: "siva",
        sourashtra: "கோல் ஹோயி! அம்கொ டீம் ஜிங்க்லா! சியர்ஸ்!",
        pronunciation: "Goal hoyi! Amko team jingla! Cheers!",
        tamil: "கோல் விழுந்தது! நம் அணி வெற்றி பெற்றது! வாழ்த்துகள்!",
        tanglish: "Goal vizhundhadhu! Nam ani vetri petradhu! Vaazhthugal!",
        english: "It's a goal! Our team has won the match! Hurrah!"
      }
    ]
  }
];

const targetPath = path.join(__dirname, 'duolingo_stories.json');
fs.writeFileSync(targetPath, JSON.stringify(ALL_19_STORIES, null, 2), 'utf-8');
console.log('Successfully generated all', ALL_19_STORIES.length, 'Duolingo Stories at', targetPath);
