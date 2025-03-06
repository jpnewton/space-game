class Player {
  constructor() {
    this.pos = createVector(width / 2, height - 100);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.size = 30;
    this.speed = 5;
    this.color = color(0, 255, 220);
    this.fireRate = 10;
    this.lastShot = 0;
    this.weaponLevel = 1;
    this.powerupTime = 0;
    this.shieldActive = false;
    this.shieldTime = 0;
    this.thrusterParticles = [];
    // Visual flair - pulsing effects
    this.pulseAmount = 0;
    this.pulseDir = 1;
  }
  
  update() {
    // Handle movement
    this.acc.set(0, 0);
    
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A key
      this.acc.x = -this.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D key
      this.acc.x = this.speed;
    }
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W key
      this.acc.y = -this.speed;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S key
      this.acc.y = this.speed;
    }
    
    // Apply acceleration, update velocity and position
    this.vel.add(this.acc);
    this.vel.mult(0.9); // Friction
    this.pos.add(this.vel);
    
    // Constrain position to screen
    this.pos.x = constrain(this.pos.x, this.size / 2, width - this.size / 2);
    this.pos.y = constrain(this.pos.y, this.size / 2, height - this.size / 2);
    
    // Auto-fire if space is held down
    if (keyIsDown(32) && millis() - this.lastShot > 1000 / this.fireRate) {
      this.shoot(projectiles);
    }
    
    // Create thruster particles
    if (frameCount % 2 === 0) {
      this.thrusterParticles.push({
        pos: createVector(this.pos.x, this.pos.y + this.size / 2),
        vel: createVector(random(-0.5, 0.5), random(1, 3)),
        size: random(3, 8),
        life: 20,
        color: color(255, random(100, 200), 0, 200)
      });
    }
    
    // Update thruster particles
    for (let i = this.thrusterParticles.length - 1; i >= 0; i--) {
      let p = this.thrusterParticles[i];
      p.pos.add(p.vel);
      p.size *= 0.95;
      p.life--;
      
      if (p.life <= 0) {
        this.thrusterParticles.splice(i, 1);
      }
    }
    
    // Check powerup timers
    if (millis() - this.powerupTime > 5000 && this.weaponLevel > 1) {
      this.weaponLevel = 1;
    }
    
    if (millis() - this.shieldTime > 5000 && this.shieldActive) {
      this.shieldActive = false;
    }
    
    // Visual flair - pulsing effects
    this.pulseAmount += 0.05 * this.pulseDir;
    if (this.pulseAmount > 1 || this.pulseAmount < 0) {
      this.pulseDir *= -1;
    }
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    
    // Draw thruster particles
    for (let p of this.thrusterParticles) {
      fill(p.color);
      noStroke();
      ellipse(p.pos.x - this.pos.x, p.pos.y - this.pos.y, p.size);
    }
    
    // Draw shield if active
    if (this.shieldActive) {
      noFill();
      stroke(0, 100, 255, 128 + 64 * sin(frameCount * 0.1));
      strokeWeight(3);
      ellipse(0, 0, this.size * 2.5);
      
      // Add energy field effect
      stroke(0, 100, 255, 80);
      strokeWeight(1);
      
      push();
      rotate(frameCount * 0.02);
      for (let i = 0; i < 8; i++) {
        let angle = TWO_PI / 8 * i;
        line(0, 0, cos(angle) * this.size * 1.25, sin(angle) * this.size * 1.25);
      }
      pop();
    }
    
    // Sleek, futuristic AI defender ship design
    
    // Glowing engine effect behind ship
    noStroke();
    fill(0, 255, 220, 50 + 20 * this.pulseAmount);
    ellipse(0, this.size/2, this.size/1.5, this.size);
    
    // Main ship body - sleek design
    fill(20, 30, 40);
    beginShape();
    vertex(0, -this.size/1.5); // Nose
    vertex(-this.size/3, 0); // Left mid
    vertex(-this.size/2, this.size/2); // Left wing
    vertex(0, this.size/4); // Bottom center
    vertex(this.size/2, this.size/2); // Right wing
    vertex(this.size/3, 0); // Right mid
    endShape(CLOSE);
    
    // Cockpit/visor
    fill(0, 255, 220, 200);
    beginShape();
    vertex(0, -this.size/1.5 + 5); // Just below nose
    vertex(-this.size/6, -this.size/3);
    vertex(this.size/6, -this.size/3);
    endShape(CLOSE);
    
    // Wing details - angular, tech-inspired
    fill(this.color);
    
    // Left wing detail
    beginShape();
    vertex(-this.size/3, 0);
    vertex(-this.size/2, this.size/2);
    vertex(-this.size/4, this.size/5);
    endShape(CLOSE);
    
    // Right wing detail
    beginShape();
    vertex(this.size/3, 0);
    vertex(this.size/2, this.size/2);
    vertex(this.size/4, this.size/5);
    endShape(CLOSE);
    
    // Engine glow
    fill(255, 200, 0, 150 + 100 * sin(frameCount * 0.1));
    rect(-this.size/3, this.size/3, this.size/6, this.size/4, 2);
    rect(this.size/3 - this.size/6, this.size/3, this.size/6, this.size/4, 2);
    
    // Tech details - circuit-like patterns
    stroke(0, 255, 220, 150);
    strokeWeight(1);
    noFill();
    
    // Left side detail
    line(-this.size/4, -this.size/6, -this.size/4, this.size/3);
    line(-this.size/4, this.size/3, -this.size/3, this.size/3);
    
    // Right side detail
    line(this.size/4, -this.size/6, this.size/4, this.size/3);
    line(this.size/4, this.size/3, this.size/3, this.size/3);
    
    // Weapon system indicators
    if (this.weaponLevel > 1) {
      fill(0, 255, 220);
      if (this.weaponLevel >= 2) {
        ellipse(-this.size/3, 0, this.size/8, this.size/8);
        ellipse(this.size/3, 0, this.size/8, this.size/8);
      }
      
      if (this.weaponLevel >= 3) {
        ellipse(-this.size/2, this.size/3, this.size/8, this.size/8);
        ellipse(this.size/2, this.size/3, this.size/8, this.size/8);
      }
    }
    
    pop();
  }
  
  shoot(projectiles) {
    switch (this.weaponLevel) {
      case 1:
        projectiles.push(new Projectile(this.pos.x, this.pos.y - this.size / 2, 0, -10, true));
        break;
      case 2:
        projectiles.push(new Projectile(this.pos.x - 10, this.pos.y - this.size / 3, 0, -10, true));
        projectiles.push(new Projectile(this.pos.x + 10, this.pos.y - this.size / 3, 0, -10, true));
        break;
      case 3:
        projectiles.push(new Projectile(this.pos.x, this.pos.y - this.size / 2, 0, -10, true));
        projectiles.push(new Projectile(this.pos.x - 10, this.pos.y - this.size / 3, -1, -10, true));
        projectiles.push(new Projectile(this.pos.x + 10, this.pos.y - this.size / 3, 1, -10, true));
        break;
    }
    this.lastShot = millis();
  }
  
  applyPowerup(type) {
    switch (type) {
      case 'weapon':
        this.weaponLevel = min(3, this.weaponLevel + 1);
        this.powerupTime = millis();
        break;
      case 'shield':
        this.shieldActive = true;
        this.shieldTime = millis();
        break;
      case 'speed':
        this.speed = 8;
        this.fireRate = 15;
        this.powerupTime = millis();
        break;
    }
  }
  
  hits(obj) {
    // Collision detection - simple distance check
    const d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    return d < (this.size / 2 + obj.size / 2);
  }
}