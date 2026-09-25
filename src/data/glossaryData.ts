export interface GlossaryTerm {
  id: string;
  term: string;
  pronunciation?: string;
  category: 'Evaluation & Assessment' | 'Financial & Practical Aid' | 'School & Daycare' | 'Rights & Procedures';
  shortSummary: string;
  detailedExplanation: string;
  parentAdvice: string;
  keyPhrasesToSay: string[];
  legalReference?: string;
  multilingualQuickLook?: Record<string, string>;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'ppr',
    term: 'PPR (Pædagogisk Psykologisk Rådgivning)',
    pronunciation: 'peh-peh-air',
    category: 'Evaluation & Assessment',
    shortSummary: 'Pedagogical Psychological Counseling - the municipal body that evaluates children needing extra developmental or psychological support.',
    detailedExplanation: 'Every Danish municipality has a PPR department staffed with psychologists, speech therapists (talepædagoger), and educational consultants. Before a child can receive specialized school placement (specialklasse) or significant support hours, PPR usually conducts a pedagogical-psychological assessment (PPV). Both daycares (vuggestue/børnehave) and schools refer children, but parents must be consulted.',
    parentAdvice: 'You have the right to read and review the PPR report before it is finalized. If you do not understand Danish bureaucratic phrasing, formally ask for an interpreter (tolk) during all PPR meetings. Do not hesitate to submit your own written observations of your child at home.',
    keyPhrasesToSay: [
      '"Vi ønsker en pædagogisk-psykologisk vurdering (PPV) af vores barn."',
      '"Vi vil gerne have referatet tilsendt skriftligt på dansk."'
    ],
    legalReference: 'Folkeskoleloven § 12 & Dagtilbudsloven',
    multilingualQuickLook: {
      ar: 'بي بي آر (PPR) - الاستشارات التربوية والنفسية في البلدية لتقييم احتياجات الطفل وتوفير الدعم المناسب.',
      uk: 'PPR - Муніципальна психолого-педагогічна служба, що оцінює потреби дитини в додатковій підтримці.',
      tr: 'PPR - Belediyenin pedagog ve psikolog danışma servisi; özel desteğe ihtiyacı olan çocukları değerlendirir.',
      so: 'PPR - La-talinta cilmi-nafsiga iyo barbaarinta ee degmada si loo qiimeeyo baahiyaha ilmahaaga.'
    }
  },
  {
    id: 'viso',
    term: 'VISO (Den Nationale Videns- og Specialrådgivningsorganisation)',
    pronunciation: 'vee-soh',
    category: 'Evaluation & Assessment',
    shortSummary: 'National knowledge and specialist advisory service providing free expert second-opinions on complex autism and special needs cases.',
    detailedExplanation: 'VISO is a national agency under Socialstyrelsen (the National Board of Social Services). If your municipality (Kommune) does not possess specialized knowledge about your child’s condition (e.g. rare syndromes, complex pathological demand avoidance, non-speaking autism), both parents and the municipality can contact VISO directly for free specialist guidance.',
    parentAdvice: 'As an immigrant parent, you can call VISO directly on their hotline without needing permission from your sagsbehandler (case worker). Their guidance is free, impartial, and advisory.',
    keyPhrasesToSay: [
      '"Vi mener, at sagen er så kompleks, at der bør rekvireres bistand fra VISO."',
      '"Jeg vil gerne kontakte VISO for uvildig rådgivning."'
    ],
    legalReference: 'Serviceloven § 13 / Barnets Lov',
    multilingualQuickLook: {
      ar: 'فيزو (VISO) - المنظمة الوطنية للاستشارات التخصصية التي تقدم استشارات مجانية مستقلة في حالات التوحد المعقدة.',
      uk: 'VISO - Національна служба експертної підтримки з питань аутизму та особливих потреб.',
      tr: 'VISO - Karmaşık otizm ve özel ihtiyaç durumlarında ücretsiz uzman tavsiyesi veren ulusal danışma kurumu.'
    }
  },
  {
    id: 'boernefaglig-undersoegelse',
    term: 'Børnefaglig undersøgelse (§ 20 i Barnets Lov)',
    pronunciation: 'burn-eh-fagh-leeg oon-der-seh-ehl-seh',
    category: 'Rights & Procedures',
    shortSummary: 'A comprehensive municipal assessment of a child\'s overall well-being, family situation, and support needs.',
    detailedExplanation: 'Formerly known as a "§ 50-undersøgelse", this is an in-depth investigation conducted by the family department (Børne- og Familieafdelingen). It explores school functioning, emotional well-being, home life, and health. The municipality must conclude this assessment within 4 months. It is the legal prerequisite for granting comprehensive support measures like respite care (aflastning) or home training.',
    parentAdvice: 'Do not panic if you hear the municipality is doing a "børnefaglig undersøgelse". For special needs families, it is standard practice to unlock municipal resources. However, always exercise your right to bring an independent support person (bisidder) to these meetings.',
    keyPhrasesToSay: [
      '"Jeg vil gerne have en bisidder med til det næste møde."',
      '"Vi beder om aktindsigt i alle akter vedrørende vores barns sag."'
    ],
    legalReference: 'Barnets Lov § 20 (tidligere Servicelovens § 50)'
  },
  {
    id: 'solsikkesnoren',
    term: 'Solsikkesnoren (Sunflower Lanyard)',
    pronunciation: 'sol-see-keh-snor-en',
    category: 'Rights & Procedures',
    shortSummary: 'A globally recognized green lanyard with sunflowers signifying an invisible disability such as autism, ADHD, or sensory processing differences.',
    detailedExplanation: 'In Denmark, Solsikkeprogrammet is widely embraced across Copenhagen Airport (CPH), DSB trains and Metro, Tivoli, Legoland, supermarkets (Føtex, Netto, Bilka), libraries, and pharmacies. Wearing it quietly signals to staff that the person or their companion may need extra patience, clearer instructions, or a quiet space, without needing to explain medical diagnoses.',
    parentAdvice: 'You can pick up a free Solsikkesnor at any major DSB station ticket office, local municipal citizen service (Borgerservice), pharmacy, or public library in Denmark without needing to show a doctor\'s note.',
    keyPhrasesToSay: [
      '"Kan jeg få en solsikkesnor til mit barn?" (Can I get a sunflower lanyard for my child?)'
    ],
    legalReference: 'Det Nationale Solsikkeprogram'
  },
  {
    id: 'merudgifter',
    term: 'Dækning af merudgifter (Barnets Lov § 86)',
    pronunciation: 'mer-ood-geef-ter',
    category: 'Financial & Practical Aid',
    shortSummary: 'Municipal reimbursement for necessary extra costs resulting from raising a child with significant impairment.',
    detailedExplanation: 'Families with children under 18 who have severe chronic conditions or disabilities (including autism) can receive financial assistance for expenses non-disabled peers do not have. This includes specialized sensory clothing/weighted vests, transport to therapy/hospitals, special diets (gluten/casein free if medically indicated), higher laundry costs, medication, and damage to household items.',
    parentAdvice: 'Start a detailed log folder today! Keep all receipts and compare your monthly household spending with Danish standard consumer family budgets (Danmarks Statistik). The minimum threshold is an annual statutory amount (around 5,500 DKK+ per year).',
    keyPhrasesToSay: [
      '"Vi vil gerne søge om dækning af nødvendige merudgifter jf. Barnets Lov § 86."',
      '"Her er vores sandsynliggjorte merudgiftsbudget med kvitteringer."'
    ],
    legalReference: 'Barnets Lov § 86 (tidligere Servicelovens § 41)'
  },
  {
    id: 'tabt-arbejdsfortjeneste',
    term: 'Tabt arbejdsfortjeneste (Barnets Lov § 87)',
    pronunciation: 'tahbt ahr-byds-for-tye-neh-steh',
    category: 'Financial & Practical Aid',
    shortSummary: 'Wage compensation if you need to reduce work hours or resign to care for your disabled child at home.',
    detailedExplanation: 'If caring for your child with autism at home requires so much time that it is impossible to work full-time, the municipality can cover your lost income (up to a statutory maximum cap per month). This can be granted for a few hours per week (e.g., attending sensory appointments or picking up early from school) or up to full-time leave.',
    parentAdvice: 'The municipality must assess whether it is necessary and expedient that you, rather than daycare/school staff, care for the child. Doctor statements detailing the severity of the child’s executive dysfunction are paramount.',
    keyPhrasesToSay: [
      '"Vi ansøger om kompensation for tabt arbejdsfortjeneste jf. Barnets Lov § 87."',
      '"Jeg vedlægger lægeattest fra børnepsykiatrisk afdeling."'
    ],
    legalReference: 'Barnets Lov § 87 (tidligere Servicelovens § 42)'
  },
  {
    id: 'aflastning',
    term: 'Aflastning / Aflastningsophold (Barnets Lov § 84)',
    pronunciation: 'ow-lahst-ning',
    category: 'Financial & Practical Aid',
    shortSummary: 'Respite care giving parents a break while the child is cared for by an approved respite family or specialized facility.',
    detailedExplanation: 'Raising a child with severe sensory overload and sleep challenges can strain family well-being. Municipalities can grant weekend respite (e.g. 1 weekend per month) in an approved respite family (aflastningsfamilie) or sensory respite institution (aflastningstilbud), or provide in-home relief hours.',
    parentAdvice: 'Asking for aflastning is not a sign of failure as a parent; Danish municipalities see it as preventive support to keep the family unit healthy and avoid burnout.',
    keyPhrasesToSay: [
      '"Vi har brug for aflastning i hjemmet for at aflaste søskende og forhindre udbrændthed."'
    ],
    legalReference: 'Barnets Lov § 84 (tidligere Servicelovens § 84)'
  },
  {
    id: 'tolk',
    term: 'Tolk (Certified Language Interpreter)',
    pronunciation: 'tolk',
    category: 'Rights & Procedures',
    shortSummary: 'Your legal right to an interpreter in municipal and healthcare meetings concerning your child.',
    detailedExplanation: 'Under Danish administrative law (Forvaltningsloven), public authorities have an official duty of guidance (vejledningspligt). If you cannot communicate fluently in Danish regarding complex legal or pedagogical matters, the municipality must arrange and pay for a qualified professional interpreter.',
    parentAdvice: 'Never use your older children or friends to translate sensitive medical or municipal assessments. Inform the sagsbehandler at least 5 business days in advance: "Vi har brug for en tolk til arabisk/ukrainsk/farsi til mødet."',
    keyPhrasesToSay: [
      '"Vi anmoder om en autoriseret tolk til det kommende møde, da vi har brug for fuld sproglig forståelse."'
    ],
    legalReference: 'Forvaltningsloven § 7'
  },
  {
    id: 'bisidder',
    term: 'Bisidder (Support Person / Companion)',
    pronunciation: 'bee-see-der',
    category: 'Rights & Procedures',
    shortSummary: 'Your statutory right to bring a friend, family member, or professional volunteer to any meeting with authorities.',
    detailedExplanation: 'Under Danish law, you are always allowed to bring a bisidder to any municipal meeting. A bisidder can listen, take detailed notes, remind you of questions you wanted to ask, and help you debrief afterward. Organizations like Autismeforeningen, SIND, or Mødrehjælpen also provide trained volunteer bisiddere.',
    parentAdvice: 'Case workers often speak faster and use dense acronyms when parents are alone. Bringing a calm bisidder immediately changes the dynamic of the meeting to be more respectful and methodical.',
    keyPhrasesToSay: [
      '"Dette er min bisidder. Han/hun deltager for at tage noter og støtte samtalen."'
    ],
    legalReference: 'Forvaltningsloven § 8'
  },
  {
    id: 'specialklasse',
    term: 'Specialklasse & Specialskole',
    pronunciation: 'speh-shahl-klah-seh',
    category: 'School & Daycare',
    shortSummary: 'Small-group classes with lower teacher-student ratios and sensory adaptations in Danish schools.',
    detailedExplanation: 'If regular Folkeskole inclusion with a resource pedagogue is insufficient, a child can be visitation-referred (visiteret) to a special group or specialized school. These classes typically have 4-8 pupils, quiet lighting, visual schedules (Pictograms), sensory breakout rooms, and specially trained staff.',
    parentAdvice: 'The visitation process takes time and is usually decided by the municipal Visitation Committee (Visitationsudvalget) during spring for the August school year. Ensure your PPR psychologist has submitted the recommendation well ahead of deadlines.',
    keyPhrasesToSay: [
      '"Vi anmoder om visitation til et specialpædagogisk skoletilbud jf. Folkeskoleloven."'
    ],
    legalReference: 'Folkeskoleloven § 20, stk. 2'
  }
];
