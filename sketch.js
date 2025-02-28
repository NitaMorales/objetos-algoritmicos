let branches = [];
const branchLength = 100; // Longitud fija de la línea

function setup() {
  createCanvas(800, 600);
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
  if (isInsideCanvas(newBranch.newX, newBranch.newY)) {
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
    let newAngle;
    do {
      newAngle = this.angle + random([-HALF_PI, -QUARTER_PI, QUARTER_PI, HALF_PI]);
      let testX = this.newX + cos(newAngle) * branchLength;
      let testY = this.newY + sin(newAngle) * branchLength;
      if (isInsideCanvas(testX, testY)) break;
    } while (true);
    return new Branch(this.newX, this.newY, newAngle, this.depth + 1);
  }
}