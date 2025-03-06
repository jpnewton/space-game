// Game state constants
const GAME_STATE = {
  START: 'start',
  PLAYING: 'playing',
  GAME_OVER: 'gameover'
};

// Game variables
let player;
let enemies = [];
let projectiles = [];
let particles = [];
let powerups = [];
let starfield;
let gameUI;
let enemyTimer = 0;
let enemySpawnRate = 60; // Frames between enemy spawns
let score = 0;
let level = 1;
let lives = 3;
let gameState = GAME_STATE.START;
let gameOverTime = 0;
let enemyTypes = ['basic', 'fast', 'tank'];
let backgroundStars;
let bossTimer = 0;
let bossSpawnRate = 1200; // Frames until boss spawns
let bossActive = false;
let highScore = 0;
let lastScorePosted = false;
let gameTitle = "AI SPACE DEFENDER";

function setup() {
  createCanvas(800, 600);
  player = new Player();
  starfield = new Starfield(200);
  gameUI = new GameUI();
  
  // Try to load high score from localStorage
  if (localStorage.getItem('aiSpaceDefenderHighScore')) {
    highScore = parseInt(localStorage.getItem('aiSpaceDefenderHighScore'));
  }
  
  reset();
}

function draw() {
  background(0);
  
  // Draw starfield
  starfield.update();
  starfield.display();
  
  switch (gameState) {
    case GAME_STATE.START:
      gameUI.drawStartScreen();
      break;
    
    case GAME_STATE.PLAYING:
      updateGame();
      break;
    
    case GAME_STATE.GAME_OVER:
      updateGame();
      gameUI.drawGameOverScreen(score, highScore);
      
      // Save high score if it's beaten
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('aiSpaceDefenderHighScore', highScore);
        
        // Automatically show score form for high scores
        if (!gameUI.showScoreForm && !gameUI.formData.submitted && 
            gameUI.leaderboard.isTopScore(score) && 
            millis() - gameOverTime > 1000) {
          gameUI.showScoreForm = true;
        }
      } else if (!gameUI.showScoreForm && !gameUI.formData.submitted && 
                 gameUI.leaderboard.isTopScore(score) && 
                 millis() - gameOverTime > 1000) {
        // Show form for top scores even if not a personal high score
        gameUI.showScoreForm = true;
      }
      
      // Show social share button
      if (!lastScorePosted && !gameUI.showScoreForm && !gameUI.formData.submitted) {
        gameUI.drawShareButton(score);
      }
      
      if (millis() - gameOverTime > 2000 && keyIsPressed && !gameUI.showScoreForm) {
        reset();
        gameState = GAME_STATE.START;
        lastScorePosted = false;
      }
      break;
  }
}

function updateGame() {
  // Update and display entities
  player.update();
  player.display();
  
  // Spawn enemies
  enemyTimer++;
  if (enemyTimer >= Math.max(10, enemySpawnRate - level * 5)) {
    if (!bossActive) {
      spawnEnemy();
    }
    enemyTimer = 0;
  }
  
  // Boss spawn logic
  if (!bossActive) {
    bossTimer++;
    if (bossTimer >= bossSpawnRate) {
      spawnBoss();
      bossTimer = 0;
    }
  }
  
  // Update and display projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    projectiles[i].update();
    projectiles[i].display();
    
    // Remove projectiles that are off-screen
    if (projectiles[i].isOffScreen()) {
      projectiles.splice(i, 1);
    }
  }
  
  // Update and display enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].display();
    
    // Check for collision with player
    if (enemies[i].hits(player) && gameState === GAME_STATE.PLAYING) {
      createExplosion(enemies[i].pos.x, enemies[i].pos.y, enemies[i].size);
      
      if (enemies[i].type === 'boss') {
        bossActive = false;
        // Boss collision causes more damage
        lives -= 2;
      } else {
        enemies.splice(i, 1);
        lives--;
      }
      
      if (lives <= 0) {
        gameOver();
      }
      continue;
    }
    
    // Enemy shooting
    if (enemies[i].type === 'boss' && random() < 0.1) {
      enemies[i].shoot(projectiles);
    } else if (enemies[i].type !== 'fast' && random() < 0.005) {
      enemies[i].shoot(projectiles);
    }
    
    // Check for collision with player projectiles
    let enemyDestroyed = false;
    for (let j = projectiles.length - 1; j >= 0; j--) {
      if (projectiles[j].fromPlayer && enemies[i] && enemies[i].hits(projectiles[j])) {
        enemies[i].health -= projectiles[j].damage;
        projectiles.splice(j, 1);
        
        if (enemies[i].health <= 0) {
          // Add score based on enemy type
          let points = enemies[i].type === 'basic' ? 10 : 
                      enemies[i].type === 'fast' ? 15 : 
                      enemies[i].type === 'tank' ? 25 :
                      enemies[i].type === 'boss' ? 100 : 10;
          score += points;
          
          // Create explosion
          createExplosion(enemies[i].pos.x, enemies[i].pos.y, enemies[i].size);
          
          // Bosses drop multiple powerups
          if (enemies[i].type === 'boss') {
            for (let k = 0; k < 3; k++) {
              powerups.push(new Powerup(
                enemies[i].pos.x + random(-50, 50), 
                enemies[i].pos.y + random(-50, 50)
              ));
            }
            bossActive = false;
          } else if (random() < 0.2) {
            // Regular enemies have chance to spawn powerup
            powerups.push(new Powerup(enemies[i].pos.x, enemies[i].pos.y));
          }
          
          enemies.splice(i, 1);
          enemyDestroyed = true;
          break;
        }
      }
    }
    
    if (enemyDestroyed) continue;
    
    // Remove enemies that are off-screen
    if (enemies[i].isOffScreen()) {
      if (enemies[i].type === 'boss') {
        bossActive = false;
      }
      enemies.splice(i, 1);
    }
  }
  
  // Update and display particles
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
  
  // Update and display powerups
  for (let i = powerups.length - 1; i >= 0; i--) {
    powerups[i].update();
    powerups[i].display();
    
    // Check for collision with player
    if (powerups[i].hits(player)) {
      player.applyPowerup(powerups[i].type);
      powerups.splice(i, 1);
    }
    
    // Remove powerups that are off-screen
    if (powerups[i] && powerups[i].isOffScreen()) {
      powerups.splice(i, 1);
    }
  }
  
  // Level up check
  if (score >= level * 100) {
    level++;
    enemySpawnRate = Math.max(20, enemySpawnRate - 5);
  }
  
  // Draw UI
  gameUI.drawHUD(score, lives, level, highScore);
}

function spawnEnemy() {
  let type;
  // Higher chance for more powerful enemies at higher levels
  let r = random();
  if (r < 0.6 - (level * 0.05)) {
    type = 'basic';
  } else if (r < 0.9 - (level * 0.02)) {
    type = 'fast';
  } else {
    type = 'tank';
  }
  
  let x = random(width);
  let y = -20;
  enemies.push(new Enemy(x, y, type));
}

function spawnBoss() {
  if (!bossActive) {
    let x = width / 2;
    let y = -50;
    let boss = new Enemy(x, y, 'boss');
    boss.size = 80; // Larger size for boss
    boss.health = 20; // More health for boss
    boss.speed = 0.5; // Slower speed
    enemies.push(boss);
    bossActive = true;
    
    // Create warning effect
    gameUI.showBossWarning();
  }
}

function createExplosion(x, y, size) {
  for (let i = 0; i < size * 2; i++) {
    particles.push(new Particle(x, y));
  }
}

function gameOver() {
  gameState = GAME_STATE.GAME_OVER;
  gameOverTime = millis();
}

function reset() {
  player = new Player();
  enemies = [];
  projectiles = [];
  particles = [];
  powerups = [];
  enemyTimer = 0;
  bossTimer = 0;
  bossActive = false;
  score = 0;
  level = 1;
  lives = 3;
  enemySpawnRate = 60;
  lastScorePosted = false;
  gameUI.resetForm();
}

function keyPressed() {
  if (gameState === GAME_STATE.START && keyCode === ENTER) {
    gameState = GAME_STATE.PLAYING;
  }
  
  if (gameState === GAME_STATE.PLAYING) {
    if (keyCode === 32) { // Space
      player.shoot(projectiles);
    }
  }
}

function mousePressed() {
  // First check if UI handled the click
  if (gameUI.handleMousePressed()) {
    return;
  }
  
  // Then check other interactive elements
  if (gameState === GAME_STATE.GAME_OVER && !lastScorePosted && !gameUI.showScoreForm) {
    let buttonX = width / 2;
    let buttonY = height / 2 + 130;
    let buttonWidth = 200;
    let buttonHeight = 40;
    
    if (mouseX > buttonX - buttonWidth/2 && mouseX < buttonX + buttonWidth/2 &&
        mouseY > buttonY - buttonHeight/2 && mouseY < buttonY + buttonHeight/2) {
      // Share score to X.com
      let tweetText = `I just scored ${score} points in ${gameTitle}! An AI-powered space shooter. Can you beat my score? #AISpaceDefender #AIGaming`;
      let shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(shareURL, '_blank');
      lastScorePosted = true;
    }
  }
}