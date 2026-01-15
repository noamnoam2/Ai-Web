'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { ToolWithStats } from '@/lib/types';
import { getFavorites, removeFromFavorites } from '@/lib/favorites';
import ToolCard from '@/components/ToolCard';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<ToolWithStats[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
    
    // Listen for storage changes (when favorites are updated from other tabs)
    const handleStorageChange = () => {
      setFavorites(getFavorites());
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically (for same-tab updates)
    const interval = setInterval(() => {
      setFavorites(getFavorites());
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleRemove = (toolId: string) => {
    removeFromFavorites(toolId);
    setFavorites(getFavorites());
  };

  const handleAddToCompare = (slugs: string[]) => {
    if (slugs.length === 0) return;
    router.push(`/compare?slugs=${slugs.join(',')}`);
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-8 h-8 text-red-500 fill-current" />
              My Favorites
            </h1>
            {favorites.length > 0 && favorites.length <= 3 && (
              <button
                onClick={() => handleAddToCompare(favorites.map(f => f.slug))}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Compare All ({favorites.length})
              </button>
            )}
          </div>
          
          {favorites.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No favorites yet</p>
              <p className="text-gray-400 mb-4">
                Start adding tools to your favorites by clicking the heart icon on any tool card
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Tools
              </Link>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-6">
                You have {favorites.length} favorite {favorites.length === 1 ? 'tool' : 'tools'}
              </p>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((tool) => (
                  <div key={tool.id} className="relative">
                    <ToolCard tool={tool} />
                    <button
                      onClick={() => handleRemove(tool.id)}
                      className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500 transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {favorites.length > 0 && (
                <div className="mt-8 flex gap-4 justify-center">
                  {favorites.length <= 3 && (
                    <button
                      onClick={() => handleAddToCompare(favorites.map(f => f.slug))}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Compare All Favorites
                    </button>
                  )}
                  <Link
                    href="/compare"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Go to Compare Page
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
