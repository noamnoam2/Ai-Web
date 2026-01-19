'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { ToolWithStats, RatingInput, Rating } from '@/lib/types';
import { getPricingBadgeColor, getPricingDisplayName, generateFingerprint, hashFingerprint } from '@/lib/utils';
import RatingStars from '@/components/RatingStars';
import RateToolModal from '@/components/RateToolModal';
import LoadingSkeleton from '@/components/LoadingSkeleton';

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

export default function ToolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [tool, setTool] = useState<ToolWithStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    fetchTool();
  }, [slug]);

  const fetchTool = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/tools/${slug}`);
      if (response.ok) {
        const data = await response.json();
        setTool(data.tool);
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching tool:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleRateSubmit = async (rating: RatingInput) => {
    if (!tool) {
      console.error('Cannot submit rating: tool is null');
      return;
    }

    try {
      console.log('Submitting rating for tool:', tool.id, rating);
      
      const fingerprint = generateFingerprint();
      console.log('Generated fingerprint:', fingerprint ? 'OK' : 'FAILED');
      
      if (!fingerprint) {
        throw new Error('Failed to generate fingerprint');
      }

      const fingerprintHash = await hashFingerprint(fingerprint);
      console.log('Fingerprint hash:', fingerprintHash ? 'OK' : 'FAILED');

      if (!fingerprintHash) {
        throw new Error('Failed to hash fingerprint');
      }

      const requestBody = {
        ...rating,
        tool_id: tool.id,
        fingerprint_hash: fingerprintHash,
      };
      console.log('Request body:', requestBody);

      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('API error:', error);
        throw new Error(error.error || 'Failed to submit rating');
      }

      const result = await response.json();
      console.log('Rating submitted successfully:', result);

      // Refresh tool data to show updated stats
      await fetchTool();
      // Refresh ratings
      await fetchRatings();
    } catch (error) {
      console.error('Error in handleRateSubmit:', error);
      throw error;
    }
  };

  const fetchRatings = async () => {
    if (!tool) return;
    
    setLoadingRatings(true);
    try {
      const response = await fetch(`/api/ratings?tool_id=${tool.id}`);
      if (response.ok) {
        const data = await response.json();
        setRatings(data.ratings || []);
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
    } finally {
      setLoadingRatings(false);
    }
  };

  useEffect(() => {
    if (tool?.id) {
      const loadRatings = async () => {
        setLoadingRatings(true);
        try {
          const response = await fetch(`/api/ratings?tool_id=${tool.id}`);
          if (response.ok) {
            const data = await response.json();
            setRatings(data.ratings || []);
          }
        } catch (error) {
          console.error('Error fetching ratings:', error);
        } finally {
          setLoadingRatings(false);
        }
      };
      loadRatings();
    }
  }, [tool?.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <LoadingSkeleton />
        </div>
      </main>
    );
  }

  if (!tool) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Tool not found</p>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Go back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all tools
        </Link>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start gap-6 mb-6">
            {(() => {
              const logoUrl = tool.logo_url || getLogoUrlFromUrl(tool.url);
              const shouldShowImage = logoUrl && !imageError;
              
              return shouldShowImage ? (
                <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt={`${tool.name} logo`}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      // Try fallback to Google Favicon if Clearbit fails
                      if (logoUrl.includes('logo.clearbit.com') && !img.src.includes('google.com')) {
                        try {
                          const domain = new URL(tool.url).hostname.replace('www.', '');
                          const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                          img.src = fallbackUrl;
                          return; // Don't set error yet, try fallback first
                        } catch {
                          setImageError(true);
                        }
                      } else {
                        setImageError(true);
                      }
                    }}
                    onLoad={() => {
                      // Image loaded successfully
                      if (imageError) setImageError(false);
                    }}
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-3xl font-bold">
                  {tool.name.charAt(0).toUpperCase()}
                </div>
              );
            })()}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <RatingStars
                  rating={tool.avg_rating}
                  totalRatings={tool.total_ratings}
                  size="md"
                />
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getPricingBadgeColor(
                    tool.pricing_type
                  )}`}
                >
                  {getPricingDisplayName(tool.pricing_type)}
                  {tool.starting_price && ` ($${tool.starting_price})`}
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6 text-lg">{tool.description}</p>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {tool.categories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Rating Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.good_for_creators_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Good for creators</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.worth_money_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Worth the money</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.easy_to_use_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Easy to use</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.accurate_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Accurate</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.reliable_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Reliable</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">
                  {tool.beginner_friendly_pct.toFixed(0)}%
                </p>
                <p className="text-sm text-gray-600">Beginner friendly</p>
              </div>
            </div>
          </div>

          {ratings.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-4">Reviews ({ratings.length})</h2>
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={rating.stars} size="sm" />
                        <span className="text-sm text-gray-600">
                          {new Date(rating.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {rating.good_for_creators && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            Good for creators
                          </span>
                        )}
                        {rating.worth_money && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                            Worth the money
                          </span>
                        )}
                        {rating.easy_to_use && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                            Easy to use
                          </span>
                        )}
                        {rating.accurate && (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                            Accurate
                          </span>
                        )}
                        {rating.reliable && (
                          <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded text-xs">
                            Reliable
                          </span>
                        )}
                        {rating.beginner_friendly && (
                          <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs">
                            Beginner friendly
                          </span>
                        )}
                      </div>
                    </div>
                    {rating.comment && (
                      <p className="text-black text-sm mt-2">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Visit Website
              <ExternalLink className="w-5 h-5" />
            </a>
            <button
              onClick={() => {
                console.log('Rate button clicked, opening modal');
                setIsModalOpen(true);
              }}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Rate this Tool
            </button>
          </div>
        </div>
      </div>

      <RateToolModal
        toolName={tool.name}
        toolId={tool.id}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRateSubmit}
      />
    </main>
  );
}
