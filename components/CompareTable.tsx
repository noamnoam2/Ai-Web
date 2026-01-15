'use client';

import { useState } from 'react';
import { ToolWithStats } from '@/lib/types';
import { getPricingBadgeColor, getPricingDisplayName } from '@/lib/utils';
import RatingStars from './RatingStars';

interface CompareTableProps {
  tools: ToolWithStats[];
}

// Helper function to generate logo URL from tool URL
function getLogoUrlFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.replace('www.', '');
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

export default function CompareTable({ tools }: CompareTableProps) {
  if (tools.length === 0) return null;

  const fields = [
    {
      label: 'Logo',
      getValue: (tool: ToolWithStats) => {
        const logoUrl = tool.logo_url || getLogoUrlFromUrl(tool.url);
        return logoUrl ? (
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0 mx-auto">
            <img
              src={logoUrl}
              alt={`${tool.name} logo`}
              className="w-full h-full object-contain p-1"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (logoUrl.includes('logo.clearbit.com') && !img.src.includes('google.com')) {
                  try {
                    const domain = new URL(tool.url).hostname.replace('www.', '');
                    const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                    img.src = fallbackUrl;
                  } catch {
                    img.style.display = 'none';
                    const parent = img.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold">${tool.name.charAt(0).toUpperCase()}</div>`;
                    }
                  }
                } else {
                  img.style.display = 'none';
                  const parent = img.parentElement;
                  if (parent) {
                    parent.innerHTML = `<div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold">${tool.name.charAt(0).toUpperCase()}</div>`;
                  }
                }
              }}
            />
          </div>
        ) : (
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xl font-bold mx-auto">
            {tool.name.charAt(0).toUpperCase()}
          </div>
        );
      },
    },
    { label: 'Name', getValue: (tool: ToolWithStats) => tool.name },
    { label: 'Description', getValue: (tool: ToolWithStats) => tool.description },
    {
      label: 'Categories',
      getValue: (tool: ToolWithStats) => tool.categories.join(', '),
    },
    {
      label: 'Pricing',
      getValue: (tool: ToolWithStats) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getPricingBadgeColor(
            tool.pricing_type
          )}`}
        >
          {getPricingDisplayName(tool.pricing_type)}
          {tool.starting_price && ` ($${tool.starting_price})`}
        </span>
      ),
    },
    {
      label: 'Rating',
      getValue: (tool: ToolWithStats) => (
        <RatingStars
          rating={tool.avg_rating}
          totalRatings={tool.total_ratings}
          size="sm"
        />
      ),
    },
    {
      label: 'Good for Creators',
      getValue: (tool: ToolWithStats) => `${tool.good_for_creators_pct.toFixed(0)}%`,
    },
    {
      label: 'Worth the Money',
      getValue: (tool: ToolWithStats) => `${tool.worth_money_pct.toFixed(0)}%`,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
              Feature
            </th>
            {tools.map((tool) => {
              const logoUrl = tool.logo_url || getLogoUrlFromUrl(tool.url);
              return (
                <th
                  key={tool.id}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                >
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0">
                        <img
                          src={logoUrl}
                          alt={`${tool.name} logo`}
                          className="w-full h-full object-contain p-1"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (logoUrl.includes('logo.clearbit.com') && !img.src.includes('google.com')) {
                              try {
                                const domain = new URL(tool.url).hostname.replace('www.', '');
                                const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
                                img.src = fallbackUrl;
                              } catch {
                                img.style.display = 'none';
                                const parent = img.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">${tool.name.charAt(0).toUpperCase()}</div>`;
                                }
                              }
                            } else {
                              img.style.display = 'none';
                              const parent = img.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">${tool.name.charAt(0).toUpperCase()}</div>`;
                              }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm font-bold">
                        {tool.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span>{tool.name}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {fields.map((field, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-3 text-sm font-medium text-gray-700 border-b">
                {field.label}
              </td>
              {tools.map((tool) => (
                <td key={tool.id} className="px-4 py-3 text-sm text-gray-600 border-b">
                  {typeof field.getValue(tool) === 'string'
                    ? field.getValue(tool)
                    : field.getValue(tool)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
