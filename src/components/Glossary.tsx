import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ExternalLink, 
  HelpCircle, 
  Volume2, 
  ShieldCheck, 
  Scale, 
  Sparkles,
  Globe
} from 'lucide-react';
import { GLOSSARY_TERMS, GlossaryTerm } from '../data/glossaryData';
import { useAuth } from '../context/AuthContext';
import { SUPPORTED_LANGUAGES } from '../data/danishMunicipalities';

const CATEGORIES = [
  'All',
  'Evaluation & Assessment',
  'Financial & Practical Aid',
  'School & Daycare',
  'Rights & Procedures'
];

export const Glossary: React.FC = () => {
  const { profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedPhrase, setCopiedPhrase] = useState<string | null>(null);

  const preferredLang = profile?.preferredLanguage || 'en';
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === preferredLang) || SUPPORTED_LANGUAGES[0];

  const handleCopy = (phrase: string) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhrase(phrase);
    setTimeout(() => setCopiedPhrase(null), 2000);
  };

  const filteredTerms = GLOSSARY_TERMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      item.term.toLowerCase().includes(q) ||
      item.shortSummary.toLowerCase().includes(q) ||
      item.detailedExplanation.toLowerCase().includes(q) ||
      item.parentAdvice.toLowerCase().includes(q) ||
      (item.legalReference && item.legalReference.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#e7efe9] via-[#edf4ef] to-[#f4f7f5] rounded-3xl p-6 sm:p-8 border border-[#d6e3dc] shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#d5e4dc] rounded-full text-xs font-semibold text-[#2f4b43] mb-3">
            <span>📚 Danish System Knowledge Hub</span>
            <span>•</span>
            <span>Immigrant Parent Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b2f29] tracking-tight">
            Demystifying the Danish Special Needs System
          </h1>
          <p className="text-sm text-[#4d665e] mt-2 leading-relaxed">
            Navigating Danish municipal laws, abbreviations, and rights can feel daunting when Danish is not your first language. 
            Here is your clear, accessible glossary of Danish terms, legal statutes, and exact phrases to use when speaking to your case worker.
          </p>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#5e7771]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Danish terms (e.g. PPR, VISO, Børnefaglig undersøgelse, Merudgifter, Solsikke)..."
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#d4e0da] rounded-2xl shadow-xs focus:outline-hidden focus:ring-2 focus:ring-[#52776c]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#3d5e55] text-white shadow-xs'
                  : 'bg-white border border-[#d6e2dc] text-[#4d665f] hover:bg-[#edf3f0]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTerms.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white rounded-3xl border border-[#d8e3dd] p-8">
            <BookOpen className="w-10 h-10 text-[#648078] mx-auto mb-2" />
            <h3 className="text-base font-bold text-[#1f312c]">No glossary terms found</h3>
            <p className="text-xs text-[#5f7871] mt-1">Try another search term or click &apos;All&apos; categories above.</p>
          </div>
        ) : (
          filteredTerms.map(term => {
            const translationSnippet = term.multilingualQuickLook?.[preferredLang];

            return (
              <div
                key={term.id}
                className="bg-white rounded-2xl border border-[#d6e2dc] p-5 sm:p-6 shadow-xs hover:border-[#b8cfc5] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Category & Legal Reference */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#355249] bg-[#eaf3ee] px-2.5 py-0.5 rounded-full">
                      {term.category}
                    </span>
                    {term.legalReference && (
                      <span className="text-[11px] font-semibold text-[#54736a] flex items-center gap-1">
                        <Scale className="w-3 h-3 text-[#6d8e84]" />
                        {term.legalReference}
                      </span>
                    )}
                  </div>

                  {/* Title & Phonetic */}
                  <h3 className="text-lg font-bold text-[#1a2f29] mb-1">
                    {term.term}
                  </h3>
                  {term.pronunciation && (
                    <p className="text-xs text-[#637d76] italic mb-3 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-[#5e8277]" />
                      <span>Pronunciation: &quot;{term.pronunciation}&quot;</span>
                    </p>
                  )}

                  {/* Multilingual Quick Translation if available for user's language */}
                  {translationSnippet && (
                    <div className="mb-3.5 p-2.5 bg-[#f0f6f3] border-l-3 border-[#426a5e] rounded-r-xl text-xs text-[#22443a]">
                      <div className="flex items-center gap-1 font-bold text-[11px] text-[#295045] mb-0.5">
                        <Globe className="w-3 h-3 text-[#426a5e]" />
                        <span>Quick Look in {currentLangObj.name} ({currentLangObj.flag}):</span>
                      </div>
                      <p className="leading-relaxed">{translationSnippet}</p>
                    </div>
                  )}

                  {/* Short Summary */}
                  <p className="text-xs font-semibold text-[#293d37] leading-relaxed mb-3">
                    {term.shortSummary}
                  </p>

                  {/* Detailed Explanation */}
                  <p className="text-xs text-[#465f57] leading-relaxed mb-4">
                    {term.detailedExplanation}
                  </p>

                  {/* Parent Advice Box */}
                  <div className="bg-[#f6f9f7] border border-[#dbe7e1] rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#2d4e44] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#426a5e]" />
                      <span>Advice for Immigrant Parents:</span>
                    </div>
                    <p className="text-xs text-[#3f5750] leading-relaxed">
                      {term.parentAdvice}
                    </p>
                  </div>
                </div>

                {/* Useful Danish Phrases to Copy */}
                {term.keyPhrasesToSay && term.keyPhrasesToSay.length > 0 && (
                  <div className="pt-3 border-t border-[#e5eeea] space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#527067]">
                      Copyable Danish Phrases for your Case Worker:
                    </span>
                    <div className="space-y-1.5">
                      {term.keyPhrasesToSay.map((phrase, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between gap-2 p-2 bg-[#f0f5f2] rounded-lg border border-[#dbe5e0] text-xs font-mono text-[#253d36]"
                        >
                          <span className="truncate">{phrase}</span>
                          <button
                            onClick={() => handleCopy(phrase)}
                            title="Copy to clipboard"
                            className="shrink-0 p-1 text-[#4e6c64] hover:text-[#1e302a] hover:bg-[#dbe7e1] rounded-md transition-colors"
                          >
                            {copiedPhrase === phrase ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
