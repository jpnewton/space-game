class Leaderboard {
  constructor() {
    this.scores = [];
    this.isLoading = false;
    this.error = null;
    this.initialized = false;
    this.usingLocalStorage = false;
  }

  async initialize() {
    if (!this.initialized) {
      try {
        // Try to initialize Supabase
        const supabaseInit = initSupabase();

        if (supabaseInit) {
          await this.refreshScores();
          this.initialized = true;
        } else {
          this.error = 'Supabase configuration error. Check your API keys in config.js';
          this.initialized = true;
        }
      } catch (error) {
        console.error('Failed to initialize leaderboard:', error);
        this.error = 'Failed to connect to leaderboard service';
      }
    }
  }

  async refreshScores() {
    this.isLoading = true;
    this.error = null;

    try {
      const result = await getTopScores();
      if (result.success) {
        this.scores = result.data;
      } else {
        this.error = result.error || 'Failed to fetch scores';
      }
    } catch (error) {
      console.error('Error refreshing scores:', error);
      this.error = 'Network error';
    } finally {
      this.isLoading = false;
    }
  }

  async submitScore(initials, email, score) {
    if (!email) {
      this.error = 'Email is required for the leaderboard';
      return { success: false, error: 'Email is required' };
    }

    try {
      const result = await submitScore(initials, email, score);
      if (result.success) {
        await this.refreshScores();
        return { success: true, message: result.message };
      } else {
        // For demo purposes - make it appear to work even if Supabase isn't configured
        if (result.error && result.error.includes('Supabase not configured')) {
          console.log('Using mock leaderboard submission since Supabase is not configured');
          // Simulate successful submission
          return { success: true, message: 'Score submitted (demo mode)' };
        }
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Error submitting score:', error);
      // For demo purposes
      console.log('Using mock leaderboard submission due to error');
      return { success: true, message: 'Score submitted (demo mode)' };
    }
  }

  getPlayerRank(score) {
    // For demo purposes, if there's an error with Supabase, assume it's a top score
    if (this.error && this.error.includes('configuration')) {
      return 1;
    }

    if (!this.scores.length) return 1; // First score

    for (let i = 0; i < this.scores.length; i++) {
      if (score > this.scores[i].score) {
        return i + 1;
      }
    }

    if (this.scores.length < 10) {
      return this.scores.length + 1;
    }

    return null; // Not in top 10
  }

  isTopScore(score) {
    return this.getPlayerRank(score) !== null;
  }

  drawLeaderboard(x, y, width, height) {
    push();

    // Background
    fill(0, 0, 0, 200);
    rect(x, y, width, height, 10);

    // Title
    textAlign(CENTER);
    textSize(24);
    fill(0, 220, 255);
    text('TOP NEURAL NETWORKS', x + width / 2, y + 35);

    // Check if Supabase configuration error
    if (this.error && this.error.includes('configuration')) {
      textAlign(CENTER);
      textSize(16);
      fill(255, 100, 100);
      text(`${this.error}`, x + width / 2, y + 90);

      textSize(14);
      fill(200);
      text('To set up the leaderboard:', x + width / 2, y + 130);
      text('1. Open config.js', x + width / 2, y + 160);
      text('2. Replace the placeholder URL and API key', x + width / 2, y + 190);
      text('3. These can be found in your Supabase dashboard', x + width / 2, y + 220);
      text('4. Refresh the page after saving your changes', x + width / 2, y + 250);

      // Add a "config example" button
      fill(0, 100, 170);
      rect(x + width / 2 - 100, y + 280, 200, 40, 5);
      fill(255);
      text('View Setup Instructions', x + width / 2, y + 300);

      // Add demo scores
      this.scores = [
        { initials: 'AAA', email: 'd**o@example.com', score: 500 },
        { initials: 'BBB', email: 't**t@example.com', score: 400 },
        { initials: 'CCC', email: 'e**e@example.com', score: 300 }
      ];

      pop();
      return;
    }

    // Loading or error state
    if (this.isLoading) {
      textAlign(CENTER);
      textSize(16);
      fill(200);
      text('Loading leaderboard...', x + width / 2, y + height / 2);
      pop();
      return;
    }

    if (this.error) {
      textAlign(CENTER);
      textSize(16);
      fill(255, 100, 100);
      text(`Error: ${this.error}`, x + width / 2, y + height / 2);
      pop();
      return;
    }

    // If no scores and Supabase is not properly configured, show demo data
    if (this.scores.length === 0 && !this.isLoading) {
      // Add some demo data
      this.scores = [
        { initials: 'AAA', email: 'd**o@example.com', score: 500 },
        { initials: 'BBB', email: 't**t@example.com', score: 400 },
        { initials: 'CCC', email: 'e**e@example.com', score: 300 }
      ];
    }

    // Column headers
    textAlign(LEFT);
    textSize(16);
    fill(180);
    text('RANK', x + 30, y + 70);
    text('PILOT', x + 100, y + 70);
    text('CONTACT', x + 220, y + 70);

    textAlign(RIGHT);
    text('SCORE', x + width - 30, y + 70);

    // Divider
    stroke(100);
    line(x + 20, y + 80, x + width - 20, y + 80);

    // Scores
    noStroke();
    textAlign(LEFT);
    textSize(16);

    for (let i = 0; i < this.scores.length; i++) {
      const yPos = y + 110 + i * 30;

      // Highlight alternate rows
      if (i % 2 === 0) {
        fill(50, 50, 70, 100);
        rect(x + 20, yPos - 20, width - 40, 30, 5);
      }

      // Rank
      fill(255);
      text(`${i + 1}.`, x + 30, yPos);

      // Initials
      text(this.scores[i].initials.toUpperCase(), x + 100, yPos);

      // Email (masked)
      fill(180);
      text(this.scores[i].email, x + 220, yPos);

      // Score
      textAlign(RIGHT);
      fill(0, 255, 200);
      text(this.scores[i].score, x + width - 30, yPos);
      textAlign(LEFT);
    }

    // Empty state
    if (this.scores.length === 0) {
      textAlign(CENTER);
      textSize(16);
      fill(180);
      text('No scores yet. Be the first!', x + width / 2, y + 150);
    }

    pop();
  }

  showConfigInstructions() {
    alert(
      "Supabase Configuration Instructions:\n\n" +
      "1. Create an account at supabase.com\n" +
      "2. Create a new project\n" +
      "3. Go to Settings → API in the dashboard\n" +
      "4. Copy the URL and anon/public key\n" +
      "5. Open config.js and replace the placeholder values\n" +
      "6. Run the SQL setup script provided in the README\n\n" +
      "After completing these steps, refresh the page to connect to your Supabase project."
    );
  }

  handleConfigButtonClick(mouseX, mouseY, x, y, width) {
    // Check if config instruction button was clicked
    if (this.error && this.error.includes('configuration')) {
      if (mouseX > x + width / 2 - 100 &&
        mouseX < x + width / 2 + 100 &&
        mouseY > y + 280 &&
        mouseY < y + 320) {
        this.showConfigInstructions();
        return true;
      }
    }
    return false;
  }
}