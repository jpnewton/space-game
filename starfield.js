class Starfield {
  constructor(numStars) {
    this.stars = [];
    for (let i = 0; i < numStars; i++) {
      this.stars.push({
        x: random(width),
        y: random(height),
        size: random(0.5, 3),
        speed: random(0.5, 3),
        brightness: random(100, 255),
        twinkleRate: random(0.02, 0.05)
      });
    }
  }
  
  update() {
    for (let star of this.stars) {
      star.y += star.speed;
      
      // Reset star position when it goes off screen
      if (star.y > height) {
        star.y = 0;
        star.x = random(width);
      }
      
      // Twinkle effect
      star.brightness = 150 + 105 * sin(frameCount * star.twinkleRate);
    }
  }
  
  display() {
    noStroke();
    for (let star of this.stars) {
      fill(star.brightness);
      ellipse(star.x, star.y, star.size);
    }
  }
}