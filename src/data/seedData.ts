export interface SeedPost {
  id: string;
  title: string;
  content: string;
  category: 'ppr_viso' | 'school_education' | 'sensory_places' | 'local_meetups';
  authorId: string;
  authorName: string;
  authorKommune: string;
  authorLanguage: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  ageTag?: '0-5' | '6-12' | '13+';
  audioUrl?: string;
  translations?: Record<string, string>;
  comments?: Array<{
    id: string;
    authorName: string;
    authorKommune: string;
    content: string;
    createdAt: string;
  }>;
}

export interface SeedEvent {
  id: string;
  title: string;
  description: string;
  address: string;
  kommune: string;
  latitude: number;
  longitude: number;
  dateTime: string;
  isSunflowerLanyardFriendly: boolean;
  category: 'meetup' | 'sensory_place' | 'workshop' | 'quiet_hour';
  sensoryNotes: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
}

export const SEED_POSTS: SeedPost[] = [
  {
    id: 'post-1',
    title: 'How long did your PPR assessment take in København Kommune? Tips for non-Danish speakers?',
    content: 'Hej alle sammen! Our 5-year-old son was referred to PPR by his børnehave in Nørrebro back in October. We are still waiting for the psychologist to finish the pedagogical-psychological assessment (PPV). As parents originally from Ukraine, we find the letters in Digital Post (e-Boks) quite difficult to parse even with Google Translate. How long did it take for your family, and did you request an interpreter (tolk)? Any advice on keeping the dialogue active with the sagsbehandler?',
    category: 'ppr_viso',
    authorId: 'user-seed-olena',
    authorName: 'Olena K.',
    authorKommune: 'København',
    authorLanguage: 'da',
    ageTag: '0-5',
    likesCount: 14,
    commentsCount: 3,
    createdAt: '2026-03-20T10:15:00Z',
    translations: {
      en: "Hello everyone! Our 5-year-old son was referred to PPR by his daycare in Nørrebro back in October. We are still waiting for the psychologist to finish the pedagogical-psychological assessment (PPV). As parents originally from Ukraine, we find the letters in Digital Post (e-Boks) quite difficult to parse even with Google Translate. How long did it take for your family, and did you request an interpreter (tolk)? Any advice on keeping the dialogue active with the case worker?",
      ar: "مرحباً بالجميع! تمت إحالة ابننا البالغ من العمر 5 سنوات إلى PPR بواسطة روضته في نوربرو في أكتوبر الماضي. ما زلنا ننتظر أن ينهي الأخصائي النفسي التقييم التربوي النفسي (PPV). بصفتنا آباء من أوكرانيا، نجد الرسائل في البريد الرقمي (e-Boks) صعبة الفهم حتى مع الترجمة. كم استغرق الأمر بالنسبة لعائلتك، وهل طلبت مترجماً رسمياً (tolk)؟",
      ur: "سب کو سلام! ہمارے 5 سالہ بیٹے کو اکتوبر میں ناربرو میں اس کے ڈے کیئر کی طرف سے پی پی آر ریفر کیا گیا تھا۔ ہم اب بھی ماہر نفسیات کی طرف سے پیڈاگوجیکل اسسمنٹ (پی پی وی) مکمل ہونے کا انتظار کر رہے ہیں۔ ڈیجیٹل پوسٹ میں ڈینش خطوط سمجھنا مشکل ہوتا ہے۔ کیا آپ نے مترجم (ٹولک) کی درخواست کی تھی؟",
      so: "Salaan dhammaan! Wiilkayaga oo 5 jir ah ayaa xannaanadiisa Nørrebro u gudbisay PPR bishii Oktoobar. Wali waxaan sugeynaa in cilmi-nafsiga uu dhammeeyo qiimeynta (PPV). Waraaqaha Digital Post-ka aad bay u adag yihiin. Qoyskiina intee ayay ku qaadatay, ma weydiisateen turjubaan (tolk)?",
      da: "Hej alle sammen! Vores 5-årige søn blev henvist til PPR af sin børnehave på Nørrebro tilbage i oktober. Vi venter stadig på, at psykologen færdiggør den pædagogisk-psykologiske vurdering (PPV). Som forældre oprindeligt fra Ukraine finder vi brevene i Digital Post (e-Boks) ret svære at forstå. Hvor lang tid tog det for jer, og anmodede I om tolk?",
      uk: "Всім привіт! Нашого 5-річного сина направили до PPR з дитячого садка в Норребро ще в жовтні. Ми все ще чекаємо, коли психолог завершить педагогічно-психологічну оцінку (PPV). Листи в e-Boks данською важко читати. Скільки часу це зайняло у вашій родині, і чи просили ви перекладача (tolk)?"
    },
    comments: [
      {
        id: 'c-1',
        authorName: 'Ahmed M.',
        authorKommune: 'Albertslund',
        content: 'Velkommen Olena! In København it frequently takes 4 to 6 months. By law you are 100% entitled to an official certified interpreter for any meeting. Write an email to the PPR team lead: "Vi anmoder om tolk til ukrainsk/engelsk jf. Forvaltningslovens § 7". It changed everything for us!',
        createdAt: '2026-03-20T11:30:00Z'
      },
      {
        id: 'c-2',
        authorName: 'Sarah Jenkins',
        authorKommune: 'Frederiksberg',
        content: 'Also remember you can ask for a "bisidder" (support person). Autismeforeningen has volunteer bisiddere who speak English and can join your meetings so you don\'t feel overwhelmed by Danish terminology.',
        createdAt: '2026-03-20T14:45:00Z'
      },
      {
        id: 'c-3',
        authorName: 'Fatima Al-Hassan',
        authorKommune: 'København',
        content: 'Keep a diary of his triggers and routines at home. We printed 2 pages of bullet points for the psychologist, which helped speed up the school placement recommendation!',
        createdAt: '2026-03-21T09:10:00Z'
      }
    ]
  },
  {
    id: 'post-2',
    title: 'Applying for Merudgifter (Barnets Lov § 86): What receipts do they actually accept?',
    content: 'We are preparing our first application for extra disability expenses for our 8-year-old autistic daughter. She chews through clothing collars constantly, needs seamless socks from special sensory shops, and requires specific weighted blankets. For those who were approved in Albertslund or Høje-Taastrup, how detailed does the annual calculation need to be? Did you include transport costs to psychiatric appointments at Glostrup Hospital?',
    category: 'ppr_viso',
    authorId: 'user-seed-tariq',
    authorName: 'Tariq & Leila',
    authorKommune: 'Albertslund',
    authorLanguage: 'en',
    ageTag: '6-12',
    likesCount: 19,
    commentsCount: 2,
    createdAt: '2026-03-18T16:20:00Z',
    comments: [
      {
        id: 'c-4',
        authorName: 'Rasmus & Maria',
        authorKommune: 'Gladsaxe',
        content: 'Yes! Transport to Region H Børne- og Ungdomspsykiatrisk Center is definitely eligible if it exceeds normal transport. Keep every single receipt, and make an Excel sheet detailing the difference between what standard clothes cost vs. sensory chewable wear.',
        createdAt: '2026-03-18T18:00:00Z'
      },
      {
        id: 'c-5',
        authorName: 'Elena V.',
        authorKommune: 'Høje-Taastrup',
        content: 'Make sure your child’s doctor statement explicitly states that sensory clothing and weighted items are recommended for her sensory regulation. If it’s in the medical file, the municipality has a much harder time rejecting it.',
        createdAt: '2026-03-19T08:15:00Z'
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Quiet and low-sensory playgrounds with fenced borders around Greater Copenhagen & Vestegnen?',
    content: 'Looking for recommendations! My 4-year-old is a runner (elopement tendency) and gets heavily dysregulated by high-pitched screams and loud metal equipment in standard city parks. Does anyone know peaceful, fenced playgrounds with natural sensory elements (sand, wood, gentle swings) in København, Rødovre, or Albertslund?',
    category: 'sensory_places',
    authorId: 'user-seed-mariam',
    authorName: 'Mariam D.',
    authorKommune: 'Rødovre',
    authorLanguage: 'en',
    ageTag: '0-5',
    likesCount: 23,
    commentsCount: 2,
    createdAt: '2026-03-15T12:00:00Z',
    comments: [
      {
        id: 'c-6',
        authorName: 'Kasper B.',
        authorKommune: 'København',
        content: 'Bonderupgård sensory nature park and the fenced playground inside Valbyparken (near the theme gardens) are wonderful on weekday mornings. Very few people and secure gates!',
        createdAt: '2026-03-15T13:40:00Z'
      },
      {
        id: 'c-7',
        authorName: 'Amina S.',
        authorKommune: 'Albertslund',
        content: 'Vestskoven has lovely quiet clearings near Herstedhøje. Not completely fenced, but natural boundaries and very soothing acoustic environment away from road noise.',
        createdAt: '2026-03-16T10:05:00Z'
      }
    ]
  },
  {
    id: 'post-4',
    title: 'Transition from Folkeskole regular class to Specialklasse: What should we watch out for?',
    content: 'Our son is in 2nd grade in Aarhus. Inclusion with 12 support hours a week is unfortunately causing him extreme sensory exhaustion, meltdowns after school, and selective mutism. The school pedagogue suggested applying for a specialized autism group (specialklasse). For families whose children moved to a special group, did you see an improvement in anxiety? How was the social environment?',
    category: 'school_education',
    authorId: 'user-seed-mehmet',
    authorName: 'Mehmet Y.',
    authorKommune: 'Aarhus',
    authorLanguage: 'en',
    ageTag: '6-12',
    likesCount: 16,
    commentsCount: 1,
    createdAt: '2026-03-12T14:10:00Z',
    comments: [
      {
        id: 'c-8',
        authorName: 'Dorthe L.',
        authorKommune: 'Aarhus',
        content: 'Moving to a special group with 6 kids and 2 teachers was life-saving for our daughter. The acoustic panels on the walls and pictograms meant she didn’t have to guess what was happening next. Her anxiety dropped dramatically within 3 weeks.',
        createdAt: '2026-03-12T17:30:00Z'
      }
    ]
  },
  {
    id: 'post-5',
    title: 'Immigrant Autism Mamas & Papas Monthly Coffee Meetup in Nørrebrohallen',
    content: 'A gentle, relaxed peer support space for immigrant parents navigating Denmark’s special needs landscape. No judgment, kids welcome or come solo for quiet coffee and sharing notes on kommunen, school rights, and finding sensory peace. Free filter coffee and tea provided!',
    category: 'local_meetups',
    authorId: 'user-seed-samira',
    authorName: 'Samira Noor',
    authorKommune: 'København',
    authorLanguage: 'en',
    ageTag: '13+',
    likesCount: 28,
    commentsCount: 2,
    createdAt: '2026-03-10T09:00:00Z',
    comments: [
      {
        id: 'c-9',
        authorName: 'Zainab Q.',
        authorKommune: 'København',
        content: 'I will be there! Looking forward to meeting other parents who understand the dual challenge of language barriers and autism parenting.',
        createdAt: '2026-03-10T12:00:00Z'
      }
    ]
  }
];

export const SEED_EVENTS: SeedEvent[] = [
  {
    id: 'event-1',
    title: 'Quiet Morning at Experimentarium (Sunflower Lanyard Friendly)',
    description: 'Experimentarium opens an hour before general public admission with reduced ambient lighting, muted exhibit sound effects, and dedicated quiet retreat corners. Staff are trained in the Solsikke (Sunflower) program.',
    address: 'Tuborg Havnevej 7, 2900 Hellerup',
    kommune: 'Gentofte',
    latitude: 55.7275,
    longitude: 12.5802,
    dateTime: 'Saturday, April 4, 2026 • 09:00 - 11:30',
    isSunflowerLanyardFriendly: true,
    category: 'quiet_hour',
    sensoryNotes: 'Dimmed lights, muted audio displays, designated decompression tent with beanbags, sensory ear defenders available at info desk.',
    createdBy: 'user-seed-admin',
    createdByName: 'Gentofte Autism Network',
    createdAt: '2026-03-15T10:00:00Z'
  },
  {
    id: 'event-2',
    title: 'Neurodivergent Immigrant Parent Circle - Nørrebrohallen',
    description: 'An informal, friendly monthly meetup in Copenhagen for immigrant parents raising children on the autism spectrum. We share practical tips for PPR, VISO, school placement, and bilingual speech development in a safe, warm space.',
    address: 'Nørrebrogade 208, 2200 København N',
    kommune: 'København',
    latitude: 55.6997,
    longitude: 12.5414,
    dateTime: 'Sunday, April 12, 2026 • 13:00 - 15:30',
    isSunflowerLanyardFriendly: true,
    category: 'meetup',
    sensoryNotes: 'Quiet meeting room (Lokale 3) with soft acoustic baffles, low background noise, soft warm lighting, tea and quiet sensory fidget toys provided.',
    createdBy: 'user-seed-samira',
    createdByName: 'Samira Noor (NeuroConnect DK)',
    createdAt: '2026-03-16T12:00:00Z'
  },
  {
    id: 'event-3',
    title: 'Aarhus Sensory Forest Walk & Quiet Play - Risskov Skov',
    description: 'A gentle nature walk through tranquil coastal woods. Designed specifically for sensory-sensitive children who enjoy tactile textures of moss, leaves, and gentle sea breeze without sudden loud urban stimuli.',
    address: 'Skovvej 45, 8240 Risskov',
    kommune: 'Aarhus',
    latitude: 56.1822,
    longitude: 10.2285,
    dateTime: 'Saturday, April 18, 2026 • 10:30 - 12:30',
    isSunflowerLanyardFriendly: true,
    category: 'sensory_place',
    sensoryNotes: 'Open nature, unhurried pace, stroller and wheelchair accessible gravel path, quiet shelter for snack breaks.',
    createdBy: 'user-seed-mehmet',
    createdByName: 'Aarhus Special Needs Parent Guild',
    createdAt: '2026-03-17T09:30:00Z'
  },
  {
    id: 'event-4',
    title: 'Albertslund Solsikke Parent Support & Coffee - Bakkens Hjerte',
    description: 'Local meetup for parents living in Albertslund, Høje-Taastrup, and Glostrup. Topic: Understanding Barnets Lov § 86 (Merudgifter) and how to write effective applications.',
    address: 'Kanalens Kvarter 32, 2620 Albertslund',
    kommune: 'Albertslund',
    latitude: 55.6580,
    longitude: 12.3550,
    dateTime: 'Wednesday, April 22, 2026 • 17:00 - 19:00',
    isSunflowerLanyardFriendly: true,
    category: 'workshop',
    sensoryNotes: 'Small group (max 12 parents), quiet atmosphere, free Wi-Fi, translation assistance available in Arabic and Ukrainian.',
    createdBy: 'user-seed-tariq',
    createdByName: 'Tariq & Leila',
    createdAt: '2026-03-18T11:00:00Z'
  },
  {
    id: 'event-5',
    title: 'Odense Sensory Garden & Water Play (H.C. Andersen Haven)',
    description: 'A morning meetup in the quiet sensory garden. Flowers with gentle scents, soft trickling water feature, and spacious grassy areas where energetic sensory-seeking children can move freely safely.',
    address: 'Eventyrhaven 1, 5000 Odense C',
    kommune: 'Odense',
    latitude: 55.3942,
    longitude: 10.3883,
    dateTime: 'Sunday, May 3, 2026 • 10:00 - 12:00',
    isSunflowerLanyardFriendly: true,
    category: 'sensory_place',
    sensoryNotes: 'Natural soundscape, non-enclosed open lawn, soft mulch paths, plenty of space for movement regulation.',
    createdBy: 'user-seed-admin',
    createdByName: 'Fyn Special Needs Families',
    createdAt: '2026-03-19T14:00:00Z'
  },
  {
    id: 'event-6',
    title: 'Aalborg Calm Saturday at Utzon Center (Low Noise Hours)',
    description: 'Utzon Center architectural tactile workshop for neurodiverse kids and their families. Building with soft acoustic foam blocks, wooden architectural elements, and minimal artificial lighting.',
    address: 'Slotspladsen 4, 9000 Aalborg',
    kommune: 'Aalborg',
    latitude: 57.0504,
    longitude: 9.9321,
    dateTime: 'Saturday, May 9, 2026 • 10:00 - 12:30',
    isSunflowerLanyardFriendly: true,
    category: 'quiet_hour',
    sensoryNotes: 'Acoustic absorption ceiling, natural harbor daylight, sensory chill-out pod, staff wearing sunflower badges.',
    createdBy: 'user-seed-admin',
    createdByName: 'Nordjylland Autism Friends',
    createdAt: '2026-03-20T10:00:00Z'
  }
];
