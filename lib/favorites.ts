import { ToolWithStats } from './types';

const FAVORITES_KEY = 'aitf_favorites';

export function getFavorites(): ToolWithStats[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addToFavorites(tool: ToolWithStats): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    // Check if already in favorites
    if (!favorites.find(f => f.id === tool.id)) {
      favorites.push(tool);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
}

export function removeFromFavorites(toolId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(f => f.id !== toolId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
}

export function isFavorite(toolId: string): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const favorites = getFavorites();
    return favorites.some(f => f.id === toolId);
  } catch {
    return false;
  }
}

export function toggleFavorite(tool: ToolWithStats): void {
  if (isFavorite(tool.id)) {
    removeFromFavorites(tool.id);
  } else {
    addToFavorites(tool);
  }
}
