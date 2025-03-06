class Enemy {
  constructor(x, y, type = 'basic') {
    this.pos = createVector(x, y);
    this.type = type;
    this.size = this.type === 'tank' ? 40 : this.type === 'basic' ? 30 : 25;
    this.speed = this.type === 'fast' ? 3 : this.type === 'basic' ? 1.5 : 0.8;
    this.health = this.type === 'tank' ? 3 : 1;
    this.color = this.getColor();
    this.direction = createVector(0, 1);
    this.movementTimer = 0;
    this.changeDirectionInterval = random(30, 90);
    this.rotation = 0;
    this.rotationSpeed = random(-0.01, 0.01);
  }
  
  getColor() {
    switch (this.type) {
      case 'basic':
        return color(50, 205, 255); // Neon blue
      case 'fast':
        return color(255, 0, 128); // Hot pink
      case 'tank':
        return color(180, 0, 255); // Deep purple
      case 'boss':
        return color(255, 30, 30); // Strong red
      default:
        return color(50, 205, 255);
    }
  }
  
  update() {
    // Update movement timer
    this.movementTimer++;
    
    // Randomly change direction based on type
    if (this.movementTimer >= this.changeDirectionInterval) {
      if (this.type === 'basic') {
        this.direction = createVector(random(-0.5, 0.5), 1);
      } else if (this.type === 'fast') {
        this.direction = createVector(random(-1, 1), random(0.5, 1));
      } else if (this.type === 'tank') {
        this.direction = createVector(random(-0.2, 0.2), random(0.8, 1));
      } else if (this.type === 'boss') {
        this.direction = createVector(random(-0.3, 0.3), random(0.2, 0.4));
      }
      this.direction.normalize();
      this.movementTimer = 0;
      this.changeDirectionInterval = random(30, 90);
    }
    
    // Apply movement
    this.pos.add(p5.Vector.mult(this.direction, this.speed));
    
    // Keep enemy within screen bounds horizontally
    if (this.pos.x < this.size / 2) {
      this.pos.x = this.size / 2;
      this.direction.x *= -1;
    } else if (this.pos.x > width - this.size / 2) {
      this.pos.x = width - this.size / 2;
      this.direction.x *= -1;
    }
    
    // Ship rotation effect
    this.rotation += this.rotationSpeed;
  }
  
  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    
    // Create engine effect
    if (frameCount % 5 === 0) {
      particles.push(new Particle(
        this.pos.x, 
        this.pos.y + this.size / 2, 
        random(-0.5, 0.5), 
        random(0.5, 1.5),
        random(3, 6),
        color(255, 100, 0, 150),
        15
      ));
    }
    
    noStroke();
    
    // Draw different enemy types
    switch (this.type) {
      case 'basic':
        this.drawBasicEnemy();
        break;
      case 'fast':
        this.drawFastEnemy();
        break;
      case 'tank':
        this.drawTankEnemy();
        break;
      case 'boss':
        this.drawBossEnemy();
        break;
    }
    
    pop();
  }
  
  drawBasicEnemy() {
    // Sleek AI bot inspired design
    
    // Glowing effect behind ship
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 50);
    ellipse(0, 0, this.size * 1.5);
    
    // Main body - hexagonal shape
    fill(20, 20, 30);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i - PI/6;
      let x = cos(angle) * this.size/2;
      let y = sin(angle) * this.size/2;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Upper prongs
    fill(this.color);
    triangle(
      -this.size/2.5, -this.size/3,
      -this.size/4, -this.size/1.8,
      -this.size/6, -this.size/3
    );
    
    triangle(
      this.size/2.5, -this.size/3,
      this.size/4, -this.size/1.8,
      this.size/6, -this.size/3
    );
    
    // Central eye/visor
    fill(255, 255, 255, 200);
    ellipse(0, -this.size/8, this.size/2.5, this.size/5);
    
    // Internal eye
    fill(this.color);
    ellipse(0, -this.size/8, this.size/4, this.size/8);
    
    // Lower section
    fill(this.color);
    arc(0, this.size/4, this.size/1.5, this.size/2, 0, PI, CHORD);
    
    // Tech details
    stroke(255, 255, 255, 150);
    strokeWeight(1);
    noFill();
    line(-this.size/3, this.size/5, this.size/3, this.size/5);
    line(-this.size/4, this.size/3, this.size/4, this.size/3);
  }
  
  drawFastEnemy() {
    // Faster, sleeker drone design
    
    // Glowing effect
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 50);
    ellipse(0, 0, this.size * 1.5);
    
    // Main triangular body
    fill(20, 20, 30);
    triangle(
      0, -this.size/1.5,
      -this.size/1.5, this.size/2,
      this.size/1.5, this.size/2
    );
    
    // Upper tech details
    fill(this.color);
    rect(-this.size/4, -this.size/3, this.size/2, this.size/8, 2);
    
    // Eye array
    for (let i = -1; i <= 1; i++) {
      fill(255, 255, 255, 200);
      ellipse(i * this.size/5, -this.size/6, this.size/8, this.size/8);
      fill(this.color);
      ellipse(i * this.size/5, -this.size/6, this.size/16, this.size/16);
    }
    
    // Wing accents
    fill(this.color);
    triangle(
      -this.size/1.6, this.size/2,
      -this.size/1.2, this.size/2,
      -this.size/1.4, 0
    );
    
    triangle(
      this.size/1.6, this.size/2,
      this.size/1.2, this.size/2,
      this.size/1.4, 0
    );
    
    // Tech lines
    stroke(255, 255, 255, 150);
    strokeWeight(1);
    noFill();
    line(-this.size/4, this.size/4, this.size/4, this.size/4);
  }
  
  drawTankEnemy() {
    // Heavy battle drone
    
    // Glowing effect
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 50);
    ellipse(0, 0, this.size * 1.8);
    
    // Main body - octagonal shape
    fill(20, 20, 30);
    beginShape();
    for (let i = 0; i < 8; i++) {
      let angle = TWO_PI / 8 * i;
      let x = cos(angle) * this.size/1.8;
      let y = sin(angle) * this.size/1.8;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Armored plates
    fill(50, 50, 70);
    rect(-this.size/2, -this.size/4, this.size/4, this.size/2, 2);
    rect(this.size/4, -this.size/4, this.size/4, this.size/2, 2);
    
    // Central core
    fill(this.color);
    ellipse(0, 0, this.size/1.5, this.size/1.5);
    
    // Eye array - 3x3 grid
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          // Center eye is larger
          fill(255, 255, 255, 200);
          ellipse(i * this.size/6, j * this.size/6, this.size/5, this.size/5);
          fill(this.color);
          ellipse(i * this.size/6, j * this.size/6, this.size/10, this.size/10);
        } else {
          fill(255, 255, 255, 200);
          ellipse(i * this.size/6, j * this.size/6, this.size/10, this.size/10);
          fill(this.color);
          ellipse(i * this.size/6, j * this.size/6, this.size/20, this.size/20);
        }
      }
    }
    
    // Weapon pods
    fill(50, 50, 70);
    rect(-this.size/1.6, -this.size/12, this.size/8, this.size/6, 1);
    rect(this.size/1.6 - this.size/8, -this.size/12, this.size/8, this.size/6, 1);
    
    // Tech lines
    stroke(255, 255, 255, 150);
    strokeWeight(1);
    noFill();
    ellipse(0, 0, this.size/2, this.size/2);
  }
  
  drawBossEnemy() {
    // Epic boss ship - AI Mothership
    
    // Glowing aura
    fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], 30 + 20 * sin(frameCount * 0.05));
    ellipse(0, 0, this.size * 2.5);
    
    // Main body
    fill(20, 20, 30);
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let radius = (i % 2 === 0) ? this.size : this.size/1.5;
      let x = cos(angle) * radius;
      let y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    
    // Core structure
    fill(50, 50, 70);
    ellipse(0, 0, this.size * 1.2, this.size * 1.2);
    
    // Central AI core
    fill(this.color);
    ellipse(0, 0, this.size * 0.8, this.size * 0.8);
    
    // Inner pulsing core
    fill(255, 255, 255, 150 + 100 * sin(frameCount * 0.1));
    ellipse(0, 0, this.size * 0.5, this.size * 0.5);
    
    // Weapon arrays
    for (let i = 0; i < 6; i++) {
      let angle = TWO_PI / 6 * i;
      let x = cos(angle) * this.size/1.2;
      let y = sin(angle) * this.size/1.2;
      
      push();
      translate(x, y);
      rotate(angle);
      
      fill(this.color);
      rect(-this.size/10, -this.size/20, this.size/5, this.size/10, 2);
      
      fill(255, 255, 255, 180);
      ellipse(this.size/10, 0, this.size/15, this.size/15);
      pop();
    }
    
    // Tech details - circuit patterns
    stroke(255, 255, 255, 100);
    strokeWeight(1);
    noFill();
    
    // Inner circuit pattern
    for (let i = 0; i < 3; i++) {
      let angle = TWO_PI / 3 * i;
      let x1 = cos(angle) * this.size/4;
      let y1 = sin(angle) * this.size/4;
      let x2 = cos(angle + TWO_PI/6) * this.size/2;
      let y2 = sin(angle + TWO_PI/6) * this.size/2;
      line(x1, y1, x2, y2);
    }
    
    // Outer spinning ring
    strokeWeight(2);
    stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], 150);
    push();
    rotate(frameCount * 0.01);
    ellipse(0, 0, this.size * 1.5, this.size * 1.5);
    pop();
  }
  
  shoot(projectiles) {
    if (this.type === 'boss') {
      // Boss shoots in multiple directions
      for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i + frameCount * 0.02;
        let vx = cos(angle) * 5;
        let vy = sin(angle) * 5;
        projectiles.push(new Projectile(
          this.pos.x, 
          this.pos.y, 
          vx, 
          vy, 
          false,
          this.type === 'boss' ? 2 : 1
        ));
      }
    } else if (this.type === 'tank') {
      for (let i = -1; i <= 1; i++) {
        projectiles.push(new Projectile(
          this.pos.x + i * 10, 
          this.pos.y + this.size / 2, 
          i * 0.5, 
          5, 
          false
        ));
      }
    } else {
      projectiles.push(new Projectile(
        this.pos.x, 
        this.pos.y + this.size / 2, 
        0, 
        5, 
        false
      ));
    }
  }
  
  hits(obj) {
    // Collision detection - simple distance check
    const d = dist(this.pos.x, this.pos.y, obj.pos.x, obj.pos.y);
    return d < (this.size / 2 + obj.size / 2);
  }
  
  isOffScreen() {
    return (
      this.pos.x < -this.size ||
      this.pos.x > width + this.size ||
      this.pos.y < -this.size ||
      this.pos.y > height + this.size
    );
  }
}