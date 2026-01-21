'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import CategoryChips from '@/components/CategoryChips';
import ToolCard from '@/components/ToolCard';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { ToolWithStats, Category, PricingType } from '@/lib/types';
import Link from 'next/link';
import PricingFilter from '@/components/PricingFilter';
import ContactSection from '@/components/ContactSection';

type SortOption = 'popular' | 'rating' | 'reviews';

export default function Home() {
  const [tools, setTools] = useState<ToolWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPricing, setSelectedPricing] = useState<PricingType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchTools = async (query: string = '', categories: Category[] = [], pricing: PricingType[] = [], pageNum: number = 1, sort: SortOption = 'popular') => {
    setLoading(true);
    try {
      const categoryParam = categories.length > 0 ? categories[0] : '';
      const pricingParam = pricing.length > 0 ? pricing.join(',') : '';
      const url = `/api/tools?query=${encodeURIComponent(query)}&category=${encodeURIComponent(categoryParam)}&pricing=${encodeURIComponent(pricingParam)}&page=${pageNum}&limit=20&sort=${sort}`;
      console.log('Fetching tools:', url);
      
      const response = await fetch(url);
      const data = await response.json();
      
      console.log('Tools received:', data.tools?.length || 0);
      
      if (pageNum === 1) {
        setTools(data.tools || []);
      } else {
        setTools((prev) => [...prev, ...(data.tools || [])]);
      }
      
      // Check if there are more tools (if we got exactly the limit, there might be more)
      setHasMore((data.tools || []).length >= 20);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools(searchQuery, selectedCategories, selectedPricing, 1, sortBy);
    setPage(1);
  }, [searchQuery, selectedCategories, selectedPricing, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTools(searchQuery, selectedCategories, selectedPricing, nextPage, sortBy);
  };

  const handlePricingToggle = (pricing: PricingType) => {
    setSelectedPricing((prev) =>
      prev.includes(pricing)
        ? prev.filter((p) => p !== pricing)
        : [...prev, pricing]
    );
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* NN TOOLS Animated Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-black text-[#4169E1] mb-2">
            NN TOOLS
          </h1>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="AI Tool Founder Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              AI Tool Founder – Compare & Review AI Tools
            </h2>
            <p className="text-lg text-gray-700 mb-3 max-w-3xl mx-auto">
              AI Tool Founder is a comparison and review platform for AI tools.
              Compare features, pricing and ratings, and read real reviews before choosing the right AI tool.
            </p>
            <p className="text-sm text-gray-500">
              By NN group
            </p>
          </div>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <div className="mb-6">
          <CategoryChips
            selected={selectedCategories}
            onToggle={handleCategoryToggle}
          />
        </div>

        <div className="mb-8">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Pricing:</h3>
          </div>
          <PricingFilter
            selected={selectedPricing}
            onToggle={handlePricingToggle}
          />
        </div>

        <div className="mb-4 flex items-center justify-between flex-wrap gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            {searchQuery || selectedCategories.length > 0
              ? 'Search Results'
              : 'All Tools'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-900">
                Sort by:
              </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as SortOption)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rating</option>
                  <option value="reviews">Most Reviews</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/favorites"
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Favorites
              </Link>
              <Link
                href="/top-tools"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Top Tools
              </Link>
              <Link
                href="/compare"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Compare Tools
              </Link>
            </div>
          </div>
        </div>

        {loading && page === 1 ? (
          <LoadingSkeleton />
        ) : tools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tools found</p>
            <p className="text-gray-400">
              Try adjusting your search or category filters
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
        
        <ContactSection />
      </div>
    </main>
  );
}
