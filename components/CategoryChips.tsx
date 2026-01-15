'use client';

import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

const CATEGORIES: Category[] = [
  'Video',
  'Image',
  'Audio',
  'Text',
  'Code',
  'Social/Creators',
  'Productivity',
  'Website/App Builder',
];

interface CategoryChipsProps {
  selected: Category[];
  onToggle: (category: Category) => void;
}

export default function CategoryChips({ selected, onToggle }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {CATEGORIES.map((category) => {
        const isSelected = selected.includes(category);
        return (
          <button
            key={category}
            onClick={() => onToggle(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
