let branches = [];
const branchLength = 100; // Longitud fija de la línea

function setup() {
  createCanvas(800, 600); // Fixed canvas size
  branches.push(new Branch(width / 2, height / 2, random(TWO_PI), 0)); // Comienza en el centro
}

function draw() {
  background(240);
  for (let branch of branches) {
    branch.show();
  }
}

function mousePressed() {
  let lastBranch = branches[branches.length - 1];
  let newBranch = lastBranch.bifurcate();
  if (newBranch !== null) {
    branches.push(newBranch);
  }
}

function isInsideCanvas(x, y) {
  return x >= 20 && x <= width - 20 && y >= 20 && y <= height - 20;
}

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
    stroke(this.depth % 2 === 0 ? 0 : color(139, 0, 0)); // Alterna entre negro y rojo oscuro
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