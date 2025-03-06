class Projectile {
  constructor(x, y, vx = 0, vy = -10, fromPlayer = true, damage = 1) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.size = 6;
    this.fromPlayer = fromPlayer;
    this.color = fromPlayer ? color(0, 255, 200) : color(255, 100, 0);
    this.damage = damage;
    this.life = 60; // Max lifespan to prevent lingering projectiles
  }

  update() {
    this.pos.add(this.vel);
    this.life--;

    if (this.fromPlayer) {
      // Create particle trail for player projectiles
      if (frameCount % 2 === 0) {
        particles.push(new Particle(
          this.pos.x,
          this.pos.y,
          random(-0.5, 0.5),
          random(-0.5, 0.5),
          random(2, 4),
          color(0, 255, 200, 100),
          10
        ));
      }
    } else {
      // Create particle trail for enemy projectiles
      if (frameCount % 2 === 0) {
        particles.push(new Particle(
          this.pos.x,
          this.pos.y,
          random(-0.5, 0.5),
          random(-0.5, 0.5),
          random(2, 4),
          color(255, 100, 0, 100),
          10
        ));
      }
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);

    noStroke();
    fill(this.color);

    if (this.fromPlayer) {
      // Player projectile - longer, laser-like
      rect(-this.size / 4, -this.size, this.size / 2, this.size * 2, 2);

      // Glow effect
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 100);
      ellipse(0, 0, this.size * 1.5);
    } else {
      // Enemy projectile - round with energy field effect
      ellipse(0, 0, this.size);

      // Glow effect
      fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 100);
      ellipse(0, 0, this.size * 1.5);

      // Add rotating lines for energy field look
      stroke(this.color);
      strokeWeight(1);
      push();
      rotate(frameCount * 0.1);
      line(-this.size, 0, this.size, 0);
      line(0, -this.size, 0, this.size);
      pop();
    }

    pop();
  }

  isOffScreen() {
    return (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height ||
      this.life <= 0
    );
  }
}