-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  url VARCHAR(500) NOT NULL,
  logo_url VARCHAR(500),
  categories TEXT[] NOT NULL DEFAULT '{}',
  pricing_type VARCHAR(50) NOT NULL CHECK (pricing_type IN ('Free', 'Freemium', 'Paid', 'Trial')),
  starting_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  good_for_creators BOOLEAN DEFAULT FALSE,
  works_in_hebrew BOOLEAN DEFAULT FALSE,
  worth_money BOOLEAN DEFAULT FALSE,
  easy_to_use BOOLEAN DEFAULT FALSE,
  accurate BOOLEAN DEFAULT FALSE,
  reliable BOOLEAN DEFAULT FALSE,
  beginner_friendly BOOLEAN DEFAULT FALSE,
  comment VARCHAR(200),
  anon_fingerprint_hash VARCHAR(64) NOT NULL,
  ip_hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_categories ON tools USING GIN(categories);
CREATE INDEX idx_ratings_tool_id ON ratings(tool_id);
CREATE INDEX idx_ratings_fingerprint ON ratings(anon_fingerprint_hash, tool_id, created_at);
CREATE INDEX idx_ratings_created_at ON ratings(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_tools_updated_at BEFORE UPDATE ON tools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for tool statistics
CREATE OR REPLACE VIEW tool_stats AS
SELECT 
  t.id,
  t.slug,
  COUNT(r.id) as total_ratings,
  COALESCE(AVG(r.stars), 0) as avg_rating,
  COALESCE(COUNT(r.id) FILTER (WHERE r.good_for_creators = true)::DECIMAL / NULLIF(COUNT(r.id), 0) * 100, 0) as good_for_creators_pct,
  COALESCE(COUNT(r.id) FILTER (WHERE r.works_in_hebrew = true)::DECIMAL / NULLIF(COUNT(r.id), 0) * 100, 0) as works_in_hebrew_pct,
  COALESCE(COUNT(r.id) FILTER (WHERE r.worth_money = true)::DECIMAL / NULLIF(COUNT(r.id), 0) * 100, 0) as worth_money_pct
FROM tools t
LEFT JOIN ratings r ON t.id = r.tool_id
GROUP BY t.id, t.slug;
