'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { X, ArrowLeft, Heart } from 'lucide-react';
import { ToolWithStats } from '@/lib/types';
import { getFavorites } from '@/lib/favorites';
import CompareTable from '@/components/CompareTable';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default function ComparePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [tools, setTools] = useState<ToolWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ToolWithStats[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<ToolWithStats[]>([]);

  useEffect(() => {
    const slugsParam = searchParams.get('slugs');
    if (slugsParam) {
      const slugs = slugsParam.split(',').map((s) => s.trim()).filter(Boolean);
      setSelectedSlugs(slugs);
      if (slugs.length > 0) {
        fetchTools(slugs);
      }
    }
    // Load favorites
    setFavorites(getFavorites());
  }, [searchParams]);

  const fetchTools = async (slugs: string[]) => {
    if (slugs.length === 0) {
      setTools([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/compare?slugs=${slugs.join(',')}`);
      const data = await response.json();
      setTools(data.tools || []);
      
      // Update URL
      const newParams = new URLSearchParams();
      newParams.set('slugs', slugs.join(','));
      router.push(`/compare?${newParams.toString()}`, { scroll: false });
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(`/api/tools?query=${encodeURIComponent(query)}&limit=10`);
      const data = await response.json();
      setSearchResults(data.tools || []);
    } catch (error) {
      console.error('Error searching tools:', error);
    }
  };

  const addTool = (slug: string) => {
    if (selectedSlugs.length >= 3) {
      alert('You can compare up to 3 tools at once');
      return;
    }
    if (selectedSlugs.includes(slug)) {
      return;
    }
    const newSlugs = [...selectedSlugs, slug];
    setSelectedSlugs(newSlugs);
    fetchTools(newSlugs);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const removeTool = (slug: string) => {
    const newSlugs = selectedSlugs.filter((s) => s !== slug);
    setSelectedSlugs(newSlugs);
    fetchTools(newSlugs);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all tools
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Compare Tools</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSlugs.map((slug) => {
              const tool = tools.find((t) => t.slug === slug);
              return (
                <div
                  key={slug}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg"
                >
                  <span>{tool?.name || slug}</span>
                  <button
                    onClick={() => removeTool(slug)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            {selectedSlugs.length < 3 && (
              <>
                <button
                  onClick={() => {
                    setShowSearch(!showSearch);
                    setShowFavorites(false);
                  }}
                  className="px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Tool ({selectedSlugs.length}/3)
                </button>
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      setShowFavorites(!showFavorites);
                      setShowSearch(false);
                    }}
                    className="px-4 py-2 border-2 border-dashed border-red-300 text-red-600 rounded-lg hover:border-red-500 hover:text-red-700 transition-colors flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    Add from Favorites ({favorites.length})
                  </button>
                )}
              </>
            )}
          </div>

          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search for a tool to add..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults
                    .filter((tool) => !selectedSlugs.includes(tool.slug))
                    .map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => addTool(tool.slug)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{tool.name}</div>
                        <div className="text-sm text-gray-600">{tool.description}</div>
                      </button>
                    ))}
                </div>
              )}
            </div>
          )}

          {showFavorites && (
            <div className="mb-4">
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {favorites
                  .filter((tool) => !selectedSlugs.includes(tool.slug))
                  .map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => addTool(tool.slug)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-gray-900">{tool.name}</div>
                      <div className="text-sm text-gray-600">{tool.description}</div>
                    </button>
                  ))}
                {favorites.filter((tool) => !selectedSlugs.includes(tool.slug)).length === 0 && (
                  <div className="px-4 py-3 text-gray-500 text-center">
                    No favorites available to add
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : tools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-500 text-lg mb-4">
              Select up to 3 tools to compare
            </p>
            <p className="text-gray-400">
              Click "Add Tool" to get started
            </p>
          </div>
        ) : (
          <CompareTable tools={tools} />
        )}
      </div>
    </main>
  );
}
