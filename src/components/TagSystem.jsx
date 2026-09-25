import React from 'react';
import { Baby, School, Users, Sparkles, Check } from 'lucide-react';

/**
 * Definition of Child Age Groups
 */
export const AGE_TAGS = [
  {
    id: 'all',
    label: 'All Ages',
    sublabel: 'General & family-wide',
    icon: Sparkles,
  },
  {
    id: '0-5',
    label: '0-5 (Early Intervention)',
    sublabel: 'Daycare, vuggestue & early diagnosis',
    icon: Baby,
    accent: 'bg-[#e5f1ec] text-[#244f41] border-[#c8ded4]'
  },
  {
    id: '6-12',
    label: '6-12 (School Age)',
    sublabel: 'Folkeskole, specialklasser & PPR',
    icon: School,
    accent: 'bg-[#e9eff6] text-[#264566] border-[#cbd8e7]'
  },
  {
    id: '13+',
    label: '13+ (Teens & Youth)',
    sublabel: 'Transition, STU, youth education & respite',
    icon: Users,
    accent: 'bg-[#f4efe8] text-[#5c4424] border-[#e2d5c2]'
  }
];

/**
 * AgeFilterChips Component
 * Placed at the top of the main forum feed for instant filtering.
 *
 * @param {Object} props
 * @param {string} props.selectedAgeTag - Current selected tag ID ('all', '0-5', '6-12', '13+')
 * @param {Function} props.onSelectAgeTag - Callback when user clicks a chip
 */
export function AgeFilterChips({ selectedAgeTag = 'all', onSelectAgeTag }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold text-[#48635b] px-1">
        <span>Filter Discussions by Child&apos;s Age:</span>
        <span className="text-[11px] text-[#6b857f] hidden sm:inline">Tailored for developmental stages</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {AGE_TAGS.map(tag => {
          const Icon = tag.icon;
          const isSelected = selectedAgeTag === tag.id;

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onSelectAgeTag(tag.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-2xs border ${
                isSelected
                  ? 'bg-[#3d5e55] text-white border-[#304d45] ring-2 ring-[#3d5e55]/25 shadow-xs'
                  : 'bg-white hover:bg-[#edf5f1] text-[#415e55] border-[#d4e1db]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-200' : 'text-[#50766a]'}`} />
              <span>{tag.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AgeTagSelector Component
 * Form field to make selecting an age group mandatory when submitting a new post.
 *
 * @param {Object} props
 * @param {string} props.selectedTag - The currently selected tag value
 * @param {Function} props.onChange - Callback with the selected tag
 * @param {boolean} [props.error] - Whether validation error should be highlighted
 */
export function AgeTagSelector({ selectedTag, onChange, error }) {
  // Only the 3 concrete age tags (not 'all')
  const validAgeTags = AGE_TAGS.filter(t => t.id !== 'all');

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#293e38]">
          Child Age Group <span className="text-rose-500 font-bold">* (Required)</span>
        </label>
        {error && (
          <span className="text-[11px] font-semibold text-rose-600">
            Please choose an age category
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {validAgeTags.map(tag => {
          const Icon = tag.icon;
          const isSelected = selectedTag === tag.id;

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onChange(tag.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#eef6f2] border-[#3f655b] ring-2 ring-[#3f655b]/20 shadow-2xs'
                  : 'bg-white border-[#d2ded8] hover:bg-[#f6faf8]'
              } ${error && !selectedTag ? 'border-rose-300' : ''}`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1f332c]">
                  <Icon className="w-3.5 h-3.5 text-[#4a7266]" />
                  <span>{tag.label}</span>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-[#3d5e55] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </div>
              <p className="text-[11px] text-[#637d76] leading-tight">{tag.sublabel}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AgeBadge Component
 * Displays a small sensory badge on rendered post cards.
 */
export function AgeBadge({ tagId }) {
  const match = AGE_TAGS.find(t => t.id === tagId);
  if (!match || match.id === 'all') return null;

  const Icon = match.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${match.accent || 'bg-[#edf4f0] text-[#34524a] border-[#d0dfd8]'}`}>
      <Icon className="w-3 h-3" />
      <span>{match.label.split(' ')[0]}</span>
    </span>
  );
}

export default { AgeFilterChips, AgeTagSelector, AgeBadge, AGE_TAGS };
