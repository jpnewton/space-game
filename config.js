// Supabase configuration
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_KEY = 'your-anon-key';

// Game configuration
const GAME_CONFIG = {
  // Player settings
  player: {
    maxHealth: 100,
    speed: 5,
    fireRate: 250,  // milliseconds between shots
    defaultWeapon: 'laser'
  },
  
  // Enemy settings
  enemies: {
    spawnRate: 1500,  // milliseconds between enemy spawns
    maxOnScreen: 10,
    types: {
      basic: { health: 20, speed: 2, points: 10 },
      fast: { health: 10, speed: 4, points: 15 },
      tank: { health: 50, speed: 1, points: 25 }
    }
  },
  
  // Powerup settings
  powerups: {
    dropChance: 0.1,  // 10% chance per enemy killed
    duration: 10000,  // 10 seconds for temporary powerups
  },
  
  // UI settings
  ui: {
    fontSize: 16,
    headerFontSize: 24,
    fontColor: '#0cf',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  
  // Debug mode (set to false for production)
  debug: false
};

console.log("Config.js loaded");