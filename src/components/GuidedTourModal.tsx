import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  FileText, 
  Scale, 
  Building2, 
  MapPin, 
  Heart, 
  Languages, 
  Check, 
  ExternalLink,
  Eye,
  ShieldCheck
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights') => void;
}

interface TourStep {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  bulletPoints: string[];
  tabTarget?: 'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights';
  tabButtonLabel?: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    badge: 'Velkommen til AutismDK',
    title: 'Safe Community for Immigrant Parents in Denmark',
    subtitle: 'Navigating autism and special needs in Denmark is easier together.',
    description: 
      'When your child has autism or special needs, understanding the Danish municipal system (Kommune, PPR, VISO, Folkeskole) can be confusing—especially if Danish is not your first language. AutismDK is designed by and for parents to make navigating Denmark simple, dignified, and supportive.',
    bulletPoints: [
      'Multilingual interface with automatic translations for Arabic, Ukrainian, Somali, Urdu, Turkish & more',
      'Free, non-profit, parent-led, and fully sensory-friendly',
      'Guidance for all 98 Danish municipalities'
    ],
    iconBg: 'bg-[#d8e8e0]',
    iconColor: 'text-[#2b4c41]',
    icon: <span className="text-3xl">🌻</span>,
  },
  {
    id: 'decoder',
    badge: 'Feature 1: Letter Decoder',
    title: 'Decode Official Danish Kommune Letters',
    subtitle: 'Turn complex bureaucratic letters into clear, actionable advice in your language.',
    description: 
      'Received an official letter in your Digital Post (e-Boks or Mit.dk) from your case worker (sagsbehandler), PPR, or school? Upload or paste the text here to instantly get a plain-language summary in your preferred language.',
    bulletPoints: [
      'Extracts critical appeal deadlines (klagefrist) so you never miss a right to contest',
      'Explains difficult Danish administrative jargon in everyday language',
      'Provides a suggested response letter drafted in professional Danish'
    ],
    tabTarget: 'decoder',
    tabButtonLabel: 'Open Letter Decoder',
    iconBg: 'bg-[#e2eaf5]',
    iconColor: 'text-[#2b4a78]',
    icon: <FileText className="w-8 h-8 text-[#2b4a78]" />,
  },
  {
    id: 'rights',
    badge: 'Feature 2: Rights & Law Assistant',
    title: 'Know Your Rights Under Danish Law',
    subtitle: 'Understand Barnets Lov, Serviceloven, and municipal obligations.',
    description: 
      'Danish social law provides essential protections and economic assistance for families with disabled and neurodivergent children. Our AI-powered Rights Assistant helps you understand what you are legally entitled to ask for.',
    bulletPoints: [
      'Learn about Tabt Arbejdsfortjeneste (§ 87) for lost wages when caring for your child',
      'Guidance on Merudgifter (§ 86) for extra medicine, diet, or transport costs',
      'Pre-written application templates and legal paragraph references'
    ],
    tabTarget: 'rights',
    tabButtonLabel: 'Open Rights Assistant',
    iconBg: 'bg-[#f4ebe1]',
    iconColor: 'text-[#7d5028]',
    icon: <Scale className="w-8 h-8 text-[#7d5028]" />,
  },
  {
    id: 'hub',
    badge: 'Feature 3: Local Kommune Hub',
    title: 'Connect Locally Across All 98 Kommuner',
    subtitle: 'Every municipality works differently. Find parents near you.',
    description: 
      'Whether you live in København, Aarhus, Odense, Aalborg, or a smaller municipality, local practices vary. The Local Hub lets you filter community discussions, school experiences, and case worker tips specific to your area.',
    bulletPoints: [
      'Switch to your local Kommune with one click',
      'Read authentic reviews of local special education schools (Specialskoler / Heldagsskoler)',
      'Find local family meetups and parent coffee mornings'
    ],
    tabTarget: 'hub',
    tabButtonLabel: 'Explore Kommune Hub',
    iconBg: 'bg-[#e7eef0]',
    iconColor: 'text-[#2b5860]',
    icon: <Building2 className="w-8 h-8 text-[#2b5860]" />,
  },
  {
    id: 'map',
    badge: 'Feature 4: Sunflower Safe Spaces Map',
    title: 'Sensory-Friendly Places & Events Map',
    subtitle: 'Venues with quiet hours, low stimuli, and Solsikkesnoren recognition.',
    description: 
      'Finding outings where your child feels comfortable without sensory overload can be difficult. Our interactive map highlights locations where staff are trained in the Sunflower Lanyard (Solsikken) and offer low-stimulus environments.',
    bulletPoints: [
      'Quiet library hours, low-noise museums, and enclosed nature trails',
      'Filter venues by sensory accommodations (dim lighting, acoustic dampening, quiet break rooms)',
      'Community-submitted reviews from parents who visited with autistic children'
    ],
    tabTarget: 'map',
    tabButtonLabel: 'View Sensory Map',
    iconBg: 'bg-[#e6f4ea]',
    iconColor: 'text-[#276a3c]',
    icon: <MapPin className="w-8 h-8 text-[#276a3c]" />,
  },
  {
    id: 'sensory',
    badge: 'Feature 5: Sensory Calm Mode',
    title: 'Designed for Low Stress & Sensory Ease',
    subtitle: 'Zero flashing lights, gentle colors, and one-click sensory mode.',
    description: 
      'We know that screen time can be overwhelming for tired parents and neurodivergent adults. AutismDK is purposefully built with soft earthy tones, spacious layouts, and zero intrusive pop-ups.',
    bulletPoints: [
      'Click "Calm Mode" in the top bar to soften contrasts and mute visual noise',
      'Switch languages at any time from the top bar (English, Dansk, Arabic, Urdu, Ukrainian, etc.)',
      'Free equipment exchange (Resource Market) to pass on sensory swings, noise-canceling headphones, and weighted vests'
    ],
    tabTarget: 'dashboard',
    tabButtonLabel: 'Go to Dashboard',
    iconBg: 'bg-[#ebdbe8]',
    iconColor: 'text-[#6b3564]',
    icon: <Sparkles className="w-8 h-8 text-[#6b3564]" />,
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Keyboard navigation: Escape closes, Left/Right arrows navigate
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish();
      } else if (e.key === 'ArrowRight') {
        if (currentStepIndex < TOUR_STEPS.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  const handleFinish = () => {
    localStorage.setItem('autismdk_tour_completed_v1', 'true');
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleFinish();
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleJumpToTab = (tab?: 'dashboard' | 'forum' | 'map' | 'glossary' | 'decoder' | 'exchange' | 'hub' | 'rights') => {
    if (tab && onNavigateTab) {
      onNavigateTab(tab);
      handleFinish();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172622]/55 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-modal-title"
    >
      <div className="w-full max-w-xl bg-[#f8faf9] rounded-3xl border border-[#d2ded8] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 pt-5 pb-4 bg-gradient-to-b from-[#eaf2ee] to-[#f8faf9] border-b border-[#dce6e1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌻</span>
            <span className="font-bold text-sm tracking-tight text-[#1e312b]">
              AutismDK Guided Tour
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Step Counter */}
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#dbe8e2] text-[#294c41] rounded-full">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>

            {/* Close Button */}
            <button
              onClick={handleFinish}
              className="p-1.5 text-[#5e7771] hover:text-[#233530] hover:bg-[#dce6e1] rounded-full transition-colors cursor-pointer"
              title="Close tour"
              aria-label="Close tour"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="w-full bg-[#e3ece7] h-1.5 flex">
          {TOUR_STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStepIndex(idx)}
              className={`flex-1 h-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-[#3f6158]'
                  : idx < currentStepIndex
                  ? 'bg-[#7ba094]'
                  : 'bg-transparent'
              }`}
              title={`Go to step ${idx + 1}: ${step.title}`}
              aria-label={`Go to step ${idx + 1}`}
            />
          ))}
        </div>

        {/* Card Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          
          {/* Badge & Icon Row */}
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${currentStep.iconBg} flex items-center justify-center shrink-0 shadow-xs border border-white/60`}>
              {currentStep.icon}
            </div>

            <div className="flex-1">
              <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-[#dce7e2] text-[#294a40] rounded-md mb-1.5">
                {currentStep.badge}
              </span>
              <h2 id="tour-modal-title" className="text-xl font-bold text-[#1b312b] leading-tight">
                {currentStep.title}
              </h2>
              <p className="text-xs font-medium text-[#4d6a62] mt-0.5">
                {currentStep.subtitle}
              </p>
            </div>
          </div>

          {/* Description Text */}
          <p className="text-sm text-[#3d544d] leading-relaxed">
            {currentStep.description}
          </p>

          {/* Key Bullet Points */}
          <div className="p-4 bg-white/90 rounded-2xl border border-[#d6e3dc] shadow-2xs space-y-2.5">
            <span className="text-[11px] font-bold text-[#2e4c43] uppercase tracking-wider block">
              What You Can Do:
            </span>
            <ul className="space-y-2">
              {currentStep.bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-[#334b45] leading-relaxed">
                  <div className="w-4 h-4 rounded-full bg-[#dbe8e2] text-[#2c5347] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Direct Link to this feature (if step maps to a tab) */}
          {currentStep.tabTarget && (
            <div className="flex items-center justify-between p-3 bg-[#eef5f1] rounded-xl border border-[#d5e4dc]">
              <span className="text-xs text-[#36554c] font-medium">
                Want to try this feature immediately?
              </span>
              <button
                type="button"
                onClick={() => handleJumpToTab(currentStep.tabTarget)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-[#3f6158] hover:bg-[#324f47] rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <span>{currentStep.tabButtonLabel || 'Try Now'}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 bg-[#eff5f1] border-t border-[#d8e5df] flex items-center justify-between">
          
          {/* Skip Button */}
          <button
            type="button"
            onClick={handleFinish}
            className="text-xs font-semibold text-[#5a766f] hover:text-[#213731] hover:underline cursor-pointer"
          >
            Skip Tour
          </button>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3.5 py-2 bg-white hover:bg-[#e4ede8] text-[#29463e] border border-[#cedbd4] text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-[#3f6158] hover:bg-[#304d45] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{isLastStep ? 'Get Started 🌻' : 'Next Feature'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
