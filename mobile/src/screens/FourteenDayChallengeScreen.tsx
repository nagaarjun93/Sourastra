import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { AudioButton } from '../components/AudioButton';
import { COLORS, SHADOWS } from '../constants/theme';
import { ProgressService } from '../services/progressService';

interface DayLessonWord {
  sourashtra: string;
  sourashtraScript: string;
  pronunciation: string;
  tamil: string;
  tanglish: string;
  english: string;
}

interface DayChallenge {
  day: number;
  title: string;
  tamilTitle: string;
  tanglishTitle: string;
  focus: string;
  summary: string;
  words: DayLessonWord[];
  practiceTask: string;
}

const CHALLENGE_DAYS: DayChallenge[] = [
  {
    day: 1,
    title: 'Greetings & Polite Manners',
    tamilTitle: 'வணக்கம் & மரியாதைகள்',
    tanglishTitle: 'Vanakkam & Mariyaadhaigal',
    focus: 'Basic Greetings',
    summary: 'Learn essential courtesy words to start any conversation politely.',
    words: [
      {
        sourashtra: 'நமஸ்காரு',
        sourashtraScript: 'ꢥꢪꢱ꣄ꢒꢵꢬꢸ',
        pronunciation: 'Namaskaaru',
        tamil: 'வணக்கம்',
        tanglish: 'Vanakkam',
        english: 'Hello / Greetings',
      },
      {
        sourashtra: 'தந்யவாது',
        sourashtraScript: 'ꢣꢥ꣄ꢫꢮꢵꢢꢸ',
        pronunciation: 'Dhanyavaadhu',
        tamil: 'நன்றி',
        tanglish: 'Nandri',
        english: 'Thank you',
      },
      {
        sourashtra: 'ஹொவ்',
        sourashtraScript: 'ꢲꣁꢮ꣄',
        pronunciation: 'Hov',
        tamil: 'ஆம் / சரி',
        tanglish: 'Aam / Sari',
        english: 'Yes',
      },
      {
        sourashtra: 'நாஹி',
        sourashtraScript: 'ꢥꢵꢲꢶ',
        pronunciation: 'Naahi',
        tamil: 'இல்லை',
        tanglish: 'Illai',
        english: 'No',
      },
      {
        sourashtra: 'சொக்கட்',
        sourashtraScript: 'ꢗꣁꢒ꣄ꢒꢜ꣄',
        pronunciation: 'Chokkat',
        tamil: 'நல்லது / சிறப்பு',
        tanglish: 'Nalladhu / Sirappu',
        english: 'Good / Fine',
      },
    ],
    practiceTask: 'Greet someone with "நமஸ்காரு" and reply "ஹொவ், சொக்கட்!" when asked how you are.',
  },
  {
    day: 2,
    title: 'Pronouns & Being (To Be)',
    tamilTitle: 'நான், நீ, அவன் & இருத்தல்',
    tanglishTitle: 'Naan, Nee, Avan & Irukkiren',
    focus: 'Self & Others',
    summary: 'Master speaking about yourself, others, and the state of being (அஸா/நாஹி).',
    words: [
      {
        sourashtra: 'மீ',
        sourashtraScript: 'ꢪꢷ',
        pronunciation: 'Mee',
        tamil: 'நான்',
        tanglish: 'Naan',
        english: 'I / Me',
      },
      {
        sourashtra: 'தூ',
        sourashtraScript: 'ꢢꢹ',
        pronunciation: 'Thu',
        tamil: 'நீ',
        tanglish: 'Nee',
        english: 'You (informal)',
      },
      {
        sourashtra: 'தெமி',
        sourashtraScript: 'ꢢꢾꢪꢶ',
        pronunciation: 'Themi',
        tamil: 'நீங்கள்',
        tanglish: 'Neengal',
        english: 'You (respectful / plural)',
      },
      {
        sourashtra: 'வோ',
        sourashtraScript: 'ꢮꣁ',
        pronunciation: 'Vo',
        tamil: 'அவன் / அவள்',
        tanglish: 'Avan / Aval',
        english: 'He / She',
      },
      {
        sourashtra: 'அஸா',
        sourashtraScript: 'ꢂꢱꢵ',
        pronunciation: 'Asaa',
        tamil: 'இருக்கிறது / இருக்கிறேன்',
        tanglish: 'Irukkiradhu / Irukkiren',
        english: 'Is / Exists / Am',
      },
    ],
    practiceTask: 'Say "மீ சொக்கட் அஸா" (I am doing good!).',
  },
  {
    day: 3,
    title: 'Family & Sacred Relationships',
    tamilTitle: 'குடும்ப உறவுகள்',
    tanglishTitle: 'Kudumba Uravugal',
    focus: 'Family Members',
    summary: 'Address your family members with warmth and respect.',
    words: [
      {
        sourashtra: 'அம்மா / மாயி',
        sourashtraScript: 'ꢂꢪ꣄ꢪꢵ / ꢪꢵꢫꢶ',
        pronunciation: 'Ammaa / Maayi',
        tamil: 'அம்மா / தாய்',
        tanglish: 'Amma / Thaai',
        english: 'Mother',
      },
      {
        sourashtra: 'பாபு / போசி',
        sourashtraScript: 'ꢩꢵꢩꢸ / ꢩꣁꢱꢶ',
        pronunciation: 'Baabu / Bosi',
        tamil: 'அப்பா / தந்தை',
        tanglish: 'Appa / Thandhai',
        english: 'Father',
      },
      {
        sourashtra: 'பாவோ',
        sourashtraScript: 'ꢩꢵꢮꣁ',
        pronunciation: 'Bhaavo',
        tamil: 'சகோதரன் / அண்ணன்',
        tanglish: 'Sagodharan / Annan',
        english: 'Brother',
      },
      {
        sourashtra: 'பஹினி',
        sourashtraScript: 'ꢩꢲꢶꢥꢶ',
        pronunciation: 'Bahini',
        tamil: 'சகோதரி / தங்கை',
        tanglish: 'Sagodhari / Thangai',
        english: 'Sister',
      },
      {
        sourashtra: 'பே3டி',
        sourashtraScript: 'ꢩꢾꢞꢶ',
        pronunciation: 'Beti',
        tamil: 'மகள்',
        tanglish: 'Magal',
        english: 'Daughter',
      },
    ],
    practiceTask: 'Point to your family members and address them in Sourashtra.',
  },
  {
    day: 4,
    title: 'Home & Household Objects',
    tamilTitle: 'வீட்டுப் பொருட்கள்',
    tanglishTitle: 'Veettu Porutkal',
    focus: 'Around the House',
    summary: 'Identify common rooms and objects inside your home.',
    words: [
      {
        sourashtra: 'கே4ர்',
        sourashtraScript: 'ꢓꢾꢬ꣄',
        pronunciation: 'Gher',
        tamil: 'வீடு',
        tanglish: 'Veedu',
        english: 'House / Home',
      },
      {
        sourashtra: 'கவாடு3',
        sourashtraScript: 'ꢒꢮꢵꢞꢸ',
        pronunciation: 'Kavaadu',
        tamil: 'கதவு',
        tanglish: 'Kadhavu',
        english: 'Door',
      },
      {
        sourashtra: 'தாளி',
        sourashtraScript: 'ꢢꢵꢭꢶ',
        pronunciation: 'Thaali',
        tamil: 'தட்டு (உணவுத் தட்டு)',
        tanglish: 'Thattu',
        english: 'Plate',
      },
      {
        sourashtra: 'லோட்டோ',
        sourashtraScript: 'ꢭꣁꢜ꣄ꢜꣁ',
        pronunciation: 'Lotto',
        tamil: 'டம்ளர் / சொம்பு',
        tanglish: 'Tumbler / Sompu',
        english: 'Tumbler / Drinking vessel',
      },
      {
        sourashtra: 'தி3வொ',
        sourashtraScript: 'ꢞꢶꢮꣁ',
        pronunciation: 'Divo',
        tamil: 'விளக்கு',
        tanglish: 'Vilakku',
        english: 'Lamp / Light',
      },
    ],
    practiceTask: 'Say "கே4ர்கு ஜா" (Go home) and "திவொ லாவ்" (Light the lamp).',
  },
  {
    day: 5,
    title: 'Food, Dining & Water',
    tamilTitle: 'உணவு & விருந்தோம்பல்',
    tanglishTitle: 'Unavu & Pazhakkangal',
    focus: 'Meals & Dining',
    summary: 'Order and describe delicious Sourashtra food items and water.',
    words: [
      {
        sourashtra: 'நீரு',
        sourashtraScript: 'ꢥꢷꢬꢸ',
        pronunciation: 'Neeru',
        tamil: 'தண்ணீர்',
        tanglish: 'Thanneer',
        english: 'Water',
      },
      {
        sourashtra: 'பா3த்து',
        sourashtraScript: 'ꢩꢵꢢ꣄ꢢꢸ',
        pronunciation: 'Baathu',
        tamil: 'சாதம் / சோறு',
        tanglish: 'Saadham / Soru',
        english: 'Cooked Rice',
      },
      {
        sourashtra: 'தூ3த்',
        sourashtraScript: 'ꢣꢹꢢ꣄',
        pronunciation: 'Doot',
        tamil: 'பால்',
        tanglish: 'Paal',
        english: 'Milk',
      },
      {
        sourashtra: 'சாரு',
        sourashtraScript: 'ꢗꢵꢬꢸ',
        pronunciation: 'Saaru',
        tamil: 'ரசம்',
        tanglish: 'Rasam',
        english: 'Soup / Rasam',
      },
      {
        sourashtra: 'போஜன்',
        sourashtraScript: 'ꢩꣁꢙꢥ꣄',
        pronunciation: 'Bhojan',
        tamil: 'உணவு / சாப்பாடு',
        tanglish: 'Saappaadu',
        english: 'Food / Meal',
      },
    ],
    practiceTask: 'Ask "நீரு திய்யா" (Please give water).',
  },
  {
    day: 6,
    title: 'Numbers 1 to 20 & Time',
    tamilTitle: 'எண்கள் 1-20 & காலம்',
    tanglishTitle: 'Engal 1-20 & Kaalam',
    focus: 'Counting & Numbers',
    summary: 'Count with confidence from one to ten and express quantities.',
    words: [
      {
        sourashtra: 'ஒக்கோ',
        sourashtraScript: 'ꢂꢒ꣄ꢒꣁ',
        pronunciation: 'Okko',
        tamil: 'ஒன்று',
        tanglish: 'Ondru',
        english: 'One (1)',
      },
      {
        sourashtra: 'தொ3',
        sourashtraScript: 'ꢞꣁ',
        pronunciation: 'Dho',
        tamil: 'இரண்டு',
        tanglish: 'Irandu',
        english: 'Two (2)',
      },
      {
        sourashtra: 'தீனி',
        sourashtraScript: 'ꢢꢷꢥꢶ',
        pronunciation: 'Theeni',
        tamil: 'மூன்று',
        tanglish: 'Moondru',
        english: 'Three (3)',
      },
      {
        sourashtra: 'சாரி',
        sourashtraScript: 'ꢗꢵꢬꢶ',
        pronunciation: 'Saari',
        tamil: 'நான்கு',
        tanglish: 'Naangu',
        english: 'Four (4)',
      },
      {
        sourashtra: 'பாஞ்சி',
        sourashtraScript: 'ꢩꢵꢘ꣄ꢗꢶ',
        pronunciation: 'Paanji',
        tamil: 'ஐந்து',
        tanglish: 'Aindhu',
        english: 'Five (5)',
      },
    ],
    practiceTask: 'Count aloud 1 to 5: "ஒக்கோ, தொ, தீனி, சாரி, பாஞ்சி".',
  },
  {
    day: 7,
    title: 'Mid-Way Review & Speaking Drills',
    tamilTitle: 'முதல் வார மீள்பார்வை',
    tanglishTitle: 'Mudhal Vaara Meelpaarvai',
    focus: 'Week 1 Review',
    summary: 'Consolidate everything learned in Days 1 to 6 with rapid conversation drills.',
    words: [
      {
        sourashtra: 'கீ கரத் அஸா?',
        sourashtraScript: 'ꢒꢷ ꢒꢬꢢ꣄ ꢂꢱꢵ?',
        pronunciation: 'Kee karat asaa?',
        tamil: 'என்ன செய்கிறீர்கள்?',
        tanglish: 'Enna seigireergal?',
        english: 'What are you doing?',
      },
      {
        sourashtra: 'மீ பா3த்து காத் அஸா',
        sourashtraScript: 'ꢪꢷ ꢩꢵꢢ꣄ꢢꢸ ꢒꢵꢢ꣄ ꢂꢱꢵ',
        pronunciation: 'Mee baathu khaat asaa',
        tamil: 'நான் சாப்பாடு சாப்பிடுகிறேன்',
        tanglish: 'Naan saappaadu saappidugiren',
        english: 'I am eating food',
      },
      {
        sourashtra: 'தூ கே4ர்கு ஆவ்',
        sourashtraScript: 'ꢢꢹ ꢓꢾꢬ꣄ꢒꢸ ꢂꢮ꣄',
        pronunciation: 'Thu gherku aav',
        tamil: 'நீ வீட்டுக்கு வா',
        tanglish: 'Nee veettukku vaa',
        english: 'You come home',
      },
      {
        sourashtra: 'சொக்கட் கா3மு',
        sourashtraScript: 'ꢗꣁꢒ꣄ꢒꢜ꣄ ꢒꢵꢪꢸ',
        pronunciation: 'Chokkat gaamu',
        tamil: 'நல்ல வேலை / பாராட்டு',
        tanglish: 'Nalla velai',
        english: 'Good job / Well done',
      },
    ],
    practiceTask: 'Speak these 4 review sentences aloud using the Audio button.',
  },
  {
    day: 8,
    title: 'Daily Verbs & Actions',
    tamilTitle: 'தினசரி வினைகள்',
    tanglishTitle: 'Dhinasari Vinaigal',
    focus: 'Action Words',
    summary: 'The core action verbs of everyday life: do, eat, drink, go, and come.',
    words: [
      {
        sourashtra: 'கர்',
        sourashtraScript: 'ꢒꢬ꣄',
        pronunciation: 'Kar',
        tamil: 'செய் / பண்ணு',
        tanglish: 'Sei / Pannu',
        english: 'Do / Perform',
      },
      {
        sourashtra: 'கா',
        sourashtraScript: 'ꢒꢵ',
        pronunciation: 'Khaa',
        tamil: 'சாப்பிடு / உண்',
        tanglish: 'Saappidu / Un',
        english: 'Eat',
      },
      {
        sourashtra: 'பீ',
        sourashtraScript: 'ꢩꢷ',
        pronunciation: 'Pee',
        tamil: 'குடி / பருகு',
        tanglish: 'Kudi / Parugu',
        english: 'Drink',
      },
      {
        sourashtra: 'ஜா',
        sourashtraScript: 'ꢙꢵ',
        pronunciation: 'Jaa',
        tamil: 'போ / செல்',
        tanglish: 'Po / Sel',
        english: 'Go',
      },
      {
        sourashtra: 'ஆவ்',
        sourashtraScript: 'ꢂꢮ꣄',
        pronunciation: 'Aav',
        tamil: 'வா / வருக',
        tanglish: 'Vaa / Varuga',
        english: 'Come',
      },
    ],
    practiceTask: 'Form a sentence using "பீ": "நீரு பீ" (Drink water).',
  },
  {
    day: 9,
    title: 'Question Words (Who, What, Where)',
    tamilTitle: 'கேள்விச் சொற்கள்',
    tanglishTitle: 'Kaelvi Sorkal',
    focus: 'Asking Inquiries',
    summary: 'Ask questions freely to discover names, places, and reasons.',
    words: [
      {
        sourashtra: 'கீ',
        sourashtraScript: 'ꢒꢷ',
        pronunciation: 'Kee',
        tamil: 'என்ன?',
        tanglish: 'Enna?',
        english: 'What?',
      },
      {
        sourashtra: 'கொண்',
        sourashtraScript: 'ꢒꣁꢠ꣄',
        pronunciation: 'Kon',
        tamil: 'யார்?',
        tanglish: 'Yaar?',
        english: 'Who?',
      },
      {
        sourashtra: 'கஹி',
        sourashtraScript: 'ꢒꢲꢶ',
        pronunciation: 'Kahi',
        tamil: 'எங்கே?',
        tanglish: 'Engae?',
        english: 'Where?',
      },
      {
        sourashtra: 'கேத்',
        sourashtraScript: 'ꢒꢾꢢ꣄',
        pronunciation: 'Keth',
        tamil: 'எப்போது?',
        tanglish: 'Eppoadhu?',
        english: 'When?',
      },
      {
        sourashtra: 'கிஸோ / கிஸா',
        sourashtraScript: 'ꢒꢶꢱꣁ / ꢒꢶꢱꢵ',
        pronunciation: 'Kiso / Kisaa',
        tamil: 'எப்படி?',
        tanglish: 'Eppadi?',
        english: 'How?',
      },
    ],
    practiceTask: 'Ask: "தூ கஹி ஜாத் அஸா?" (Where are you going?).',
  },
  {
    day: 10,
    title: 'Colors & Descriptive Adjectives',
    tamilTitle: 'நிறங்கள் & வர்ணனைகள்',
    tanglishTitle: 'Nirangal & Varnanaigal',
    focus: 'Descriptions & Colors',
    summary: 'Describe the world around you with vibrant colors and qualities.',
    words: [
      {
        sourashtra: 'தோ4ளோ',
        sourashtraScript: 'ꢞꣁꢭꣁ',
        pronunciation: 'Dholo',
        tamil: 'வெள்ளை',
        tanglish: 'Vellai',
        english: 'White',
      },
      {
        sourashtra: 'காளோ',
        sourashtraScript: 'ꢒꢵꢭꣁ',
        pronunciation: 'Kaalo',
        tamil: 'கருப்பு',
        tanglish: 'Karuppu',
        english: 'Black',
      },
      {
        sourashtra: 'ரத்தோ',
        sourashtraScript: 'ꢬꢢ꣄ꢢꣁ',
        pronunciation: 'Rattho',
        tamil: 'சிகப்பு / சிவப்பு',
        tanglish: 'Sivappu',
        english: 'Red',
      },
      {
        sourashtra: 'ஹிர்வே',
        sourashtraScript: 'ꢲꢶꢬ꣄ꢮꢾ',
        pronunciation: 'Hirve',
        tamil: 'பச்சை',
        tanglish: 'Pachai',
        english: 'Green',
      },
      {
        sourashtra: 'பீளோ',
        sourashtraScript: 'ꢩꢷꢭꣁ',
        pronunciation: 'Peelo',
        tamil: 'மஞ்சள்',
        tanglish: 'Manjal',
        english: 'Yellow',
      },
    ],
    practiceTask: 'Describe everyday colors around you in Sourashtra.',
  },
  {
    day: 11,
    title: 'Places, Market & Travel',
    tamilTitle: 'சந்தை, பயணம் & ஊர்',
    tanglishTitle: 'Sandhai, Payanam & Oor',
    focus: 'Travel & Town',
    summary: 'Navigate streets, bazaars, and temples with local fluency.',
    words: [
      {
        sourashtra: 'ஹாட்டு',
        sourashtraScript: 'ꢲꢵꢜ꣄ꢜꢸ',
        pronunciation: 'Haattu',
        tamil: 'சந்தை / கடைத்தெரு',
        tanglish: 'Sandhai / Kadaitheru',
        english: 'Market / Bazaar',
      },
      {
        sourashtra: 'தெ3வ்ரா',
        sourashtraScript: 'ꢞꢾꢮ꣄ꢬꢵ',
        pronunciation: 'Devraa',
        tamil: 'கோவில் / ஆலயம்',
        tanglish: 'Kovil / Aalayam',
        english: 'Temple',
      },
      {
        sourashtra: 'வாட்',
        sourashtraScript: 'ꢮꢵꢜ꣄',
        pronunciation: 'Vaat',
        tamil: 'வழி / பாதை',
        tanglish: 'Vazhi / Paadhai',
        english: 'Way / Path / Road',
      },
      {
        sourashtra: 'கா3வு',
        sourashtraScript: 'ꢒꢵꢮꢸ',
        pronunciation: 'Gaavu',
        tamil: 'ஊர் / கிராமம்',
        tanglish: 'Oor / Kkiraamam',
        english: 'Town / Village',
      },
    ],
    practiceTask: 'Say "மீ தெவ்ராகு ஜாத் அஸா" (I am going to the temple).',
  },
  {
    day: 12,
    title: 'Common Daily Sentences',
    tamilTitle: 'தினசரி பேச்சு வாக்கியங்கள்',
    tanglishTitle: 'Dhinasari Paechu Vaakkiyangal',
    focus: 'Fluent Sentences',
    summary: 'Put sentences together naturally for spontaneous everyday conversations.',
    words: [
      {
        sourashtra: 'தும்ஹொ நாவ் கீ?',
        sourashtraScript: 'ꢢꢸꢪ꣄ꢲꣁ ꢥꢵꢮ꣄ ꢒꢷ?',
        pronunciation: 'Thumho naav kee?',
        tamil: 'உங்கள் பெயர் என்ன?',
        tanglish: 'Ungal peyar enna?',
        english: 'What is your name?',
      },
      {
        sourashtra: 'மஹொ நாவ்...',
        sourashtraScript: 'ꢪꢲꣁ ꢥꢵꢮ꣄...',
        pronunciation: 'Maho naav...',
        tamil: 'என் பெயர்...',
        tanglish: 'En peyar...',
        english: 'My name is...',
      },
      {
        sourashtra: 'தும்ஹி சொக்கட் அஸா?',
        sourashtraScript: 'ꢢꢸꢪ꣄ꢲꢶ ꢗꣁꢒ꣄ꢒꢜ꣄ ꢂꢱꢵ?',
        pronunciation: 'Thumhi chokkat asaa?',
        tamil: 'நீங்கள் நன்றாக இருக்கிறீர்களா?',
        tanglish: 'Neengal nandraaga irukkireergalaa?',
        english: 'Are you doing well?',
      },
      {
        sourashtra: 'ஹொவ், மீ சொக்கட் அஸா!',
        sourashtraScript: 'ꢲꣁꢮ꣄, ꢪꢷ ꢗꣁꢒ꣄ꢒꢜ꣄ ꢂꢱꢵ!',
        pronunciation: 'Hov, mee chokkat asaa!',
        tamil: 'ஆம், நான் நன்றாக இருக்கிறேன்!',
        tanglish: 'Aam, naan nandraaga irukkiren!',
        english: 'Yes, I am doing well!',
      },
    ],
    practiceTask: 'Introduce yourself in Sourashtra: "மஹொ நாவ் [பெயர்]".',
  },
  {
    day: 13,
    title: 'Conversation Mastery & Roleplay',
    tamilTitle: 'முழுமையான உரையாடல் பயிற்சி',
    tanglishTitle: 'Muzhumaiyaana Uraiyaadal Payirchi',
    focus: 'Roleplay Dialogues',
    summary: 'Interactive dialogue roleplays to sharpen your listening & speech reflex before the Level Test.',
    words: [
      {
        sourashtra: 'தாள், ஏக் மினிட்!',
        sourashtraScript: 'ꢢꢵꢭ꣄, ꢂꢒ꣄ ꢪꢶꢥꢶꢜ꣄!',
        pronunciation: 'Taal, ek minute!',
        tamil: 'காத்திரு, ஒரு நிமிடம்!',
        tanglish: 'Kaathiru, oru nimidam!',
        english: 'Wait, one minute!',
      },
      {
        sourashtra: 'ஜா2க்ரதே!',
        sourashtraScript: 'ꢙꢵꢒ꣄ꢬꢢꢾ!',
        pronunciation: 'Jaagrade!',
        tamil: 'ஜாக்கிரதை!',
        tanglish: 'Jaakkiradhai!',
        english: 'Be careful / Take care!',
      },
      {
        sourashtra: 'பச்செ பா3கார் போ4டு3!',
        sourashtraScript: 'ꢩꢗ꣄ꢗꢾ ꢩꢵꢒꢵꢬ꣄ ꢩꣁꢞꢸ!',
        pronunciation: 'Pachhe baagaar bhodu!',
        tamil: 'பிறகு சந்திப்போம்!',
        tanglish: 'Piragu sandhippom!',
        english: 'See you later!',
      },
    ],
    practiceTask: 'Say "பச்செ பா3கார் போ4டு3!" to a friend or tutor.',
  },
  {
    day: 14,
    title: 'Level 1 Final Test (Next Level Gate)',
    tamilTitle: 'இறுதித் தேர்வு & அடுத்த நிலைக்கான தகுதி',
    tanglishTitle: 'Irudhi Thaervu & Adutha Nilai Thagudhi',
    focus: 'Next Level Qualifying Test',
    summary: '⚠️ இந்தத் தேர்வில் 6/8 தேர்ச்சி பெற்றால்தான் அடுத்த நிலைக்கு (Level 2) செல்ல முடியும்!',
    words: [],
    practiceTask: 'குறைந்தது 6/8 மதிப்பெண் பெற்று அடுத்த நிலையை (Level 2: Intermediate) அன்லாக் செய்யுங்கள்!',
  },
];

interface QuizQuestion {
  id: string;
  question: string;
  sourashtraScript?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const FINAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'How do you say "வணக்கம்" (Hello / Greetings) in Sourashtra?',
    sourashtraScript: 'ꢥꢪꢱ꣄ꢒꢵꢬꢸ',
    options: ['தந்யவாது (Dhanyavaadhu)', 'நமஸ்காரு (Namaskaaru)', 'சொக்கட் (Chokkat)', 'நாஹி (Naahi)'],
    correctIndex: 1,
    explanation: '"நமஸ்காரு" is the traditional respectful Sourashtra greeting.',
  },
  {
    id: 'q2',
    question: 'What does "மீ" (Mee / ꢪꢷ) mean?',
    sourashtraScript: 'ꢪꢷ',
    options: ['நீ (You)', 'அவன் (He)', 'நான் (I / Me)', 'நாங்கள் (We)'],
    correctIndex: 2,
    explanation: '"மீ" means "நான்" (I / Me).',
  },
  {
    id: 'q3',
    question: 'Which word means "வீடு" (Home / House)?',
    options: ['லோட்டோ (Lotto)', 'கே4ர் (Gher)', 'கவாடு3 (Kavaadu)', 'தி3வொ (Divo)'],
    correctIndex: 1,
    explanation: '"கே4ர்" (Gher / ꢓꢾꢬ꣄) means "வீடு" (House / Home).',
  },
  {
    id: 'q4',
    question: 'How do you say "தண்ணீர்" (Water) in Sourashtra?',
    sourashtraScript: 'ꢥꢷꢬꢸ',
    options: ['நீரு (Neeru)', 'தூ3த் (Doot)', 'பா3த்து (Baathu)', 'சாரு (Saaru)'],
    correctIndex: 0,
    explanation: '"நீரு" (Neeru / ꢥꢷꢬꢸ) means "தண்ணீர்" (Water).',
  },
  {
    id: 'q5',
    question: 'What is the number "இரண்டு" (Two - 2) in Sourashtra?',
    options: ['ஒக்கோ (Okko)', 'தீனி (Theeni)', 'தொ3 (Dho)', 'சாரி (Saari)'],
    correctIndex: 2,
    explanation: '"தொ3" (Dho / ꢞꣁ) is the number 2.',
  },
  {
    id: 'q6',
    question: 'What is the meaning of the question word "கஹி" (Kahi / ꢒꢲꢶ)?',
    sourashtraScript: 'ꢒꢲꢶ',
    options: ['என்ன? (What?)', 'எங்கே? (Where?)', 'யார்? (Who?)', 'எப்போது? (When?)'],
    correctIndex: 1,
    explanation: '"கஹி" means "எங்கே?" (Where?).',
  },
  {
    id: 'q7',
    question: 'What does the verb "கர்" (Kar / ꢒꢬ꣄) mean?',
    options: ['செய் / பண்ணு (Do)', 'சாப்பிடு (Eat)', 'குடி (Drink)', 'செல் (Go)'],
    correctIndex: 0,
    explanation: '"கர்" means "செய் / பண்ணு" (Do / Act).',
  },
  {
    id: 'q8',
    question: 'What does "பச்செ பா3கார் போ4டு3" mean?',
    sourashtraScript: 'ꢩꢗ꣄ꢗꢾ ꢩꢵꢒꢵꢬ꣄ ꢩꣁꢞꢸ',
    options: ['வீட்டுக்கு வா (Come home)', 'பிறகு சந்திப்போம் (See you later)', 'ஜாக்கிரதை (Be careful)', 'சாப்பிடு (Eat food)'],
    correctIndex: 1,
    explanation: '"பச்செ பா3கார் போ4டு3" means "பிறகு சந்திப்போம்" (See you later).',
  },
];

export default function FourteenDayChallengeScreen({ navigation }: { navigation: any }) {
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayChallenge | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Day 14 Quiz State
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    loadChallengeProgress();
  }, []);

  const loadChallengeProgress = async () => {
    const data = await ProgressService.loadProgress();
    if (data && data.completedChallengeDays) {
      setCompletedDays(data.completedChallengeDays);
    }
  };

  const isLevel2Unlocked = completedDays.includes(14);

  const handleOpenDay = (dayItem: DayChallenge) => {
    // Check sequential unlocking
    if (dayItem.day > 1 && !completedDays.includes(dayItem.day - 1)) {
      Alert.alert(
        '🔒 Day Locked!',
        `Day ${dayItem.day} பாடத்தைத் திறக்க, முதலில் Day ${dayItem.day - 1} பாடத்தை முடித்து தேர்ச்சி பெற வேண்டும்!`
      );
      return;
    }

    if (dayItem.day === 14) {
      // Must have finished Days 1 to 13
      const days1To13Done = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].every((d) =>
        completedDays.includes(d)
      );
      if (!days1To13Done) {
        Alert.alert(
          '🔒 இறுதித் தேர்வு பூட்டப்பட்டுள்ளது!',
          'Day 1 முதல் Day 13 வரையிலான அனைத்து பாடங்களையும் முடித்த பிறகே Day 14 இறுதித் தேர்வை எழுத முடியும்!'
        );
        return;
      }

      // Open Day 14 Quiz
      setCurrentQuizIndex(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setQuizFinished(false);
      setQuizModalVisible(true);
    } else {
      setSelectedDay(dayItem);
      setModalVisible(true);
    }
  };

  const handleMarkDayCompleted = async (dayNumber: number) => {
    const updated = await ProgressService.completeChallengeDay(dayNumber, 25);
    setCompletedDays(updated.completedChallengeDays || []);
    setModalVisible(false);
    Alert.alert(
      '🌟 Day Completed!',
      `Day ${dayNumber} முடிந்தது! (+25 XP)\nஅடுத்த நாள் பாடம் இப்போது திறக்கப்பட்டுள்ளது!`
    );
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedAnswer === FINAL_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = async () => {
    if (currentQuizIndex < FINAL_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Quiz finished
      setQuizFinished(true);
      const finalScore = quizScore + (selectedAnswer === FINAL_QUIZ_QUESTIONS[currentQuizIndex].correctIndex ? 1 : 0);
      if (finalScore >= 6) {
        const updated = await ProgressService.completeChallengeDay(14, 100);
        setCompletedDays(updated.completedChallengeDays || []);
      }
    }
  };

  const progressPercentage = Math.round((completedDays.length / 14) * 100);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Top Header with Back Navigation */}
      <Header
        title="14-Day Challenge"
        subtitle="14-நாள் சௌராஷ்ட்ர பயிற்சி சவால்"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Hero Progress Banner */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroBadge}>
                {isLevel2Unlocked ? '🌟 LEVEL 2 UNLOCKED' : '🔒 LEVEL 1 • BEGINNER'}
              </Text>
              <Text style={styles.heroTitle}>Sourashtra 14-Day Challenge</Text>
              <Text style={styles.heroTamil}>14 நாட்களில் சௌராஷ்ட்ர பாஷை தொடக்கம்</Text>
            </View>
            <View style={styles.trophyIconBox}>
              <Text style={{ fontSize: 30 }}>{isLevel2Unlocked ? '🚀' : '🎯'}</Text>
            </View>
          </View>

          {/* Progress bar */}
          <View style={styles.progressBarWrapper}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>Curriculum Progress</Text>
              <Text style={styles.progressPercent}>{progressPercentage}% ({completedDays.length}/14 Days)</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${Math.min(100, Math.max(5, progressPercentage))}%` }]} />
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>+{completedDays.length * 25 + (isLevel2Unlocked ? 75 : 0)}</Text>
              <Text style={styles.statKey}>XP Earned</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{14 - completedDays.length}</Text>
              <Text style={styles.statKey}>Days Left</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{isLevel2Unlocked ? 'Level 2 Unlocked' : 'Level 1 Active'}</Text>
              <Text style={styles.statKey}>Status</Text>
            </View>
          </View>

          {/* Level Transition Action Banner */}
          {isLevel2Unlocked ? (
            <TouchableOpacity
              style={styles.nextLevelHeroBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Stories')}
            >
              <Ionicons name="rocket" size={20} color="#FFFFFF" />
              <Text style={styles.nextLevelHeroBtnText}>🚀 Go to Next Level (Level 2 Stories)</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.levelRequirementBanner}>
              <Ionicons name="lock-closed" size={16} color="#FCD34D" style={{ marginRight: 6 }} />
              <Text style={styles.levelRequirementText}>
                ⚠️ இந்த 14-நாள் தேர்வில் (6/8+) தேர்ச்சி பெற்றால்தான் அடுத்த நிலைக்கு (Level 2) செல்ல முடியும்!
              </Text>
            </View>
          )}
        </Card>

        {/* Challenge Days Grid / List */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>14-Day Sequential Curriculum</Text>
          <Text style={styles.sectionSubtitle}>வரிசையாக கற்று அடுத்த நிலையை (Level 2) அடையுங்கள்</Text>
        </View>

        <View style={styles.daysList}>
          {CHALLENGE_DAYS.map((dayItem) => {
            const isCompleted = completedDays.includes(dayItem.day);
            const isUnlocked = dayItem.day === 1 || completedDays.includes(dayItem.day - 1);
            const isCurrent = !isCompleted && isUnlocked;

            return (
              <TouchableOpacity
                key={dayItem.day}
                activeOpacity={0.85}
                onPress={() => handleOpenDay(dayItem)}
                style={styles.dayCardTouchable}
              >
                <Card
                  style={[
                    styles.dayCard,
                    isCurrent && styles.dayCardCurrent,
                    isCompleted && styles.dayCardCompleted,
                    !isUnlocked && styles.dayCardLocked,
                  ]}
                >
                  <View style={styles.dayCardRow}>
                    {/* Day Number Badge */}
                    <View
                      style={[
                        styles.dayNumberBox,
                        isCompleted && styles.dayNumberBoxCompleted,
                        isCurrent && styles.dayNumberBoxCurrent,
                        !isUnlocked && styles.dayNumberBoxLocked,
                      ]}
                    >
                      {isCompleted ? (
                        <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                      ) : !isUnlocked ? (
                        <Ionicons name="lock-closed" size={20} color="#94A3B8" />
                      ) : (
                        <>
                          <Text style={[styles.dayNumberText, isCurrent && styles.dayNumberTextCurrent]}>
                            D{dayItem.day}
                          </Text>
                          <Text style={[styles.dayNumberSub, isCurrent && styles.dayNumberSubCurrent]}>
                            DAY
                          </Text>
                        </>
                      )}
                    </View>

                    {/* Day Info */}
                    <View style={styles.dayContentBox}>
                      <View style={styles.dayHeaderRow}>
                        <Text style={[styles.dayTitle, !isUnlocked && styles.dayTitleLocked]} numberOfLines={1}>
                          Day {dayItem.day}: {dayItem.title}
                        </Text>
                        {dayItem.day === 14 ? (
                          <Badge label="Next Level Gate" variant={isCompleted ? 'success' : 'primary'} />
                        ) : (
                          <Badge label={isCompleted ? 'Done' : '+25 XP'} variant={isCompleted ? 'success' : 'secondary'} />
                        )}
                      </View>

                      <Text style={styles.dayTamilTitle}>{dayItem.tamilTitle}</Text>
                      <Text style={styles.dayTanglishTitle}>🅰️ {dayItem.tanglishTitle}</Text>
                      <Text style={styles.daySummary} numberOfLines={2}>{dayItem.summary}</Text>
                    </View>

                    {/* Action Arrow / Lock */}
                    <View style={styles.dayArrowBox}>
                      <Ionicons
                        name={isCompleted ? 'checkmark' : isUnlocked ? 'chevron-forward' : 'lock-closed'}
                        size={18}
                        color={isCompleted ? '#10B981' : isCurrent ? COLORS.primary : '#CBD5E1'}
                      />
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Day Lesson Modal */}
      {selectedDay && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalDayBadge}>DAY {selectedDay.day} LESSON</Text>
                  <Text style={styles.modalTitle}>{selectedDay.title}</Text>
                  <Text style={styles.modalTamilTitle}>{selectedDay.tamilTitle}</Text>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                  <Ionicons name="close" size={24} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.taskBanner}>
                  <Text style={styles.taskBannerTitle}>🎯 Daily Practice Task:</Text>
                  <Text style={styles.taskBannerText}>{selectedDay.practiceTask}</Text>
                </View>

                <Text style={styles.wordsSectionHeader}>Vocabulary & Speaking Lines:</Text>

                {selectedDay.words.map((w, idx) => (
                  <View key={idx} style={styles.wordItemCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.wordScriptText}>{w.sourashtraScript}</Text>
                      <Text style={styles.wordSourasText}>{w.sourashtra}</Text>
                      <Text style={styles.wordPronounce}>🗣️ [{w.pronunciation}]</Text>

                      <View style={styles.wordMeaningsBox}>
                        <Text style={styles.wordMeaningLine}>
                          <Text style={{ fontWeight: '700', color: '#1E293B' }}>🇮🇳 தமிழ்: </Text>
                          {w.tamil}
                        </Text>
                        <Text style={styles.wordMeaningLineTanglish}>
                          <Text style={{ fontWeight: '700', color: '#0369A1' }}>🅰️ Tanglish: </Text>
                          {w.tanglish}
                        </Text>
                        <Text style={styles.wordMeaningLine}>
                          <Text style={{ fontWeight: '700', color: '#475569' }}>🇬🇧 English: </Text>
                          {w.english}
                        </Text>
                      </View>
                    </View>

                    <AudioButton
                      word={w.sourashtra}
                      pronunciation={w.pronunciation}
                      size="medium"
                    />
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={[
                    styles.completeDayBtn,
                    completedDays.includes(selectedDay.day) && styles.alreadyCompletedBtn,
                  ]}
                  activeOpacity={0.8}
                  onPress={() => handleMarkDayCompleted(selectedDay.day)}
                >
                  <Ionicons
                    name={completedDays.includes(selectedDay.day) ? 'checkmark-circle' : 'ribbon'}
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.completeDayBtnText}>
                    {completedDays.includes(selectedDay.day)
                      ? 'Marked Completed (Tap to re-check)'
                      : `Complete Day ${selectedDay.day} (+25 XP)`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Day 14 Final Test Modal (Next Level Gate) */}
      <Modal
        visible={quizModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quizModalContent}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalDayBadge}>🚀 DAY 14 • NEXT LEVEL GATE</Text>
                <Text style={styles.modalTitle}>Level 1 Final Assessment</Text>
                <Text style={styles.modalTamilTitle}>அடுத்த நிலைக்கான தகுதித் தேர்வு (8 வினாக்கள்)</Text>
              </View>
              <TouchableOpacity onPress={() => setQuizModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Crucial requirement banner */}
            <View style={styles.modalGateNotice}>
              <Ionicons name="alert-circle" size={16} color="#B45309" style={{ marginRight: 6 }} />
              <Text style={styles.modalGateNoticeText}>
                ⚠️ இந்தத் தேர்வில் 6/8 அல்லது அதற்கு மேல் மதிப்பெண் பெற்றால்தான் அடுத்த நிலைக்கு (Level 2) செல்ல முடியும்!
              </Text>
            </View>

            {!quizFinished ? (
              <ScrollView style={styles.quizBody} showsVerticalScrollIndicator={false}>
                {/* Step indicator */}
                <View style={styles.quizProgressBar}>
                  <View
                    style={[
                      styles.quizProgressFill,
                      { width: `${((currentQuizIndex + 1) / FINAL_QUIZ_QUESTIONS.length) * 100}%` },
                    ]}
                  />
                </View>
                <Text style={styles.quizQuestionCounter}>
                  Question {currentQuizIndex + 1} of {FINAL_QUIZ_QUESTIONS.length}
                </Text>

                {/* Question Card */}
                <View style={styles.quizCard}>
                  {FINAL_QUIZ_QUESTIONS[currentQuizIndex].sourashtraScript && (
                    <Text style={styles.quizScriptText}>
                      {FINAL_QUIZ_QUESTIONS[currentQuizIndex].sourashtraScript}
                    </Text>
                  )}
                  <Text style={styles.quizQuestionText}>
                    {FINAL_QUIZ_QUESTIONS[currentQuizIndex].question}
                  </Text>
                </View>

                {/* Options */}
                <View style={styles.optionsList}>
                  {FINAL_QUIZ_QUESTIONS[currentQuizIndex].options.map((option, optIdx) => {
                    const isSelected = selectedAnswer === optIdx;
                    const isCorrect = optIdx === FINAL_QUIZ_QUESTIONS[currentQuizIndex].correctIndex;

                    let optStyle: any = styles.optionItem;
                    if (isSelected && !isAnswerSubmitted) {
                      optStyle = [styles.optionItem, styles.optionItemSelected];
                    } else if (isAnswerSubmitted) {
                      if (isCorrect) {
                        optStyle = [styles.optionItem, styles.optionItemCorrect];
                      } else if (isSelected && !isCorrect) {
                        optStyle = [styles.optionItem, styles.optionItemWrong];
                      }
                    }

                    return (
                      <TouchableOpacity
                        key={optIdx}
                        style={optStyle}
                        activeOpacity={0.8}
                        onPress={() => handleSelectAnswer(optIdx)}
                      >
                        <Text style={styles.optionIndex}>{String.fromCharCode(65 + optIdx)}.</Text>
                        <Text style={styles.optionLabel}>{option}</Text>
                        {isAnswerSubmitted && isCorrect && (
                          <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <Ionicons name="close-circle" size={22} color="#EF4444" />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Explanation on submission */}
                {isAnswerSubmitted && (
                  <View style={styles.explanationBox}>
                    <Text style={styles.explanationTitle}>💡 Explanation:</Text>
                    <Text style={styles.explanationText}>
                      {FINAL_QUIZ_QUESTIONS[currentQuizIndex].explanation}
                    </Text>
                  </View>
                )}
              </ScrollView>
            ) : (
              /* Quiz Finished Screen */
              <View style={styles.resultContainer}>
                <Text style={{ fontSize: 48, textAlign: 'center' }}>
                  {quizScore >= 6 ? '🎉' : '❌'}
                </Text>
                <Text style={styles.resultTitle}>
                  {quizScore >= 6 ? 'Congratulations! Passed!' : 'Next Level Locked!'}
                </Text>
                <Text style={styles.resultSubtitle}>
                  You scored {quizScore} out of {FINAL_QUIZ_QUESTIONS.length}
                </Text>

                {quizScore >= 6 ? (
                  <View style={styles.successBox}>
                    <Text style={styles.successHeading}>🚀 Level 2: அடுத்த நிலை திறக்கப்பட்டது!</Text>
                    <Text style={styles.successText}>
                      அருமை! நீங்கள் 14-நாள் இறுதித் தேர்வில் 6/8 மதிப்பெண் பெற்று வெற்றிகரமாக தேர்ச்சி பெற்றுவிட்டீர்கள்! அடுத்த நிலையான Level 2 (Intermediate Duolingo Stories & Dialogues) இப்போது உங்களுக்காக திறக்கப்பட்டுள்ளது! (+100 XP)
                    </Text>
                    <TouchableOpacity
                      style={styles.openNextLevelBtn}
                      activeOpacity={0.85}
                      onPress={() => {
                        setQuizModalVisible(false);
                        navigation.navigate('Stories');
                      }}
                    >
                      <Ionicons name="arrow-forward-circle" size={22} color="#FFFFFF" />
                      <Text style={styles.openNextLevelBtnText}>அடுத்த நிலைக்குச் செல் (Go to Level 2) →</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.retryBox}>
                    <Text style={styles.retryHeading}>⚠️ அடுத்த நிலை திறக்கப்படவில்லை!</Text>
                    <Text style={styles.retryText}>
                      இந்தத் தேர்வில் தேர்ச்சி பெற்றால்தான் அடுத்த நிலைக்கு செல்ல முடியும்! நீங்கள் பெற்றது {quizScore}/8. தேர்ச்சி பெற குறைந்தது 6/8 மதிப்பெண் தேவை. முந்தைய 1-13 நாட்களின் பாடங்களை படித்துவிட்டு மீண்டும் தேர்வு எழுதுங்கள்!
                    </Text>
                    <TouchableOpacity
                      style={styles.retryBtn}
                      activeOpacity={0.85}
                      onPress={() => {
                        setCurrentQuizIndex(0);
                        setQuizScore(0);
                        setSelectedAnswer(null);
                        setIsAnswerSubmitted(false);
                        setQuizFinished(false);
                      }}
                    >
                      <Ionicons name="refresh" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.retryBtnText}>மீண்டும் தேர்வு எழுது (Retake Test)</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {!quizFinished && (
              <View style={styles.modalFooter}>
                {!isAnswerSubmitted ? (
                  <TouchableOpacity
                    style={[styles.completeDayBtn, selectedAnswer === null && styles.btnDisabled]}
                    disabled={selectedAnswer === null}
                    activeOpacity={0.8}
                    onPress={handleSubmitQuizAnswer}
                  >
                    <Text style={styles.completeDayBtnText}>Submit Answer</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.completeDayBtn}
                    activeOpacity={0.8}
                    onPress={handleNextQuizQuestion}
                  >
                    <Text style={styles.completeDayBtnText}>
                      {currentQuizIndex < FINAL_QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'See Qualification Results 🏆'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  heroCard: {
    backgroundColor: '#312E81',
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
    ...SHADOWS.medium,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroBadge: {
    color: '#FCD34D',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroTamil: {
    fontSize: 13,
    color: '#E0E7FF',
    marginTop: 2,
    fontWeight: '600',
  },
  trophyIconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  progressBarWrapper: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    color: '#C7D2FE',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  statKey: {
    fontSize: 11,
    color: '#C7D2FE',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextLevelHeroBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextLevelHeroBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  levelRequirementBanner: {
    backgroundColor: 'rgba(252, 211, 77, 0.15)',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(252, 211, 77, 0.3)',
  },
  levelRequirementText: {
    color: '#FDE68A',
    fontSize: 11,
    fontWeight: '700',
    flex: 1,
    lineHeight: 16,
  },
  sectionTitleRow: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  daysList: {
    gap: 12,
  },
  dayCardTouchable: {
    marginBottom: 2,
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.small,
  },
  dayCardCurrent: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  dayCardCompleted: {
    borderColor: '#D1FAE5',
    backgroundColor: '#F0FDF4',
  },
  dayCardLocked: {
    opacity: 0.65,
    backgroundColor: '#F8FAFC',
  },
  dayCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayNumberBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dayNumberBoxCompleted: {
    backgroundColor: '#10B981',
  },
  dayNumberBoxCurrent: {
    backgroundColor: COLORS.primary,
  },
  dayNumberBoxLocked: {
    backgroundColor: '#E2E8F0',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primary,
  },
  dayNumberTextCurrent: {
    color: '#FFFFFF',
  },
  dayNumberSub: {
    fontSize: 8,
    fontWeight: '700',
    color: '#6366F1',
  },
  dayNumberSubCurrent: {
    color: '#E0E7FF',
  },
  dayContentBox: {
    flex: 1,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  dayTitleLocked: {
    color: '#64748B',
  },
  dayTamilTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
  },
  dayTanglishTitle: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '600',
    marginTop: 1,
  },
  daySummary: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
  },
  dayArrowBox: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
    marginBottom: 10,
  },
  modalDayBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  modalTamilTitle: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  modalGateNotice: {
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  modalGateNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  modalBody: {
    marginBottom: 14,
  },
  taskBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    marginBottom: 16,
  },
  taskBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  taskBannerText: {
    fontSize: 13,
    color: '#1E3A8A',
    lineHeight: 18,
  },
  wordsSectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  wordItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wordScriptText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 2,
  },
  wordSourasText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  wordPronounce: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 1,
    marginBottom: 4,
  },
  wordMeaningsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 3,
  },
  wordMeaningLine: {
    fontSize: 12,
    color: '#334155',
  },
  wordMeaningLineTanglish: {
    fontSize: 12,
    color: '#0284C7',
  },
  modalFooter: {
    paddingTop: 10,
  },
  completeDayBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  alreadyCompletedBtn: {
    backgroundColor: '#10B981',
  },
  completeDayBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  quizModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '92%',
    padding: 20,
  },
  quizBody: {
    flex: 1,
  },
  quizProgressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  quizQuestionCounter: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 14,
  },
  quizCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  quizScriptText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#4F46E5',
    marginBottom: 6,
  },
  quizQuestionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 22,
  },
  optionsList: {
    gap: 10,
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  optionItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#EEF2FF',
    borderWidth: 2,
  },
  optionItemCorrect: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
    borderWidth: 2,
  },
  optionItemWrong: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
  },
  optionIndex: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 10,
  },
  optionLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontWeight: '600',
  },
  explanationBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  explanationTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 2,
  },
  explanationText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
  btnDisabled: {
    backgroundColor: '#94A3B8',
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 12,
  },
  resultSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 20,
  },
  successBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    width: '100%',
  },
  successHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
    marginBottom: 8,
  },
  successText: {
    fontSize: 13,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  openNextLevelBtn: {
    backgroundColor: '#059669',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  openNextLevelBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  retryBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  retryHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 6,
  },
  retryText: {
    fontSize: 13,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
