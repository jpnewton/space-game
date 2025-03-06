// Main game module
document.addEventListener('DOMContentLoaded', () => {
  console.log('Game initializing...');
  
  // Get the canvas and context
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) {
    console.error('Canvas element not found!');
    return;
  }
  
  // Check canvas dimensions
  console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`);
  
  // Make sure canvas is properly sized
  function resizeCanvas() {
    // Set canvas to fill the window or container
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context from canvas!');
    return;
  }
  
  // Basic test to see if drawing works
  function testDraw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText('Loading Space Shooter...', canvas.width/2 - 120, canvas.height/2);
    
    // Draw a test ship
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, canvas.height/2 - 30);
    ctx.lineTo(canvas.width/2 - 15, canvas.height/2 + 10);
    ctx.lineTo(canvas.width/2 + 15, canvas.height/2 + 10);
    ctx.closePath();
    ctx.fill();
  }
  
  testDraw();
  console.log('Test drawing completed');
  
  // Initialize the game
  initGame();
});

// Check if assets are loaded
function checkAssets() {
  const playerSprite = document.getElementById('playerSprite');
  const enemySprite = document.getElementById('enemySprite');
  
  if (playerSprite) {
    console.log('Player sprite found:', playerSprite.complete ? 'loaded' : 'loading');
  } else {
    console.warn('Player sprite not found in DOM');
  }
  
  if (enemySprite) {
    console.log('Enemy sprite found:', enemySprite.complete ? 'loaded' : 'loading');
  } else {
    console.warn('Enemy sprite not found in DOM');
  }
}

function initGame() {
  console.log('Initializing game systems');
  checkAssets();
  
  // Connect to Supabase if available
  if (typeof initSupabase === 'function') {
    const supabaseInitialized = initSupabase();
    console.log('Supabase initialization:', supabaseInitialized ? 'successful' : 'using local mode');
  } else {
    console.warn('Supabase module not found');
  }
  
  // Start the game after initialization
  setTimeout(() => {
    console.log('Starting game loop');
    gameLoop();
  }, 1000);
}

function gameLoop() {
  console.log('Game loop started');
  // Your game loop code would go here
}