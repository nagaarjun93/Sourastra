/**
 * Tanglish (Tamil in English Script / தமிழ் ஆங்கிலத்தில்) Utility
 * Converts Tamil words and phrases into natural, colloquial Tanglish.
 */

// Common Tamil word overrides for natural spoken Tanglish
const TANGLISH_DICTIONARY: Record<string, string> = {
  // Greetings & Courtesies
  'வணக்கம்': 'Vanakkam',
  'நன்றி': 'Nandri',
  'வணக்கம்!': 'Vanakkam!',
  'நன்றி!': 'Nandri!',
  'வாருங்கள்': 'Vaarungal',
  'போங்கள்': 'Pongal',
  'வா': 'Vaa',
  'போ': 'Po',
  'ஆம்': 'Aam',
  'ஆமாம்': 'Aamam',
  'இல்லை': 'Illai',
  'சரி': 'Sari',
  'தயவுசெய்து': 'Thayavuseidhu',
  'மன்னிக்கவும்': 'Mannikkavum',

  // Pronouns
  'நான்': 'Naan',
  'என்னை': 'Ennai',
  'எனக்கு': 'Enakku',
  'என்': 'En',
  'நீ': 'Nee',
  'நீங்கள்': 'Neengal',
  'நீங்க': 'Neenga',
  'உன்னை': 'Unnai',
  'உங்களுக்கு': 'Ungalukku',
  'அவன்': 'Avan',
  'அவனை': 'Avanai',
  'அவனுக்கு': 'Avanukku',
  'அவள்': 'Aval',
  'அவளை': 'Avalai',
  'அவளுக்கு': 'Avalukku',
  'அவர்கள்': 'Avargal',
  'அவர்களை': 'Avargalai',
  'அவர்களுக்கு': 'Avargalukku',
  'நாம்': 'Naam',
  'நாங்கள்': 'Naangal',
  'நமக்கு': 'Namakku',
  'எங்களுக்கு': 'Engalukku',
  'அது': 'Adhu',
  'இது': 'Idhu',
  'அவை': 'Avai',
  'இவை': 'Ivai',

  // Questions
  'எப்படி': 'Eppadi',
  'எங்கே': 'Engae',
  'எப்போது': 'Eppodhu',
  'ஏன்': 'Aen',
  'என்ன': 'Enna',
  'யார்': 'Yaar',
  'எது': 'Edhu',
  'எவ்வளவு': 'Evvalavu',
  'எத்தனை': 'Ethanai',

  // Common Verbs & States
  'பார்': 'Paar',
  'பாருங்கள்': 'Paarungal',
  'பார்த்தேன்': 'Paarthaen',
  'இருக்கிறேன்': 'Irukkiraen',
  'இருக்கிறீர்கள்': 'Irukkireergal',
  'இருக்கீங்க': 'Irukkeenga',
  'இருக்கிறார்': 'Irukkiraar',
  'இருக்கிறார்கள்': 'Irukkiraargal',
  'சாப்பிடு': 'Saappidu',
  'சாப்பிட்டேன்': 'Saappittaen',
  'சாப்பிட்டீர்களா': 'Saappitteergalaa',
  'சாப்டீங்களா': 'Saapteengala',
  'குடி': 'Kudi',
  'குடித்தேன்': 'Kudithaen',
  'குடிக்கிறீர்களா': 'Kudikkireergalaa',
  'கொடுங்கள்': 'Kodungal',
  'தாருங்கள்': 'Thaarungal',
  'வாங்குங்கள்': 'Vaangungal',
  'சொல்லுங்கள்': 'Sollungal',
  'கேளுங்கள்': 'Kelungal',
  'போய் வாருங்கள்': 'Poi vaarungal',
  'நலமாக இருக்கிறேன்': 'Nalamaaga irukkiraen',
  'நல்லா இருக்கேன்': 'Nalla irukkaen',

  // Common Nouns
  'டீ': 'Tea',
  'தேநீர்': 'Theaneer',
  'காபி': 'Coffee',
  'தண்ணீர்': 'Thanneer',
  'பால்': 'Paal',
  'சாதம்': 'Saadham',
  'சாப்பாடு': 'Saappaadu',
  'வடை': 'Vadai',
  'இட்லி': 'Idli',
  'தோசை': 'Dhosai',
  'கடை': 'Kadai',
  'துணிக்கடை': 'Thunikkadai',
  'விலை': 'Vilai',
  'ரூபாய்': 'Roobai',
  'பணம்': 'Panam',
  'பஸ்': 'Bus',
  'பேருந்து': 'Paerundhu',
  'ரயில்': 'Train',
  'டிக்கெட்': 'Ticket',
  'பயணம்': 'Payanam',
  'மருத்துவர்': 'Maruthuvar',
  'மருத்துவமனை': 'Maruthuvamanai',
  'டாக்டர்': 'Doctor',
  'மருந்து': 'Marundhu',
  'காய்ச்சல்': 'Kaaichal',
  'தலைவலி': 'Thalaivali',
  'உடல்': 'Udal',
  'கை': 'Kai',
  'கால்': 'Kaal',
  'கண்': 'Kann',
  'வீடு': 'Veedu',
  'அம்மா': 'Amma',
  'அப்பா': 'Appa',
  'அண்ணன்': 'Annan',
  'தம்பி': 'Thambi',
  'அக்கா': 'Akka',
  'தங்கை': 'Thangai',
  'மகன்': 'Magan',
  'மகள்': 'Magal',
  'நண்பர்': 'Nanbar',
  'ஊர்': 'Oor',
  'நேரம்': 'Neram',
  'நாள்': 'Naal',
};

// Independent vowels
const VOWELS: Record<string, string> = {
  'அ': 'a',
  'ஆ': 'aa',
  'இ': 'i',
  'ஈ': 'ee',
  'உ': 'u',
  'ஊ': 'oo',
  'எ': 'e',
  'ஏ': 'ae',
  'ஐ': 'ai',
  'ஒ': 'o',
  'ஓ': 'oa',
  'ஔ': 'au',
  'ஃ': 'ak',
};

// Consonants with inherent 'a'
const CONSONANTS: Record<string, string> = {
  'க': 'k',
  'ங': 'ng',
  'ச': 's',
  'ஞ': 'ny',
  'ட': 't',
  'ண': 'n',
  'த': 'th',
  'ந': 'n',
  'ப': 'p',
  'ம': 'm',
  'ய': 'y',
  'ர': 'r',
  'ல': 'l',
  'வ': 'v',
  'ழ': 'zh',
  'ள': 'l',
  'ற': 'r',
  'ன': 'n',
  'ஜ': 'j',
  'ஷ': 'sh',
  'ஸ': 's',
  'ஹ': 'h',
  'க்ஷ': 'ksh',
  'ஶ': 'sh',
};

// Vowel signs (diacritics)
const VOWEL_SIGNS: Record<string, string> = {
  '\u0BBE': 'aa', // ா
  '\u0BBF': 'i',  // ி
  '\u0BC0': 'ee', // ீ
  '\u0BC1': 'u',  // ு
  '\u0BC2': 'oo', // ூ
  '\u0BC6': 'e',  // ெ
  '\u0BC7': 'ae', // ே
  '\u0BC8': 'ai', // ை
  '\u0BCA': 'o',  // ொ
  '\u0BCB': 'oa', // ோ
  '\u0BCC': 'au', // ௌ
};

const PULLI = '\u0BCD'; // ்

/**
 * Phonetically transliterate a single Tamil word into Tanglish
 */
function transliterateTamilWord(word: string): string {
  // Check exact dictionary match
  const clean = word.trim().replace(/[.,!?;:"'()]/g, '');
  if (TANGLISH_DICTIONARY[clean]) {
    // Preserve trailing punctuation
    const punc = word.match(/[.,!?;:"'()]+$/);
    return TANGLISH_DICTIONARY[clean] + (punc ? punc[0] : '');
  }

  let result = '';
  let i = 0;
  const len = word.length;

  while (i < len) {
    const ch = word[i];
    const nextCh = i + 1 < len ? word[i + 1] : '';

    // Check independent vowel
    if (VOWELS[ch]) {
      result += VOWELS[ch];
      i++;
      continue;
    }

    // Check consonant
    if (CONSONANTS[ch]) {
      let cons = CONSONANTS[ch];

      // Contextual pronunciation rules for natural Tanglish
      if (ch === 'க' && i > 0 && !result.endsWith('k') && !result.endsWith('t') && !result.endsWith('p')) {
        cons = 'g';
      } else if (ch === 'ட' && i > 0 && !result.endsWith('t')) {
        cons = 'd';
      } else if (ch === 'த' && i > 0 && !result.endsWith('th')) {
        cons = 'dh';
      } else if (ch === 'ப' && i > 0 && (result.endsWith('m') || result.endsWith('a') || result.endsWith('i') || result.endsWith('u'))) {
        cons = 'b';
      }

      // Check if followed by pulli (pure consonant)
      if (nextCh === PULLI) {
        result += cons;
        i += 2;
        continue;
      }

      // Check if followed by a vowel sign
      if (VOWEL_SIGNS[nextCh]) {
        result += cons + VOWEL_SIGNS[nextCh];
        i += 2;
        continue;
      }

      // Inherent 'a'
      result += cons + 'a';
      i++;
      continue;
    }

    // Non-Tamil characters (punctuation, numbers, English, spaces)
    result += ch;
    i++;
  }

  // Capitalize first letter of word
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }

  return result;
}

/**
 * Convert any Tamil text (single word or entire sentence) into readable Tanglish
 * Example: "வணக்கம்! நீங்கள் எப்படி இருக்கிறீர்கள்?" -> "Vanakkam! Neengal eppadi irukkireergal?"
 */
export function getTanglish(tamilText?: string | null): string {
  if (!tamilText || typeof tamilText !== 'string') return '';

  const trimmed = tamilText.trim();
  if (!trimmed) return '';

  // Check direct sentence match in dictionary
  if (TANGLISH_DICTIONARY[trimmed]) {
    return TANGLISH_DICTIONARY[trimmed];
  }

  // Check comma or slash separated items (e.g. "நான், என்னை" or "அம்மா / தாய்")
  if (trimmed.includes(',') || trimmed.includes('/') || trimmed.includes('•')) {
    const parts = trimmed.split(/([,/\u2022])/);
    return parts.map((part) => {
      if (part === ',' || part === '/' || part === '•') return part + ' ';
      return getTanglish(part.trim());
    }).join('').replace(/\s+/g, ' ').trim();
  }

  // Break sentence into words while preserving spacing and punctuation
  const tokens = trimmed.split(/(\s+)/);
  const transliterated = tokens.map((token) => {
    if (/^\s+$/.test(token)) return token;
    return transliterateTamilWord(token);
  });

  return transliterated.join('');
}
