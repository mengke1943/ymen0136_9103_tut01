let cirs = []; // Used to store 4 types of dynamic circle ring
let stars = []; // Used to store stars
let meteors = []; // Used to store meteors
let scaleFactor = 1; // Scale factor for resizing content

let img; // Declare a variable to store the image
let meteorBurstTimer = 0; // The timer that controls the meteor burst

function preload() {
  // Preload the image of the hologram circle
  img = loadImage("https://png.pngtree.com/png-vector/20240601/ourmid/pngtree-circle-gradient-holographic-sphere-button-png-image_12588776.png");
// This image is from https://pngtree.com/so/holographic-circle.
}

function setup() {

  createCanvas(900, 900);
  angleMode(DEGREES);

  // Add circle rings at different positions: the first parameter is the x-coordinate, 
  // the second is the y-coordinate, the third is the circle ring type, 
  // the fourth is the circle ring size, and the fifth is the color

  cirs.push(new Circle(20, 9, 1, 190, color(128, 89, 136))); // First circle ring in the top left

  cirs.push(new Circle(345, 130, 2, 130, color(240, 250, 157))); // Second circle ring at the top

  cirs.push(new Circle(650, 71, 3, 150, color(154, 160, 196))); // Third circle ring at the top

  cirs.push(new Circle(840, 306, 4, 120, color(154, 160, 196))); // First circle ring on the right edge

  cirs.push(new Circle(134, 370, 3, 150, color(171, 248, 255))); // Circle ring in the middle-left of the canvas

  cirs.push(new Circle(515, 451, 2, 200, color(255, 133, 204))); // Circle ring in the center of the canvas

  cirs.push(new Circle(-40, 715, 1, 200, color(255))); // First circle ring at the bottom edge

  cirs.push(new Circle(630, 903, 4, 200, color(153, 191, 236))); // Third circle ring at the bottom edge

  cirs.push(new Circle(310, 730, 2, 120, color(153, 191, 236))); // Second circle ring at the bottom edge

  cirs.push(new Circle(850, 600, 1, 140, color(255))); // Second circle ring on the right edge
  
  for (let i = 0; i < 500; i++) {
    // Add 500 stationary stars
    stars.push(new Star());
  }
}

function draw() {

    // Calculate the scale factor and apply it to the content.
    scale(scaleFactor);

   // Create a gradient background from dark blue to dark purple.
   let topColor = color(1, 17, 92); // dark blue
   let bottomColor = color(60, 6, 102); // dark purple
 
   // Generate a color gradient between dark blue and black using `lerpColor()`.
   // This technique is from https://p5js.org/reference/p5/lerpColor/
   for (let y = 0; y < height / scaleFactor; y++) {
     let inter = map(y, 0, height / scaleFactor, 0, 1);
     let c = lerpColor(topColor, bottomColor, inter);
     stroke(c);
     line(0, y, width / scaleFactor, y);
   }

   meteorBurstTimer++;

   if (meteorBurstTimer % 500 < 100) { 
    // Every 5 seconds, 100 frames (1 second) are erupted, the frequency of meteor generation increases
    if (random(1) < 0.8) { // Increase the probability of generation during an outbreak
      meteors.push(new Meteor());
    }
  } else if (random(1) < 0.01) {
    // The probability of meteor generation under normal conditions
    meteors.push(new Meteor());
  }

  // Draw meteors and clean up meteors that leave the canvas
  for (let i = meteors.length - 1; i >= 0; i--) {
    meteors[i].update();
    meteors[i].display();
    if (meteors[i].y > height / scaleFactor + 100) meteors.splice(i, 1);
  } 
  for (let i = 0; i < stars.length; i++) {
    // Draw 500 static stars.
    stars[i].display();
  }
  for (let i = 0; i < meteors.length; i++) {
    // Draw the meteors.
    meteors[i].update();
    meteors[i].display();
  }
  for (let i = meteors.length - 1; i >= 0; i--) {
    // Clear the meteor when it reaches the bottom of the canvas.
    if (meteors[i].y > height / scaleFactor + 100)
      meteors.splice(i, 1);
  }

    // Draw a transparent gradient white circle under each dynamic circle ring.
  for (let i = 0; i < cirs.length; i++) {
    let baseX = cirs[i].x;
    let baseY = cirs[i].y;
    let baseSize = cirs[i].cirSize * 0.5;

    // Overlay multiple semi-transparent concentric circles to create a feathering effect visually
    for (let j = 0; j < 5; j++) { // Adjust the loop count to control the degree of feathering
      let alpha = map(j, 0, 10, 50, 0); // Gradually decrease opacity from the center outward
      let size = baseSize + j * 40; // The size of the circle gradually increases
      
      fill(255, alpha);
      noStroke();
      ellipse(baseX, baseY, size);
    }
  }

  // Draw all dynamic circle rings 
  for (let i = 0; i < cirs.length; i++) {
    cirs[i].display();
    
    drawWhiteCircle(cirs[i]); // Draw a white circular border around each dynamic ring
    drawImagesAroundCircle(cirs[i]); // Draw the hologram circle images around the circle rings
  } 
}

// Function to draw white circular borders around the dynamic circle rings with alternating size
function drawWhiteCircle(circle) {
  let scaleFactor = 1 + abs(sin(frameCount *1.5)) * 0.2; // Creates a smooth oscillation

  push();
  translate(circle.x, circle.y);
  scale(scaleFactor); // Apply scale to make the circular border smoothly grow and shrink
  stroke(255, 50); // White with 50% opacity
  strokeWeight(10); // Bold border
  noFill();
  ellipse(0, 0, circle.cirSize * 2.05); // Draw at (0, 0) after translation
  pop();
}

// Function to draw the hologram circle images around the circle rings
function drawImagesAroundCircle(circle) {
  let numImages = 15; // Set the number of images.
  for (let j = 0; j < numImages; j++) {
    let angle = map(j, 0, numImages, 366, TWO_PI); // Calculate the angle for each image
    let x = circle.x + cos(angle) * (circle.cirSize); // The x-coordinate of the image
    let y = circle.y + sin(angle) * (circle.cirSize); // The y-coordinate of the image
    image(img, x-8, y-8, 15, 15); // Draw the image with a width and height of 15x15
  }
}


// Class representing the static stars with properties
class Star {
  constructor() {
    // Generate a random position for the star within the canvas bounds
    this.x = random(width);
    this.y = random(height);

    // Assign a random color to each star with a certain probability
    if (random(1) < 0.5) {
      this.col = color(200, 161, 192);
    } else {
      this.col = color(255);
    }
  }
  display() {
    // Draw the static stars
    stroke(this.col);
    strokeWeight(2);
    point(this.x, this.y); // This technique is from https://p5js.org/reference/p5/point/
  }
}

// Class representing the meteors with properties
class Meteor {
  constructor() {
    // Generate meteors at random positions at the top of the screen
    this.x = random(-width, width);
    this.y = 0;
    this.vx = 4;
    this.vy = 4;
  }
  display() {
    // Draw the meteor and its tail
    fill(255);
    stroke(255, 150);
    ellipse(this.x, this.y, random(4, 7));
    line(this.x, this.y, - this.vx * 10 + this.x, - this.vy * 10 + this.y)
  }
  update() {
    // Make the meteor move.
    this.x += this.vx;
    this.y += this.vy;
  }
}

// Class representing the dynamic circle rings with properties
class Circle {
  constructor(x, y, s, size, col) {
    // Initialize dynamic circle ring
    this.x = x;
    this.y = y;
    this.style = s; //The type of the circle rings
    this.cirSize = size;
    this.parts = [];
    this.angle = 0;
    this.col = col;
    // Control the rotation direction
    this.rotateDir = 1;
    if (random(1) < 0.5) {
      this.rotateDir = -1;
    }
    this.init();
  }

  init() {
    // Add different types of particles at different positions based on the type of dynamic circle ring 
    if (this.style == 1) {
      this.layer = 8; // Number of circle ring layers
      for (let l = 0; l < this.layer; l += 1) {
        for (let i = 0; i < 4; i++) {
          for (let n = 0; n < 90; n += 2) {
            // Calculate the position, rotation angle, opacity, and size data for each circle ring 
            let r = map(l, 0, this.layer, this.cirSize * 0.1, this.cirSize);
            let angle = map(i, 0, 4, 0, 360) + this.angle + n;
            let x = cos(angle) * r;
            let y = sin(angle) * r;
            let alp = map(n, 0, 90, 255, 0);
            this.parts.push(new Particle1(x, y, alp, this.col));
          }
        }
      }
    }
    else if (this.style == 2) {
      this.layer = 15; // Number of circle ring layers
      for (let l = 0; l < this.layer; l += 1) {
        for (let i = 0; i < 2; i++) {
          for (let n = 0; n < 90; n += 2) {
             // Calculate the position, rotation angle, opacity, and size data for each circle ring 
            let r = map(l, 0, this.layer, this.cirSize * 0.2, this.cirSize);
            let angle = map(i, 0, 2, 0, 360) + l * 45 + n;
            let x = cos(angle) * r;
            let y = sin(angle) * r;
            let alp = map(n, 0, 100, 255, 0);
            this.parts.push(new Particle1(x, y, alp, this.col));
          }
        }
      }
    }
    else if (this.style == 3) {
      this.layer = 10; // Number of circle ring layers
      for (let l = 0; l < this.layer; l += 1) {
        for (let i = 0; i < 3; i++) {
          for (let n = 0; n < l + 2; n++) {
            // Calculate the position, rotation angle, opacity, and size data for each circle ring 
            let r = map(l, 0, this.layer, this.cirSize * 0.2, this.cirSize);
            let angle = map(i, 0, 3, 0, 360) + n * 12 + l * 20;
            let x = cos(angle) * r;
            let y = sin(angle) * r;
            let sw = map(n, 0, this.layer, 8, 1);
            this.parts.push(new Particle2(x, y, sw, this.col));
          }
        }
      }
    }

    else if (this.style == 4) {
      this.layer = 6; // Number of circle ring layers
      for (let l = 0; l < this.layer; l += 1) {
        for (let i = 0; i < 3; i++) {
          for (let n = 0; n < l * 4 + 12; n++) {
            // Calculate the position, rotation angle, opacity, and size data for each circle ring 
            let r = map(l, 0, this.layer, this.cirSize * 0.2, this.cirSize);
            let angle = map(n, 0, l * 4 + 12, 0, 360) + l * 180;
            let x = cos(angle) * r;
            let y = sin(angle) * r;
            let sw = map(abs(n - (l * 4 + 12) / 2), 0, (l * 4 + 12) / 2, 12, -1);
            this.parts.push(new Particle2(x, y, sw, this.col));
          }
        }
      }
    }
  }

  display() {
    // Implement rotation reversal effect based on frameCount
    let flip = sin(frameCount * 0.5); // flip between -1 and 1 periodically

    // Calculate dynamic rotation speed based on time
    let rotationSpeed = map(sin(frameCount * 0.1), -1, 1, 0.5, 2) * this.rotateDir;
    for (let i = 0; i < this.parts.length; i++) {
      push();
      translate(this.x, this.y);
      scale(flip, 1); // Apply flip effect to reverse rotation
      rotate(this.angle);
      rotate(this.angle);
      this.parts[i].display();
      pop();
    }
    
    this.angle += rotationSpeed; // Update angle based on dynamic rotation speed
  }
}

// Two types of particles
class Particle1 {
  constructor(x, y, alp, col) {
    this.x = x;
    this.y = y;
    this.alp = alp;
    this.sw = 4; // Set the size

    this.r = red(col);
    this.g = green(col);
    this.b = blue(col);
  }
  display() {
    strokeWeight(this.sw);
    stroke(this.r, this.g, this.b, this.alp);
    point(this.x, this.y);
  }
}
class Particle2 {
  constructor(x, y, sw, col) {
    this.x = x;
    this.y = y;
    this.sw = sw;
    this.col = col;
  }
  display() {
    strokeWeight(this.sw);
    stroke(this.col);
    point(this.x, this.y);
  }
}

// Function to make the canvas and content scale proportionally when the window size changes
function windowResized() {
  let aspectRatio = 900 / 900; // The aspect ratio of the original canvas.
  let newWidth = windowWidth;
  let newHeight = windowWidth / aspectRatio;

  if (newHeight > windowHeight) {
    newHeight = windowHeight;
    newWidth = newHeight * aspectRatio;
  }

  resizeCanvas(newWidth, newHeight); // This technique is from https://p5js.org/reference/p5/resizeCanvas/
  scaleFactor = newWidth / 900; // Update the scaling factor
}