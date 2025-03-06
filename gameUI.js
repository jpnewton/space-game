class GameUI {
  constructor() {
    this.titleFont = 'Arial';
    this.regularFont = 'Arial';
    this.bossWarningTime = 0;
    this.bossWarningDuration = 180; // 3 seconds at 60fps
    this.leaderboardActive = false;
    this.showScoreForm = false;
    this.formData = {
      initials: '',
      email: '',
      submitted: false,
      submitting: false,
      error: null,
      message: null
    };
    this.leaderboard = new Leaderboard();
    this.initializeLeaderboard();
  }

  async initializeLeaderboard() {
    await this.leaderboard.initialize();
  }

  drawStartScreen() {
    push();

    // Title background
    fill(0, 0, 0, 180);
    rect(width / 2 - 300, height / 3 - 50, 600, 100, 10);

    // Title
    textAlign(CENTER, CENTER);
    textSize(50);
    fill(0, 220, 255);
    stroke(0);
    strokeWeight(4);
    text(gameTitle, width / 2, height / 3);

    // Subtitle
    textSize(18);
    fill(200, 200, 200);
    noStroke();
    text('Neural networks trained for destruction', width / 2, height / 3 + 40);

    // Instructions panel
    fill(0, 0, 0, 180);
    rect(width / 2 - 250, height / 2 - 20, 500, 140, 10);

    // Instructions
    noStroke();
    textSize(20);
    fill(255);
    text('Use ARROW KEYS or WASD to move', width / 2, height / 2);
    text('SPACE to shoot', width / 2, height / 2 + 30);
    text('Collect powerups to upgrade your defenses', width / 2, height / 2 + 60);

    // Animated start prompt
    textSize(25);
    let promptY = height / 2 + 120 + sin(frameCount * 0.05) * 5;
    fill(0, 0, 0, 180);
    rect(width / 2 - 150, promptY - 15, 300, 40, 10);

    if (frameCount % 60 < 50) {
      fill(0, 255, 200);
      text('Press ENTER to start', width / 2, promptY);
    }

    // Leaderboard button
    let buttonY = height / 2 + 180;
    let buttonWidth = 200;
    let buttonHeight = 40;

    fill(this.leaderboardActive ? 0 : 0, this.leaderboardActive ? 150 : 100, this.leaderboardActive ? 255 : 200);
    rect(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);

    fill(255);
    textSize(18);
    text(this.leaderboardActive ? 'HIDE LEADERBOARD' : 'VIEW LEADERBOARD', width / 2, buttonY);

    // Draw leaderboard if active
    if (this.leaderboardActive) {
      this.leaderboard.drawLeaderboard(width / 2 - 350, height / 2 + 230, 700, 350);
    }

    // AI theme elements
    this.drawAIElements();

    pop();
  }

  drawHUD(score, lives, level, highScore) {
    push();

    // Semi-transparent HUD background
    fill(0, 0, 0, 150);
    rect(0, 0, width, 50);

    // Score
    textAlign(LEFT);
    textSize(20);
    fill(255);
    text(`SCORE: ${score}`, 20, 30);

    // High Score
    textAlign(LEFT);
    textSize(14);
    fill(180);
    text(`HI-SCORE: ${highScore}`, 20, 48);

    // Level with AI-themed name
    textAlign(CENTER);
    textSize(20);
    fill(0, 220, 255);
    text(`NEURAL LAYER ${level}`, width / 2, 30);

    // Lives
    textAlign(RIGHT);
    textSize(20);
    fill(255);
    text(`LIVES: ${lives}`, width - 20, 30);

    // Boss warning
    if (millis() - this.bossWarningTime < this.bossWarningDuration * 16.67) { // Convert frames to ms
      this.drawBossWarningIndicator();
    }

    pop();
  }

  drawGameOverScreen(score, highScore) {
    push();

    // Semi-transparent overlay
    fill(0, 0, 0, 180);
    rect(0, 0, width, height);

    // Game Over panel
    fill(0, 0, 0, 200);
    rect(width / 2 - 250, height / 3 - 50, 500, 300, 15);

    // Game Over text
    textAlign(CENTER, CENTER);
    textSize(60);
    fill(255, 50, 50);
    stroke(100, 0, 0);
    strokeWeight(3);
    text('NEURAL SHUTDOWN', width / 2, height / 3);

    // Score
    noStroke();
    textSize(30);
    fill(255);
    text(`FINAL SCORE: ${score}`, width / 2, height / 2 - 20);

    // High Score
    let newHighScore = score > highScore;
    if (newHighScore) {
      textSize(25);
      fill(255, 255, 0);
      text('NEW HIGH SCORE!', width / 2, height / 2 + 20);
    } else {
      textSize(20);
      fill(180);
      text(`High Score: ${highScore}`, width / 2, height / 2 + 20);
    }

    // Check if score is in top 10
    let isTopScore = this.leaderboard.isTopScore(score);

    // Score form or restart prompt
    if (!this.showScoreForm && isTopScore) {
      // Show prompt to submit score
      textSize(20);
      fill(0, 255, 200);
      text('You made the leaderboard!', width / 2, height / 2 + 60);

      // Submit score button
      let buttonY = height / 2 + 100;
      let buttonWidth = 200;
      let buttonHeight = 40;

      fill(0, 100, 200);
      rect(width / 2 - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);

      fill(255);
      textSize(18);
      text('SUBMIT SCORE', width / 2, buttonY);
    } else if (this.showScoreForm && !this.formData.submitted) {
      this.drawScoreForm(width / 2 - 200, height / 2 + 50, 400, 200);
    } else if (this.formData.submitted) {
      // Show submission result
      textSize(20);
      if (this.formData.error) {
        fill(255, 100, 100);
        text(`Error: ${this.formData.error}`, width / 2, height / 2 + 60);
      } else {
        fill(0, 255, 200);
        text('Score submitted!', width / 2, height / 2 + 60);
        if (this.formData.message) {
          textSize(16);
          fill(200);
          text(this.formData.message, width / 2, height / 2 + 90);
        }
      }

      // Restart prompt
      textSize(20);
      fill(200);
      if (frameCount % 60 < 50) {
        text('Press any key to restart', width / 2, height / 2 + 130);
      }
    } else {
      // Regular restart prompt
      textSize(20);
      fill(200);
      if (frameCount % 60 < 50) {
        text('Press any key to restart', width / 2, height / 2 + 70);
      }
    }

    pop();
  }

  drawScoreForm(x, y, width, height) {
    push();
    // Form background
    fill(30, 30, 50, 230);
    rect(x, y, width, height, 10);

    // Form title
    textAlign(CENTER);
    textSize(20);
    fill(0, 220, 255);
    text('SUBMIT YOUR SCORE', x + width / 2, y + 30);

    // Initials field
    textAlign(LEFT);
    textSize(16);
    fill(200);
    text('PILOT INITIALS (3 chars):', x + 20, y + 70);

    fill(0);
    rect(x + 230, y + 55, 150, 30, 5);

    fill(0, 255, 200);
    text(this.formData.initials.toUpperCase(), x + 240, y + 75);

    // Add blinking cursor if initials field is empty
    if (this.formData.initials.length === 0 && frameCount % 60 < 30) {
      text('|', x + 245, y + 75);
    }

    // Email field
    fill(200);
    text('EMAIL ADDRESS:', x + 20, y + 110);

    fill(0);
    rect(x + 160, y + 95, 220, 30, 5);

    fill(0, 255, 200);
    text(this.formData.email, x + 170, y + 115);

    // Add blinking cursor if email field is empty
    if (this.formData.email.length === 0 && frameCount % 60 < 30) {
      text('|', x + 175, y + 115);
    }

    // Submit button
    let buttonX = x + width / 2;
    let buttonY = y + 150;
    let buttonWidth = 150;
    let buttonHeight = 35;

    // Button is disabled if fields are empty
    let isFormComplete = this.formData.initials.length > 0 && this.validateEmail(this.formData.email);

    if (this.formData.submitting) {
      fill(100);
    } else if (!isFormComplete) {
      fill(80, 80, 120);
    } else {
      fill(0, 100, 200);
    }
    rect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);

    fill(255);
    textSize(18);
    textAlign(CENTER);
    text(this.formData.submitting ? 'SUBMITTING...' : 'SUBMIT', buttonX, buttonY + 5);

    // Validation message
    if (!isFormComplete) {
      textSize(12);
      fill(255, 150, 150);
      text('Please enter initials and a valid email', buttonX, buttonY + 25);
    }

    // Cancel button
    let cancelBtnX = x + width / 2;
    let cancelBtnY = y + 190;

    fill(100, 100, 100);
    rect(cancelBtnX - 75, cancelBtnY - 15, 150, 30, 5);

    fill(200);
    textSize(16);
    text('CANCEL', cancelBtnX, cancelBtnY + 5);

    pop();
  }

  drawShareButton(score) {
    push();
    // Button background
    let buttonX = width / 2;
    let buttonY = height / 2 + 130;
    let buttonWidth = 200;
    let buttonHeight = 40;

    // Check if mouse is over button
    let isHovered = (
      mouseX > buttonX - buttonWidth / 2 &&
      mouseX < buttonX + buttonWidth / 2 &&
      mouseY > buttonY - buttonHeight / 2 &&
      mouseY < buttonY + buttonHeight / 2
    );

    // Button style
    fill(isHovered ? 30 : 20, isHovered ? 150 : 120, isHovered ? 255 : 230);
    rect(buttonX - buttonWidth / 2, buttonY - buttonHeight / 2, buttonWidth, buttonHeight, 5);

    // Button text
    textAlign(CENTER, CENTER);
    textSize(16);
    fill(255);
    text('Share on X.com', buttonX, buttonY);

    // X icon
    textSize(20);
    text('X', buttonX - 80, buttonY);
    pop();
  }

  showBossWarning() {
    this.bossWarningTime = millis();
  }

  drawBossWarningIndicator() {
    push();
    let elapsedFrames = (millis() - this.bossWarningTime) / 16.67; // Convert ms to frames
    let alpha = map(sin(elapsedFrames * 0.2), -1, 1, 150, 255);

    // Warning text
    textAlign(CENTER);
    textSize(30);
    fill(255, 50, 50, alpha);
    stroke(100, 0, 0, alpha);
    strokeWeight(2);
    text('WARNING: AI MOTHERSHIP DETECTED', width / 2, 80);

    // Warning borders
    noFill();
    stroke(255, 50, 50, alpha * 0.7);
    strokeWeight(3);
    rect(10, 10, width - 20, height - 20);

    pop();
  }

  drawAIElements() {
    push();
    // Draw binary patterns in background
    textSize(12);
    fill(0, 255, 200, 30);
    for (let i = 0; i < 10; i++) {
      let x = random(width);
      let y = random(height);
      let binaryString = '';
      for (let j = 0; j < 8; j++) {
        binaryString += Math.floor(random(2));
      }
      text(binaryString, x, y);
    }

    // Draw neural network nodes and connections
    stroke(0, 180, 255, 50);
    strokeWeight(1);

    let nodes = [];
    // Create node positions
    for (let i = 0; i < 15; i++) {
      nodes.push({
        x: random(width),
        y: random(height),
      });
    }

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (random() < 0.3) {
          let dist = sqrt(pow(nodes[i].x - nodes[j].x, 2) + pow(nodes[i].y - nodes[j].y, 2));
          if (dist < 150) {
            line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
          }
        }
      }
    }

    // Draw nodes
    fill(0, 220, 255, 100);
    noStroke();
    for (let node of nodes) {
      ellipse(node.x, node.y, 5, 5);
    }

    pop();
  }

  handleMousePressed() {
    // Check if in start screen and leaderboard button clicked
    if (gameState === GAME_STATE.START) {
      // Check if config button in leaderboard was clicked
      if (this.leaderboardActive) {
        if (this.leaderboard.handleConfigButtonClick(
          mouseX, mouseY,
          width / 2 - 350, height / 2 + 230, 700
        )) {
          return true;
        }
      }

      // Check if leaderboard toggle button was clicked
      let buttonY = height / 2 + 180;
      let buttonWidth = 200;
      let buttonHeight = 40;

      if (mouseX > width / 2 - buttonWidth / 2 && mouseX < width / 2 + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
        this.leaderboardActive = !this.leaderboardActive;
        return true;
      }
    }

    // Check if game over screen and submit score button clicked
    if (gameState === GAME_STATE.GAME_OVER && !this.showScoreForm && !this.formData.submitted) {
      let isTopScore = this.leaderboard.isTopScore(score);

      if (isTopScore) {
        let buttonY = height / 2 + 100;
        let buttonWidth = 200;
        let buttonHeight = 40;

        if (mouseX > width / 2 - buttonWidth / 2 && mouseX < width / 2 + buttonWidth / 2 &&
          mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
          this.showScoreForm = true;
          return true;
        }
      }
    }

    // Check if form is displayed and submit button clicked
    if (this.showScoreForm && !this.formData.submitted) {
      let formX = width / 2 - 200;
      let formY = height / 2 + 50;
      let formWidth = 400;

      // Handle initials field click
      if (mouseX > formX + 230 && mouseX < formX + 380 &&
        mouseY > formY + 55 && mouseY < formY + 85) {
        let input = prompt('Enter your initials (3 characters max):', this.formData.initials);
        if (input !== null) {
          this.formData.initials = input.substring(0, 3);
        }
        return true;
      }

      // Handle email field click
      if (mouseX > formX + 160 && mouseX < formX + 380 &&
        mouseY > formY + 95 && mouseY < formY + 125) {
        let input = prompt('Enter your email address:', this.formData.email);
        if (input !== null) {
          this.formData.email = input;
        }
        return true;
      }

      // Handle submit button click
      let buttonX = formX + formWidth / 2;
      let buttonY = formY + 150;
      let buttonWidth = 150;
      let buttonHeight = 35;

      if (mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
        // Only submit if form is complete
        if (this.formData.initials && this.validateEmail(this.formData.email)) {
          this.submitScore();
        }
        return true;
      }

      // Handle cancel button click
      let cancelBtnX = formX + formWidth / 2;
      let cancelBtnY = formY + 190;

      if (mouseX > cancelBtnX - 75 && mouseX < cancelBtnX + 75 &&
        mouseY > cancelBtnY - 15 && mouseY < cancelBtnY + 15) {
        this.showScoreForm = false;
        return true;
      }
    }

    // Check if social share button is clicked
    if (gameState === GAME_STATE.GAME_OVER && !lastScorePosted) {
      let buttonX = width / 2;
      let buttonY = height / 2 + 130;
      let buttonWidth = 200;
      let buttonHeight = 40;

      if (mouseX > buttonX - buttonWidth / 2 && mouseX < buttonX + buttonWidth / 2 &&
        mouseY > buttonY - buttonHeight / 2 && mouseY < buttonY + buttonHeight / 2) {
        // Share score to X.com
        let tweetText = `I just scored ${score} points in ${gameTitle}! An AI-powered space shooter. Can you beat my score? #AISpaceDefender #AIGaming`;
        let shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
        window.open(shareURL, '_blank');
        lastScorePosted = true;
        return true;
      }
    }

    return false;
  }

  async submitScore() {
    // Validation
    if (!this.formData.initials) {
      alert('Please enter your initials');
      return;
    }

    if (!this.formData.email || !this.validateEmail(this.formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Submit score
    this.formData.submitting = true;
    this.formData.error = null;
    this.formData.message = null;

    try {
      const result = await this.leaderboard.submitScore(
        this.formData.initials,
        this.formData.email,
        score
      );

      if (result.success) {
        this.formData.submitted = true;
        this.formData.message = result.message;
      } else {
        this.formData.error = result.error;
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      this.formData.error = 'Network error';
    } finally {
      this.formData.submitting = false;
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  resetForm() {
    this.showScoreForm = false;
    this.formData = {
      initials: '',
      email: '',
      submitted: false,
      submitting: false,
      error: null,
      message: null
    };
  }
}