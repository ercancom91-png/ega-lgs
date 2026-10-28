import type { Soru } from "../types";

const INGILIZCE: Soru[] = [
  {
    id: "in-01",
    ders: "Ingilizce",
    konu: "Vocabulary",
    zorluk: 1,
    metin:
      "Choose the word closest in meaning to the underlined word.\n\nMy sister is very <b>clever</b>; she always gets full marks in maths.",
    secenekler: [
      { id: "A", text: "tall" },
      { id: "B", text: "smart" },
      { id: "C", text: "noisy" },
      { id: "D", text: "quiet" },
    ],
    dogru: "B",
    cozum:
      "\"Clever\" means smart / intelligent. So the closest word is \"smart\". Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-02",
    ders: "Ingilizce",
    konu: "Grammar – Present Perfect",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\nI ______ this book three times. I really like it.",
    secenekler: [
      { id: "A", text: "read" },
      { id: "B", text: "am reading" },
      { id: "C", text: "have read" },
      { id: "D", text: "will read" },
    ],
    dogru: "C",
    cozum:
      "The action started in the past and its result is still important, so Present Perfect is used. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-03",
    ders: "Ingilizce",
    konu: "Grammar – Conditionals",
    zorluk: 3,
    metin:
      "Choose the correct option.\n\nIf it ______ tomorrow, we will cancel the school trip.",
    secenekler: [
      { id: "A", text: "rains" },
      { id: "B", text: "will rain" },
      { id: "C", text: "rained" },
      { id: "D", text: "is raining" },
    ],
    dogru: "A",
    cozum:
      "In first conditionals the if-clause takes Present Simple, not \"will\". Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-04",
    ders: "Ingilizce",
    konu: "Reading Comprehension",
    zorluk: 2,
    metin:
      "Read the text and answer the question.\n\n<em>\"Tom usually walks to school, but today he is late because he missed the bus. He had to run all the way and he arrived at the gate just as the bell rang.\"</em>\n\nHow did Tom go to school today?",
    secenekler: [
      { id: "A", text: "He walked." },
      { id: "B", text: "He ran." },
      { id: "C", text: "He took the bus." },
      { id: "D", text: "His parents drove him." },
    ],
    dogru: "B",
    cozum:
      "He missed the bus, so he had to run all the way. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-05",
    ders: "Ingilizce",
    konu: "Prepositions",
    zorluk: 2,
    metin:
      "Choose the correct preposition.\n\nThe English lesson starts ______ half past nine.",
    secenekler: [
      { id: "A", text: "in" },
      { id: "B", text: "on" },
      { id: "C", text: "at" },
      { id: "D", text: "for" },
    ],
    dogru: "C",
    cozum:
      "We use \"at\" with clock times. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-06",
    ders: "Ingilizce",
    konu: "Grammar – Comparatives",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\nMount Ararat is ______ mountain in Turkey.",
    secenekler: [
      { id: "A", text: "the highest" },
      { id: "B", text: "higher" },
      { id: "C", text: "the more high" },
      { id: "D", text: "most high" },
    ],
    dogru: "A",
    cozum:
      "Superlative form: the + -est / the most. \"Highest\" is correct. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-07",
    ders: "Ingilizce",
    konu: "Vocabulary",
    zorluk: 1,
    metin:
      "Choose the word that does not belong to the group.\n\nWhich one is the odd one out?",
    secenekler: [
      { id: "A", text: "doctor" },
      { id: "B", text: "nurse" },
      { id: "C", text: "dentist" },
      { id: "D", text: "student" },
    ],
    dogru: "D",
    cozum:
      "Doctor, nurse and dentist are all jobs in a hospital; \"student\" is not. Doğru cevap D'dir.",
    kaynak: "EGA Özgün",
  },
  {
    id: "in-08",
    ders: "Ingilizce",
    konu: "Grammar – Modals",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\nYou ______ wear a helmet when you ride a bike. It's the law.",
    secenekler: [
      { id: "A", text: "can" },
      { id: "B", text: "must" },
      { id: "C", text: "might" },
      { id: "D", text: "could" },
    ],
    dogru: "B",
    cozum:
      "\"Must\" expresses a strong obligation / rule. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-09",
    ders: "Ingilizce",
    konu: "Grammar – Past Tenses",
    zorluk: 3,
    metin:
      "Choose the correct option.\n\nWhen I ______ to the cinema, the film ______ already.",
    secenekler: [
      { id: "A", text: "got / had started" },
      { id: "B", text: "get / starts" },
      { id: "C", text: "got / starts" },
      { id: "D", text: "was getting / has started" },
    ],
    dogru: "A",
    cozum:
      "The film started before he arrived, so Past Perfect is used for the earlier action. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-10",
    ders: "Ingilizce",
    konu: "There is / There are",
    zorluk: 1,
    metin:
      "Choose the correct option.\n\n______ many old buildings in my town.",
    secenekler: [
      { id: "A", text: "There is" },
      { id: "B", text: "There are" },
      { id: "C", text: "It is" },
      { id: "D", text: "They is" },
    ],
    dogru: "B",
    cozum:
      "\"Many old buildings\" is plural, so \"There are\" is used. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-11",
    ders: "Ingilizce",
    konu: "Question Words",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\n______ is your favourite sport? – I love basketball.",
    secenekler: [
      { id: "A", text: "Who" },
      { id: "B", text: "Where" },
      { id: "C", text: "What" },
      { id: "D", text: "When" },
    ],
    dogru: "C",
    cozum:
      "The answer is a thing/activity, so \"What\" is used. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-12",
    ders: "Ingilizce",
    konu: "Reading Comprehension",
    zorluk: 3,
    metin:
      "Read the text and answer the question.\n\n<em>\"Although Elif had never swum in the sea before, she jumped into the water without hesitation. Her friends were surprised, but she laughed and said that fear only grows when you think too much.\"</em>\n\nHow did Elif feel before jumping into the sea?",
    secenekler: [
      { id: "A", text: "She was afraid but decided to try." },
      { id: "B", text: "She was an experienced swimmer." },
      { id: "C", text: "She refused to swim." },
      { id: "D", text: "She was angry with her friends." },
    ],
    dogru: "A",
    cozum:
      "She had never swum in the sea, but she jumped in without hesitation; fear grows when you overthink. Doğru cevap A'dır.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-13",
    ders: "Ingilizce",
    konu: "Grammar – Present Continuous",
    zorluk: 1,
    metin:
      "Choose the correct option.\n\nLook! The boys ______ football in the garden.",
    secenekler: [
      { id: "A", text: "play" },
      { id: "B", text: "plays" },
      { id: "C", text: "are playing" },
      { id: "D", text: "played" },
    ],
    dogru: "C",
    cozum:
      "\"Look!\" signals an action happening now → Present Continuous. Doğru cevap C'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-14",
    ders: "Ingilizce",
    konu: "Vocabulary – Phrasal Verbs",
    zorluk: 3,
    metin:
      "Choose the correct option.\n\nPlease ______ the lights when you leave the classroom.",
    secenekler: [
      { id: "A", text: "turn on" },
      { id: "B", text: "turn off" },
      { id: "C", text: "turn up" },
      { id: "D", text: "turn into" },
    ],
    dogru: "B",
    cozum:
      "When leaving a room you switch the lights off → \"turn off\". Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-15",
    ders: "Ingilizce",
    konu: "Grammar – Articles",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\nI want to be ______ engineer when I grow up.",
    secenekler: [
      { id: "A", text: "a" },
      { id: "B", text: "an" },
      { id: "C", text: "the" },
      { id: "D", text: "(no article)" },
    ],
    dogru: "B",
    cozum:
      "\"Engineer\" starts with a vowel sound, so the indefinite article \"an\" is used. Doğru cevap B'dir.",
    kaynak: "LGS 2024",
  },
  {
    id: "in-16",
    ders: "Ingilizce",
    konu: "Grammar – Future",
    zorluk: 2,
    metin:
      "Choose the correct option.\n\nWe ______ our grandparents next summer holiday.",
    secenekler: [
      { id: "A", text: "visit" },
      { id: "B", text: "visited" },
      { id: "C", text: "are going to visit" },
      { id: "D", text: "have visited" },
    ],
    dogru: "C",
    cozum:
      "A plan for the future → \"be going to\". Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-17",
    ders: "Ingilizce",
    konu: "Word Order",
    zorluk: 3,
    metin:
      "Choose the correct sentence.",
    secenekler: [
      { id: "A", text: "I never have been to London." },
      { id: "B", text: "Never I have been to London." },
      { id: "C", text: "I have never been to London." },
      { id: "D", text: "Have I never been to London." },
    ],
    dogru: "C",
    cozum:
      "Adverbs like \"never\" are placed after the auxiliary in Present Perfect. Doğru cevap C'dir.",
    kaynak: "LGS 2025",
  },
  {
    id: "in-18",
    ders: "Ingilizce",
    konu: "Vocabulary – Opposites",
    zorluk: 1,
    metin:
      "Choose the opposite of the word.\n\nWhat is the opposite of \"expensive\"?",
    secenekler: [
      { id: "A", text: "cheap" },
      { id: "B", text: "costly" },
      { id: "C", text: "valuable" },
      { id: "D", text: "modern" },
    ],
    dogru: "A",
    cozum:
      "\"Expensive\" means pahalı; its opposite is \"cheap\" (ucuz). Doğru cevap A'dır.",
    kaynak: "LGS 2024",
  },
];

export default INGILIZCE;
