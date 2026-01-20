'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Heart } from 'lucide-react';
import { ToolWithStats } from '@/lib/types';
import { getPricingBadgeColor, getPricingDisplayName } from '@/lib/utils';
import { isFavorite, toggleFavorite } from '@/lib/favorites';
import RatingStars from './RatingStars';

interface ToolCardProps {
  tool: ToolWithStats;
}

// Helper function to generate logo URL from tool URL
// Use Google Favicon API as primary since it's more reliable
function getLogoUrlFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    // Use Google Favicon API (more reliable than Clearbit)
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    try {
      const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
      return '';
    }
  }
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [imageError, setImageError] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('');
  
  // Always try to get a logo URL - use existing or generate from URL
  useEffect(() => {
    const logoUrl = tool.logo_url || getLogoUrlFromUrl(tool.url);
    setCurrentLogoUrl(logoUrl);
    setImageError(false);
  }, [tool.logo_url, tool.url]);
  
  const shouldShowImage = currentLogoUrl && !imageError;
  
  useEffect(() => {
    setFavorite(isFavorite(tool.id));
  }, [tool.id]);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(tool);
    setFavorite(!favorite);
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {shouldShowImage ? (
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                <img
                  src={currentLogoUrl}
                  alt={`${tool.name} logo`}
                  className="w-full h-full object-contain p-1"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    // Try fallback to Google Favicon if current URL fails
                    if (!img.src.includes('google.com')) {
                      try {
                        const domain = new URL(tool.url).hostname.replace('www.', '');
                        const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                        if (img.src !== fallbackUrl) {
                          img.src = fallbackUrl;
                          return; // Don't set error yet, try fallback first
                        }
                      } catch {
                        setImageError(true);
                      }
                    }
                    setImageError(true);
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                    setImageError(false);
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold flex-shrink-0">
                {tool.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 flex items-center justify-between">
              <Link
                href={`/tools/${tool.slug}`}
                className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors block"
              >
                {tool.name}
              </Link>
              <button
                onClick={handleFavoriteClick}
                className={`ml-2 p-2 rounded-full transition-colors ${
                  favorite
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
                title={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {tool.description || 'No description available'}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-2 items-center">
            {/* Popular badge */}
            {(() => {
              const popularityScore = tool.avg_rating * tool.total_ratings;
              const isPopular = tool.total_ratings >= 5 && tool.avg_rating >= 4.0 && popularityScore >= 20;
              return isPopular ? (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-bold">
                  POPULAR
                </span>
              ) : null;
            })()}
            {tool.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <RatingStars
          rating={tool.avg_rating}
          totalRatings={tool.total_ratings}
          size="sm"
        />
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getPricingBadgeColor(
            tool.pricing_type
          )}`}
        >
          {getPricingDisplayName(tool.pricing_type)}
        </span>
      </div>

      <div className="flex gap-2">
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Open
          <ExternalLink className="w-4 h-4" />
        </a>
        <Link
          href={`/tools/${tool.slug}`}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-center"
        >
          Rate
        </Link>
      </div>
    </div>
  );
}
