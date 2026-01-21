'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category, ToolWithStats } from '@/lib/types';
import ToolCard from '@/components/ToolCard';

const categories: Category[] = [
  'Video',
  'Image',
  'Audio',
  'Text',
  'Code',
  'Social/Creators',
  'Productivity',
  'Website/App Builder',
];

export default function TopToolsPage() {
  const [topToolsByCategory, setTopToolsByCategory] = useState<Record<Category, ToolWithStats[]>>({} as Record<Category, ToolWithStats[]>);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTools();
  }, []);

  const fetchTopTools = async () => {
    setLoading(true);
    try {
      const toolsByCategory: Record<Category, ToolWithStats[]> = {} as Record<Category, ToolWithStats[]>;

      // Fetch top 10 tools for each category
      for (const category of categories) {
        const response = await fetch(
          `/api/tools?category=${encodeURIComponent(category)}&page=1&limit=10&sort=popular`
        );
        const data = await response.json();
        toolsByCategory[category] = data.tools || [];
      }

      setTopToolsByCategory(toolsByCategory);
    } catch (error) {
      console.error('Error fetching top tools:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Top 10 Tools by Category
          </h1>
          <p className="text-gray-600">
            Discover the most popular AI tools in each category
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading top tools...</p>
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const tools = topToolsByCategory[category] || [];
              
              if (tools.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {category}
                    </h2>
                    <Link
                      href={`/?category=${encodeURIComponent(category)}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View all {category} tools →
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
