class Powerup {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 1);
    this.size = 15;
    this.type = random(['weapon', 'shield', 'speed']);
    this.rotation = 0;
    this.rotationSpeed = random(-0.05, 0.05);
    this.pulseAmount = 0;
    this.pulseDir = 1;
  }
  
  update() {
    this.pos.add(this.vel);
    this.rotation += this.rotationSpeed;
    
    // Pulsing effect
    this.pulseAmount += 0.05 * this.pulseDir;
    if (this.pulseAmount > 1 || this.pulseAmount < 0) {
      this.pulseDir *= -1;
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    // Draw glow
    noStroke();
    switch (this.type) {
      case 'weapon':
        fill(255, 0, 0, 100 + 50 * this.pulseAmount);
        break;
      case 'shield':
        fill(0, 100, 255, 100 + 50 * this.pulseAmount);
        break;
      case 'speed':
        fill(255, 255, 0, 100 + 50 * this.pulseAmount);
        break;
    }
    ellipse(0, 0, this.size * 2);
    
    // Draw powerup
    switch (this.type) {
      case 'weapon':
        this.drawWeaponPowerup();
        break;
      case 'shield':
        this.drawShieldPowerup();
        break;
      case 'speed':
        this.drawSpeedPowerup();
        break;
    }
    
    pop();
  }
  
  drawWeaponPowerup() {
    fill(255, 0, 0);
    rect(-this.size/2, -this.size/2, this.size, this.size, 3);
    
    fill(255);
    rect(-this.size/4, -this.size/3, this.size/2, this.size/6, 1);
    rect(-this.size/4, 0, this.size/2, this.size/6, 1);
    rect(-this.size/4, this.size/3 - this.size/6, this.size/2, this.size/6, 1);
  }
  
  drawShieldPowerup() {
    fill(0, 100, 255);
    ellipse(0, 0, this.size, this.size);
    
    noFill();
    stroke(255);
    strokeWeight(2);
    arc(0, 0, this.size * 0.8, this.size * 0.8, PI + PI/4, TWO_PI + PI/4);
  }
  
  drawSpeedPowerup() {
    fill(255, 255, 0);
    triangle(
      0, -this.size/2,
      -this.size/2, this.size/2,
      this.size/2, this.size/2
    );
    
    fill(255);
    triangle(
      0, -this.size/4,
      -this.size/4, this.size/4,
      this.size/4, this.size/4
    );
  }
  
  hits(obj) {
    const d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    return d < (this.size + obj.size / 2);
  }
  
  isOffScreen() {
    return (
      this.pos.x < 0 ||
      this.pos.x > width ||
      this.pos.y < 0 ||
      this.pos.y > height
    );
  }
}