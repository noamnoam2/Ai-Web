'use client';

import { PricingType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PricingFilterProps {
  selected: PricingType[];
  onToggle: (pricing: PricingType) => void;
}

const PRICING_OPTIONS: { value: PricingType; label: string }[] = [
  { value: 'Free', label: 'Free' },
  { value: 'Freemium', label: 'Free + Paid' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Trial', label: 'Free Trial' },
];

export default function PricingFilter({ selected, onToggle }: PricingFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRICING_OPTIONS.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            onClick={() => onToggle(option.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
