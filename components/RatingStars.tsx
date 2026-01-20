'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingStarsProps {
  rating: number;
  totalRatings?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  totalRatings,
  size = 'md',
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (value: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!interactive || !onRatingChange) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    
    const ratingValue = isLeftHalf ? value - 0.5 : value;
    onRatingChange(ratingValue);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((value) => {
          const isFilled = value <= rating;
          const isHalfFilled = !isFilled && (value - 0.5) <= rating;
          
          return (
            <div key={value} className="relative inline-block">
              {/* Background star (always gray) */}
              <Star
                className={cn(
                  sizeClasses[size],
                  "fill-gray-200 text-gray-200"
                )}
              />
              
              {/* Foreground star (filled or half-filled) */}
              <div
                className={cn(
                  "absolute top-0 left-0 overflow-hidden",
                  isHalfFilled ? "w-1/2" : isFilled ? "w-full" : "w-0"
                )}
                style={{ direction: 'ltr' }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "fill-yellow-400 text-yellow-400"
                  )}
                />
              </div>
              
              {/* Interactive button */}
              {interactive && (
                <button
                  type="button"
                  onClick={(e) => handleClick(value, e)}
                  className={cn(
                    "absolute inset-0 cursor-pointer",
                    "hover:opacity-20 hover:bg-yellow-200 transition-opacity"
                  )}
                  style={{ zIndex: 10 }}
                  title={`Click left for ${value - 0.5} stars, right for ${value} stars`}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-sm text-gray-600 ml-1">
        {rating.toFixed(1)}
        {totalRatings !== undefined && (
          <span className="text-gray-400"> ({totalRatings})</span>
        )}
      </span>
    </div>
  );
}
