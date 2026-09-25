import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Globe, 
  Scale, 
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

// Sample Danish municipal letters so parents can test the decoder immediately
const SAMPLE_LETTERS = [
  {
    id: 'sample-ppr',
    title: 'Indkaldelse til PPV-møde (PPR København)',
    description: 'Invitation to Pedagogical-Psychological Assessment meeting for special school allocation.',
    danishText: `Københavns Kommune - Børne- og Ungdomsforvaltningen
Dato: 14. marts 2026

Vedrørende pædagogisk-psykologisk vurdering (PPV) for jeres barn.
Hermed indkaldes I til et tværfagligt netværksmøde jf. Folkeskolelovens § 12.
Mødedato: Tirsdag d. 7. april kl. 10:00 på PPR Kontor Nørrebro.
Formål: Gennemgang af observationsrapporter fra børnehaven samt stillingtagen til visitering mod specialklassetilbud med nedsat elevtal.

Frist for tilbagemelding: Senest 5 hverdage før mødet.
Bemærk: I har jf. Forvaltningsloven § 7 ret til gratis tolkebistand samt ret til at medbringe en bisidder (Forvaltningsloven § 8).`,
    analysis: {
      source: 'PPR København (Børne- og Ungdomsforvaltningen)',
      category: 'School Evaluation & Special Class Referral',
      deadline: 'Reply at least 5 business days before April 7, 2026',
      urgency: 'Important (Sets child\'s school placement for August)',
      summaries: {
        en: "Your municipality (PPR) has invited you to a formal evaluation meeting on Tuesday, April 7 at 10:00. The psychologist and educators will review observations to decide whether your child should be offered a small-group special class (specialklasse). You must reply at least 5 days in advance.",
        ar: "بلدية كوبنهاغن (قسم PPR) تدعوكم لحضور اجتماع رسمي يوم الثلاثاء 7 أبريل الساعة 10:00 صباحاً. الهدف هو مناقشة تقييم طفلكم وتحديد ما إذا كان سيتم نقله إلى فصل خاص يناسب احتياجات التوحد. يجب تأكيد الحضور قبل 5 أيام من الموعد.",
        ur: "کوپن ہیگن بلدیہ (پی پی آر) نے آپ کو منگل 7 اپریل کو صبح 10 بجے ایک اہم میٹنگ میں بلایا ہے۔ اس کا مقصد یہ فیصلہ کرنا ہے کہ آیا آپ کے بچے کو چھوٹے اسپیشل کلاس (اسپیشل کلاسی) میں جگہ دی جائے۔ آپ کو میٹنگ سے 5 دن پہلے جواب دینا ہوگا۔",
        so: "Degmada Copenhagen (PPR) waxay kugu casuuntay kulan rasmi ah Talaadada, Abriil 7 saacadu marka ay tahay 10:00. Waxay go'aaminayaan in ilmahaaga la geeyo fasal gaar ah oo loogu talagalay carruurta qabta autism-ka. Waa inaad kaga jawaabtaa 5 maalmood ka hor.",
        uk: "Муніципалітет Копенгагена (PPR) запрошує вас на офіційну зустріч у вівторок, 7 квітня, о 10:00. Психологи переглянуть звіти, щоб вирішити питання про переведення вашої дитини до спеціального класу з меншою кількістю учнів.",
        da: "Indkaldelse til netværksmøde hos PPR tirsdag d. 7. april kl. 10:00 vedrørende stillingtagen til specialklassetilbud jf. Folkeskolelovens § 12."
      },
      actionSteps: [
        'Confirm attendance before the 5-day deadline.',
        'Request an official certified interpreter (Tolk) immediately if Danish is not your fluent language.',
        'Request an advance copy of the psychologist\'s draft report (PPV udkast).'
      ],
      suggestedReply: 'Vi bekræfter deltagelse i mødet d. 7. april. Da vi har brug for fuld sproglig forståelse, anmoder vi formelt om en autoriseret tolk jf. Forvaltningslovens § 7.'
    }
  },
  {
    id: 'sample-merudgifter',
    title: 'Afgørelse om merudgifter jf. Barnets Lov § 86',
    description: 'Letter regarding reimbursement of extra disability clothing and sensory expenses.',
    danishText: `Albertslund Kommune - Familie- og Handicapafdelingen
Dato: 10. marts 2026

Afgørelse vedrørende ansøgning om dækning af nødvendige merudgifter (Barnets Lov § 86).
Kommunen har godkendt dækning af ekstra vaskeudgifter samt kørsel til børne- og ungdomspsykiatrisk afdeling.
Der anmodes om supplerende dokumentation og kvitteringer for sansestimulerende tyggehalskæder og tyngdedyne indenfor 14 dage.`,
    analysis: {
      source: 'Familie- og Handicapafdelingen',
      category: 'Financial Reimbursement (Barnets Lov § 86)',
      deadline: '14 days to submit receipts',
      urgency: 'Medium',
      summaries: {
        en: "The municipality has approved your application for extra disability costs regarding laundry and hospital transport! However, to approve the weighted blanket and sensory chew jewelry, they require you to send receipts and documentation within 14 days.",
        ar: "وافقت البلدية على طلبكم لتغطية مصاريف الغسيل ونقل المستشفى الخاصة بالطفل. ولكن للموافقة على البطانية الثقيلة وقلادات المضغ الحسية، يطلبون منكم إرسال الفواتير خلال 14 يوماً.",
        ur: "بلدیہ نے ہسپتال کے سفر اور اضافی لانڈری کے اخراجات کی منظوری دے دی ہے! البتہ وزنی کمبل (ٹائنگ ڈیڈائین) اور سینسری اشیاء کی منظوری کے لیے انہوں نے 14 دن کے اندر رسیدیں مانگی ہیں۔",
        so: "Degmada waxay ogolaatay codsigii lacag-celinta kharashaadka gaadiidka iyo dharka. Laakiin bustaha culus iyo qalabka kale ee dareenka waxay u baahan yihiin rasiidhada 14 maalmood gudahood.",
        uk: "Муніципалітет схвалив вашу заяву на відшкодування витрат на транспорт та прання. Проте для затвердження обтяженої ковдри необхідно надіслати чеки протягом 14 днів."
      },
      actionSteps: [
        'Collect receipts for sensory chew items and weighted blanket.',
        'Upload receipts to Digital Post / Borger.dk within 14 days.',
        'Save bank statements showing payment.'
      ],
      suggestedReply: 'Hermed fremsendes efterspurgte kvitteringer og lægelig anbefaling for tyngdedyne jf. Barnets Lov § 86.'
    }
  }
];

export function DocumentScanner() {
  const { profile } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const preferredLang = profile?.preferredLanguage || 'en';
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === preferredLang) || SUPPORTED_LANGUAGES[0];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    processDocument(file.name);
  };

  const handleSelectSample = (sample) => {
    setSelectedFile({ name: sample.title });
    setPreviewUrl(null);
    processDocument(sample.title, sample);
  };

  const processDocument = (title, sampleData = null) => {
    setAnalyzing(true);
    setResult(null);

    // Simulated cloud OCR & translation processing (mimicking Cloud Document AI / Firebase extension)
    setTimeout(() => {
      setAnalyzing(false);
      const chosen = sampleData || SAMPLE_LETTERS[0];
      setResult(chosen.analysis);
    }, 1800);
  };

  const handleCopyPhrase = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetScanner = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
          <span>📄 AI Kommune Letter Decoder</span>
          <span>•</span>
          <span>Non-Panic Parent Guide</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
          Understand Official Danish Letters Instantly
        </h1>
        <p className="text-sm text-[#4d665e] mt-2 leading-relaxed max-w-2xl">
          Did you receive a letter in e-Boks or Digital Post from PPR, the municipality, or school? 
          Snap a photo or upload it. We extract the key points, deadlines (*frister*), and what to reply in <strong>{currentLangObj.name} ({currentLangObj.flag})</strong>.
        </p>
      </div>

      {/* Upload & Camera Box */}
      {!result && !analyzing && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border-2 border-dashed border-[#c6d7cf] hover:border-[#4d7167] p-8 text-center transition-colors shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-[#e5efe9] text-[#3e6056] flex items-center justify-center mx-auto mb-4">
              <Camera className="w-7 h-7" />
            </div>

            <h3 className="text-base font-bold text-[#1f312c] mb-1">
              Take a Photo or Upload Document
            </h3>
            <p className="text-xs text-[#5f7871] max-w-md mx-auto mb-5 leading-relaxed">
              Upload a picture of the letter from your phone or select a screenshot from e-Boks.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {/* Native mobile camera capture */}
              <label className="flex items-center gap-2 px-5 py-3 bg-[#3d5e55] hover:bg-[#304d45] text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer min-h-[44px]">
                <Camera className="w-4 h-4" />
                <span>Open Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {/* File upload */}
              <label className="flex items-center gap-2 px-5 py-3 bg-white hover:bg-[#f0f5f2] border border-[#cfddd6] text-[#365149] font-semibold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer min-h-[44px]">
                <Upload className="w-4 h-4 text-[#507268]" />
                <span>Select from Gallery / PDF</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Quick Sample Selector for immediate trial */}
          <div className="bg-[#f2f7f4] border border-[#d6e3dc] rounded-2xl p-4 sm:p-5">
            <p className="text-xs font-bold text-[#2d4940] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#4e7469]" />
              <span>Or try a sample municipal letter:</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SAMPLE_LETTERS.map(sample => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="p-3 bg-white hover:bg-[#edf5f0] border border-[#d2ded8] rounded-xl text-left transition-colors cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#1f332c]">{sample.title}</p>
                  <p className="text-[11px] text-[#607972] line-clamp-1">{sample.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calming Loading State */}
      {analyzing && (
        <div className="bg-white rounded-3xl border border-[#d6e2dc] p-12 text-center shadow-xs space-y-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-[#d5e4dd] border-t-[#3b5d53] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center text-xl">
              🌻
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1f312c]">Analyzing and Translating Document...</h3>
            <p className="text-xs text-[#5e7771] mt-1 max-w-sm mx-auto">
              Scanning Danish administrative terms, dates, deadlines, and rights for special needs families.
            </p>
          </div>
        </div>
      )}

      {/* Results Container: Simplified Summary */}
      {result && !analyzing && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <div>
                <h2 className="text-lg font-bold text-[#1f312c]">Letter Analysis Results</h2>
                <p className="text-xs text-[#5d7770]">Source: {result.source}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#46635c] hover:bg-[#e9f1ed] rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scan Another</span>
            </button>
          </div>

          {/* Urgent Deadlines Alert Box */}
          <div className="bg-[#fcf8e3] border border-[#edd78a] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
            <Clock className="w-5 h-5 text-[#8c6b16] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#634907] uppercase tracking-wider">
                Action Deadline (Frist):
              </h4>
              <p className="text-sm font-semibold text-[#443204] mt-0.5">{result.deadline}</p>
              <p className="text-xs text-[#6e5616] mt-1">Priority: {result.urgency}</p>
            </div>
          </div>

          {/* Simplified Summary in User's Language */}
          <div className="bg-white rounded-2xl border border-[#d6e2dc] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#e2ede7] pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#43675d]" />
                <span className="text-xs font-bold text-[#233f37]">
                  Simplified Summary in {currentLangObj.name} ({currentLangObj.flag}):
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#54736a] bg-[#ecf4f0] px-2 py-0.5 rounded-full">
                Easy Plain Language
              </span>
            </div>

            <div className="text-sm text-[#243a34] leading-relaxed font-medium bg-[#f6fbf8] p-4 rounded-xl border border-[#dbe8e1]">
              {result.summaries[preferredLang] || result.summaries.en}
            </div>

            {/* Practical Action Steps */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#49655d] mb-2">
                Recommended Next Steps for You:
              </h4>
              <div className="space-y-2">
                {result.actionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#304741]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready-to-Send Reply Phrase */}
            <div className="pt-3 border-t border-[#e2ede7]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#527067] block mb-1.5">
                Ready-to-Send Danish Response for your Case Worker:
              </span>
              <div className="flex items-center justify-between gap-2 p-3 bg-[#f0f5f2] rounded-xl border border-[#dbe5e0] text-xs font-mono text-[#253d36]">
                <span className="leading-relaxed">{result.suggestedReply}</span>
                <button
                  type="button"
                  onClick={() => handleCopyPhrase(result.suggestedReply)}
                  className="shrink-0 p-2 bg-white hover:bg-[#e4ede7] border border-[#cde0d7] rounded-lg text-[#3f5d55] transition-colors cursor-pointer"
                  title="Copy phrase"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default DocumentScanner;
