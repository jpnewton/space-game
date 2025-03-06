class Particle {
  constructor(x, y, vx = random(-2, 2), vy = random(-2, 2), size = random(3, 8), particleColor = null, life = random(20, 40)) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.size = size;
    this.originalSize = size;
    this.color = particleColor || this.getRandomColor();
    this.life = life;
    this.originalLife = life;
  }

  getRandomColor() {
    let colors = [
      color(255, 0, 0, 200),    // Red
      color(255, 165, 0, 200),  // Orange
      color(255, 255, 0, 200),  // Yellow
      color(255, 255, 255, 200) // White
    ];
    return random(colors);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Slowly reduce size
    this.size = map(this.life, 0, this.originalLife, 0, this.originalSize);

    // Reduce life
    this.life--;
  }

  display() {
    if (this.life <= 0) return;

    push();
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.size);
    pop();
  }

  isDead() {
    return this.life <= 0;
  }
}