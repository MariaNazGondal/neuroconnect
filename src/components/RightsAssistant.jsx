import React, { useState, useRef, useEffect } from 'react';
import { 
  Scale, 
  Send, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  User, 
  Globe
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

// 3 Core Starter Prompts requested by the brief
const STARTER_PROMPTS = [
  {
    title: 'What is PPR?',
    prompt: 'What is PPR in Denmark, and how do they evaluate my autistic child for school or daycare support?'
  },
  {
    title: 'Can I get compensation for lost work?',
    prompt: 'Can I get compensation for lost earnings (Tabt arbejdsfortjeneste jf. Barnets Lov § 87) if I reduce my hours to care for my child?'
  },
  {
    title: "What are my child's rights in school?",
    prompt: 'What are my child\'s statutory rights in the Danish school system regarding support hours, special classes, and transport?'
  }
];

export function RightsAssistant() {
  const { profile } = useAuth();
  
  const preferredLangCode = profile?.preferredLanguage || 'en';
  const [selectedLang, setSelectedLang] = useState(preferredLangCode);

  const langObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      text: `Hej and welcome! I am your Danish Special Needs Rights Assistant.

I explain Danish social laws in plain language—specifically **Barnets Lov** (the Children's Act) and **Serviceloven**. Whether you have questions about PPR evaluations, reimbursement for extra expenses (§ 86 Merudgifter), lost earnings (§ 87), or your right to a free interpreter (*Tolk*), feel free to ask below in **${langObj.name}** or any language you feel comfortable with.

*Reminder: I provide legal information and peer guidance; official decisions are always made by your Kommune sagsbehandler.*`,
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [readingMessageId, setReadingMessageId] = useState(null);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      // Call backend Gemini API endpoint
      const response = await fetch('/api/rights-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          language: langObj.name
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'I am sorry, I could not generate a response. Please check with your case worker.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('API route error, activating built-in knowledge response:', err);

      // Fallback response matching Danish laws
      let fallbackText = '';
      const q = textToSend.toLowerCase();

      if (q.includes('ppr') || q.includes('evaluation')) {
        fallbackText = `**PPR (Pædagogisk Psykologisk Rådgivning)** is the municipal educational-psychological advisory service:

1. **Role**: PPR assesses whether your child needs supportive pedagogue hours, assistive devices, or placement in a special school/class (*specialklasse*).
2. **Process**: The kindergarten or school pedagogues observe your child, compile an observation report, and invite you to an assessment meeting (*PPV*).
3. **Your Legal Rights**: Under Danish Forvaltningslov § 7, you have the statutory right to an official interpreter if you are not fluent in Danish, and you can bring a support person (*bisidder*).

*Always remember to contact your local Kommune sagsbehandler for official decisions.*`;
      } else if (q.includes('work') || q.includes('tabt') || q.includes('earnings') || q.includes('compensation')) {
        fallbackText = `**Compensation for Lost Earnings (Tabt arbejdsfortjeneste - Barnets Lov § 87)**:

1. **Purpose**: Covers lost wages if caring for your child at home or attending appointments prevents you from working your normal job hours.
2. **Conditions**: Requires a permanent, significant condition/assessment where it is necessary that a parent cares for the child at home.
3. **Application**: Apply through your Kommune's Family & Disability Department. You must provide documentation of reduced hours and your child's medical records.

*Always remember to contact your local Kommune sagsbehandler for official decisions.*`;
      } else if (q.includes('school') || q.includes('rights') || q.includes('class')) {
        fallbackText = `**School Rights for Children with Autism in Denmark**:

1. **Adapted Teaching**: Under Folkeskoleloven, public schools must adapt teaching to your child's sensory and cognitive needs.
2. **Support Threshold**: Under 9 hours/week of support is decided by the school principal. Over 9 hours or special school requires a PPR evaluation.
3. **Transport (*Skolekørsel*)**: If your child is allocated a specialized school outside your walking district, the municipality must provide free door-to-door transport.

*Always remember to contact your local Kommune sagsbehandler for official decisions.*`;
      } else {
        fallbackText = `Regarding your question under **Barnets Lov** and **Serviceloven**:

Danish law protects special needs families through several provisions:
• **§ 86 Merudgifter**: Financial reimbursement for extra disability expenses (sensory items, clothes, transport).
• **§ 87 Tabt arbejdsfortjeneste**: Compensation if you must cut work hours to care for your child.
• **§ 84 Aflastning**: Respite care to give parents rest and recharge.
• **Forvaltningsloven § 7**: Right to a free certified interpreter at all municipal meetings.

*Always remember to contact your local Kommune sagsbehandler for official decisions.*`;
      }

      const assistantMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleReadAloud = (id, text) => {
    if (!('speechSynthesis' in window)) return;

    if (readingMessageId === id) {
      window.speechSynthesis.cancel();
      setReadingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langObj.code === 'da' ? 'da-DK' : 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setReadingMessageId(null);
    utterance.onerror = () => setReadingMessageId(null);

    window.speechSynthesis.speak(utterance);
    setReadingMessageId(id);
  };

  const resetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        text: `Chat reset. Ask any question about Danish special needs legislation, PPR, or your rights!`,
        timestamp: 'Just now'
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
              <Scale className="w-3.5 h-3.5" />
              <span>Danish Rights AI Assistant</span>
              <span>•</span>
              <span>Barnets Lov & Serviceloven</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
              Danish Autism Rights & Fact-Checker
            </h1>
            <p className="text-sm text-[#4d665e] mt-2 max-w-2xl leading-relaxed">
              Ask questions about Danish social law, debunk common municipal myths, and understand your rights to evaluations, interpreters, and financial support.
            </p>
          </div>

          {/* Language Selector */}
          <div className="bg-white p-2.5 rounded-2xl border border-[#d5e2db] shadow-xs flex items-center gap-2 self-start md:self-center">
            <Globe className="w-4 h-4 text-[#50766a] ml-1" />
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="text-xs font-semibold bg-transparent text-[#203932] focus:outline-hidden cursor-pointer pr-2"
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Suggested Starter Prompts as requested */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#44635a] uppercase tracking-wider block px-1">
          Suggested Starter Questions:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STARTER_PROMPTS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(item.prompt)}
              disabled={loading}
              className="p-3.5 bg-white hover:bg-[#edf5f0] border border-[#d2ded8] hover:border-[#4b7266] rounded-2xl text-left transition-all shadow-2xs group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1c3029] group-hover:text-[#28493f]">
                  {item.title}
                </span>
                <Sparkles className="w-3.5 h-3.5 text-[#50766a] opacity-75 group-hover:opacity-100" />
              </div>
              <p className="text-[11px] text-[#637d76] line-clamp-2 leading-relaxed">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-[#d6e2dc] shadow-xs overflow-hidden flex flex-col h-[520px]">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 bg-[#f0f6f3] border-b border-[#dce6e1] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[#1e342d]">Rights Guide active</span>
            <span className="text-[#648079] hidden sm:inline">• Explaining in {langObj.name} ({langObj.flag})</span>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="flex items-center gap-1 text-[#54736a] hover:text-[#1c332c] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#fbfdfb]">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isReading = readingMessageId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#dceae3] text-[#2c5044] font-bold flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Scale className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#3d5e55] text-white rounded-br-xs shadow-xs'
                        : 'bg-white text-[#21352f] border border-[#d8e4de] rounded-bl-xs shadow-2xs whitespace-pre-line'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Actions for Assistant Messages */}
                  {!isUser && (
                    <div className="flex items-center gap-3 px-1 text-[11px] text-[#6b857f]">
                      <span>{msg.timestamp}</span>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleToggleReadAloud(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 hover:text-[#1d352e] cursor-pointer"
                      >
                        {isReading ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="font-semibold text-emerald-800">Stop</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 hover:text-[#1d352e] cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {isUser && (
                    <div className="text-right text-[11px] text-[#7a938c] px-1">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#3d5e55] text-white font-bold flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-full bg-[#dceae3] text-[#2c5044] font-bold flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <div className="bg-white border border-[#d8e4de] px-4 py-3 rounded-2xl shadow-2xs flex items-center gap-2 text-xs text-[#527068]">
                <div className="w-2 h-2 rounded-full bg-[#4e7468] animate-ping" />
                <span>Checking Barnets Lov & Serviceloven...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="p-3 sm:p-4 bg-[#f3f7f5] border-t border-[#dce6e1] flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={loading}
            placeholder={`Ask a question about Danish autism laws or rights in ${langObj.name}...`}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-[#cfddd6] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#52776c] text-[#1c322b]"
          />

          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#3d5e55] hover:bg-[#2f4b43] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer min-h-[42px]"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Ask</span>
          </button>
        </form>

      </div>

      {/* Statutory Protection Footer Callout */}
      <div className="bg-[#f0f6f2] border border-[#d6e4dc] rounded-2xl p-4 flex items-start gap-3 text-xs text-[#446259]">
        <ShieldCheck className="w-5 h-5 text-[#3b6156] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#203630] block">Official Case Worker Reminder:</span>
          <p className="leading-relaxed">
            Danish social law gives you explicit rights to be heard (*partshøring*) and to receive a written justification (*begrundelse*) for any denial. 
            Always ask your Kommune sagsbehandler to put decisions in writing in your digital post box.
          </p>
        </div>
      </div>

    </div>
  );
}

export default RightsAssistant;
