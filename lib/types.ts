export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Trial';

export type Category = 
  | 'Video' 
  | 'Image' 
  | 'Audio' 
  | 'Text' 
  | 'Code' 
  | 'Social/Creators' 
  | 'Productivity'
  | 'Website/App Builder';

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  url: string;
  logo_url?: string | null;
  categories: Category[];
  pricing_type: PricingType;
  starting_price: number | null;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: string;
  tool_id: string;
  stars: number;
  good_for_creators: boolean;
  works_in_hebrew: boolean;
  worth_money: boolean;
  easy_to_use: boolean;
  accurate: boolean;
  reliable: boolean;
  beginner_friendly: boolean;
  comment: string | null;
  created_at: string;
}

export interface ToolWithStats extends Tool {
  total_ratings: number;
  avg_rating: number;
  good_for_creators_pct: number;
  works_in_hebrew_pct: number;
  worth_money_pct: number;
  easy_to_use_pct: number;
  accurate_pct: number;
  reliable_pct: number;
  beginner_friendly_pct: number;
}

export interface RatingInput {
  stars: number;
  good_for_creators: boolean;
  works_in_hebrew: boolean;
  worth_money: boolean;
  easy_to_use: boolean;
  accurate: boolean;
  reliable: boolean;
  beginner_friendly: boolean;
  comment?: string;
}
