let branches = [];
const branchLength = 100; // Fixed length of each branch
let canvas; // Store canvas reference

function setup() {
  let container = document.getElementById("canvas-container");
  canvas = createCanvas(min(800, windowWidth), windowHeight * 0.9); // Responsive height
  canvas.parent(container);
  
  // Initialize the first branch only after the canvas is created
  branches.push(new Branch(width / 2, height / 2, random(TWO_PI), 0));
  disableDoubleTapZoom();


}

function draw() {
  background(255);
  
  // Ensure branches array is not empty before drawing
  if (branches.length > 0) {
    for (let branch of branches) {
      branch.show();
    }
  }
}

function mousePressed() {
  // Ensure branches is initialized before accessing it
  if (branches.length === 0) return;

  let lastBranch = branches[branches.length - 1];
  let newBranch = lastBranch.bifurcate();
  
  if (newBranch !== null && isInsideCanvas(newBranch.newX, newBranch.newY)) {
    branches.push(newBranch);
  }
}

function isInsideCanvas(x, y) {
  return x >= 20 && x <= width - 20 && y >= 20 && y <= height - 20;
}

function windowResized() {
  resizeCanvas(min(800, windowWidth), windowHeight * 0.9);
}

// Branch class remains the same
class Branch {
  constructor(x, y, angle, depth = 0) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.depth = depth;
    this.newX = this.x + cos(this.angle) * branchLength;
    this.newY = this.y + sin(this.angle) * branchLength;
  }

  show() {
    stroke(this.depth % 2 === 0 ? 0 : color(139, 0, 0)); // Alternates between black and dark red
    strokeWeight(2);
    line(this.x, this.y, this.newX, this.newY);
  }

  bifurcate() {
    let newAngle, testX, testY;
    let attempts = 0; // Limit retry attempts to prevent infinite loops

    do {
      newAngle = this.angle + random([-HALF_PI, -QUARTER_PI, QUARTER_PI, HALF_PI]);
      testX = this.newX + cos(newAngle) * branchLength;
      testY = this.newY + sin(newAngle) * branchLength;

      if (isInsideCanvas(testX, testY)) {
        return new Branch(this.newX, this.newY, newAngle, this.depth + 1);
      }

      attempts++;
    } while (attempts < 10); // Stop trying after 10 failed attempts

    return null; // If no valid position is found, return null to avoid crashing
  }
}


function disableDoubleTapZoom() {
  let lastTouchEnd = 0;

  document.addEventListener("touchend", (event) => {
    let now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, { passive: false });
}

