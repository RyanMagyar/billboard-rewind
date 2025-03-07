CREATE TABLE charts (
  id SERIAL PRIMARY KEY,
  chart_type TEXT NOT NULL,
  chart_date DATE NOT NULL,
  songs JSONB NOT NULL,
  spotify_data_filled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(chart_type, chart_date)
);

CREATE TABLE songs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  spotify_uri TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(title, artist)
);
