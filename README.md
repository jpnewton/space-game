# AI Space Defender

A space shooter game with custom-built sprites, AI-themed enemies, and a global leaderboard system powered by Supabase.

![AI Space Defender Screenshot](https://placehold.co/800x600/0a0a20/00ffdd?text=AI+Space+Defender)

## Features

- Fully custom-built sprites and visual effects
- Multiple enemy types with different behaviors
- Epic boss battles
- Powerup system
- Global leaderboard with privacy protection
- Social sharing capabilities
- Mobile-responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- A free Supabase account (https://supabase.com)

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/ai-space-defender.git
   cd ai-space-defender
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up Supabase:
   - Create a new project at https://supabase.com
   - Get your project URL and anon/public key from your project settings
   - Update the `config.js` file with your Supabase URL and key:
   ```js
   const SUPABASE_URL = 'https://your-supabase-url.supabase.co';
   const SUPABASE_KEY = 'your-supabase-anon-key';
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Setting Up Supabase (Step-by-Step)

### 1. Create a Supabase Account

Visit [supabase.com](https://supabase.com/) and sign up for a free account.

### 2. Create a New Project

1. Click on "New Project"
2. Enter a name for your project (e.g., "AI Space Defender")
3. Create a strong database password (save this in a secure location)
4. Choose a region closest to your expected players
5. Click "Create new project"

### 3. Get Your API Credentials

1. Once your project is created, go to the project dashboard
2. Click on the "Settings" icon (gear) in the left sidebar
3. Select "API" from the submenu
4. Under "Project API keys", you'll find:
   - URL: Your project URL
   - anon/public: Your public API key
5. Copy these values and update your `config.js` file

### 4. Create the Leaderboard Table

1. In your Supabase dashboard, go to the "SQL Editor" section
2. Click "New query"
3. Paste the following SQL:

```sql
-- Create the leaderboard table
CREATE TABLE leaderboard (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  initials VARCHAR(3) NOT NULL,
  email VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create an index on the score for faster leaderboard retrieval
CREATE INDEX idx_leaderboard_score ON leaderboard (score DESC);

-- Create an index on email for checking existing records
CREATE INDEX idx_leaderboard_email ON leaderboard (email);

-- Create a Row Level Security policy to allow anonymous read access
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the leaderboard
CREATE POLICY "Allow anonymous read access" 
  ON leaderboard FOR SELECT USING (true);

-- Allow insert for authenticated users (or modify for your auth strategy)
CREATE POLICY "Allow insert for anonymous users" 
  ON leaderboard FOR INSERT WITH CHECK (true);
  
-- Allow updates but only for matching emails
CREATE POLICY "Allow updates for matching emails" 
  ON leaderboard FOR UPDATE USING (true);

-- Create a function to automatically set updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function on each update
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON leaderboard
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
```

4. Click "Run" to execute the query

### 5. Verify Your Setup

1. Go to "Table Editor" in the left sidebar
2. You should see your "leaderboard" table listed
3. Try playing the game and submitting a score
4. Check your table to ensure the score was recorded

## How to Play

- Use ARROW KEYS or WASD to move your ship
- SPACE to shoot
- Collect powerups to upgrade your weapons, gain shields, or increase speed
- Destroy enemy ships to gain points
- Survive as long as possible and get on the leaderboard!

## Game Mechanics

### Enemy Types

- **Basic Drone**: Standard enemy with balanced attributes
- **Fast Scout**: Quick but fragile
- **Tank Enforcer**: Slow but tough with heavy firepower
- **AI Mothership**: Boss enemy with massive health and special attacks

### Powerups

- **Weapon Upgrade**: Enhances your ship's firepower
- **Shield**: Provides temporary protection
- **Speed Boost**: Increases movement and firing rate

## Customization

### Changing Game Difficulty

Edit the `sketch.js` file to adjust:

- Enemy spawn rates
- Boss appearance frequency
- Powerup drop chances

### Customizing Visuals

Edit the corresponding class files to change:

- Ship designs in `player.js` and `enemy.js`
- Visual effects in `particle.js`
- Game UI in `gameUI.js`

## Troubleshooting

### Leaderboard Not Working

1. Check that your `config.js` file has the correct Supabase URL and API key
2. Make sure you've run the SQL script to create the leaderboard table
3. Check the browser console for any errors
4. Verify your internet connection

### API Errors

If you see errors related to the Supabase API:

1. Verify your project is active in the Supabase dashboard
2. Ensure your Row Level Security (RLS) policies are set up correctly
3. Check your browser console for specific error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with p5.js (https://p5js.org)
- Database powered by Supabase (https://supabase.com)