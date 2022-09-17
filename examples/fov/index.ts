type Point = { x: number; y: number };

const WIDTH = 1200;
const HEIGHT = 1000;

const c = document.createElement("canvas");
document.body.appendChild(c);
c.width = WIDTH;
c.height = HEIGHT;

const angelSlider = document.createElement("input");
angelSlider.type = "range";
angelSlider.min = "0.0";
angelSlider.max = "180.0";
angelSlider.step = "0.01";
const angleDiv = document.createElement("div");
const angleText = document.createElement("p");
angleDiv.append(angleText);

const znearSlider = document.createElement("input");
znearSlider.type = "range";
znearSlider.min = "0.0";
znearSlider.max = "200";
znearSlider.step = "0.01";
const znearDiv = document.createElement("div");
const znearText = document.createElement("p");
znearDiv.append(znearText);

const zfarSlider = document.createElement("input");
zfarSlider.type = "range";
zfarSlider.min = "50";
zfarSlider.max = HEIGHT + "";
zfarSlider.step = "0.01";
const zfarDiv = document.createElement("div");
const zfarText = document.createElement("p");
zfarDiv.append(zfarText);

document.body.append(
  angleDiv,
  angelSlider,
  znearDiv,
  znearSlider,
  zfarDiv,
  zfarSlider
);

const ctx = c.getContext("2d");

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  const angle = parseFloat(angelSlider.value);
  angleText.innerText = "Angle: " + angle;
  const znear = parseFloat(znearSlider.value);
  znearText.innerText = "znear: " + znear;
  const zfar = parseFloat(zfarSlider.value);
  zfarText.innerText = "zfar: " + zfar;

  const linesCenter = { x: WIDTH / 2, y: HEIGHT - 20 };

  const p1 = { x: 0, y: -(HEIGHT * 1000) };
  const p2 = p1;
  const rp1 = rotatePoint(p1, angle / 2);
  const rp2 = rotatePoint(p2, -angle / 2);
  const p1Final = { x: rp1.x + linesCenter.x, y: rp1.y + linesCenter.y };
  const p2Final = { x: rp2.x + linesCenter.x, y: rp2.y + linesCenter.y };

  const znearP1 = getPointOnLineAwayFromCenter(p1Final, linesCenter, znear);
  const znearP2 = getPointOnLineAwayFromCenter(p2Final, linesCenter, znear);
  const zfarP1 = getPointOnLineAwayFromCenter(p1Final, linesCenter, zfar);
  const zfarP2 = getPointOnLineAwayFromCenter(p2Final, linesCenter, zfar);

  drawPoly(ctx, [znearP1, znearP2, zfarP2, zfarP1]);

  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "lightblue";

  // Middle line
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(linesCenter.x, linesCenter.y);
  ctx.stroke();
  ctx.globalAlpha = 0.15;
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(linesCenter.x, linesCenter.y);
  ctx.lineTo(p1Final.x, p1Final.y);
  ctx.lineTo(p2Final.x, p2Final.y);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.closePath();
  ctx.stroke();

  // Text
  const rAngle = angle * (Math.PI / 180);
  ctx.fillStyle = "black";
  ctx.font = "28px monospace";
  ctx.fillText(
    "tan(angle/2) = " + Math.tan(rAngle / 2).toFixed(3),
    10,
    HEIGHT - 75
  );
  ctx.fillText(
    "1/tan(angle/2) = " + (1 / Math.tan(rAngle / 2)).toFixed(3),
    10,
    HEIGHT - 20
  );
}
draw();

angelSlider.addEventListener("input", () => draw());
znearSlider.addEventListener("input", () => draw());
zfarSlider.addEventListener("input", () => draw());

function getPointOnLineAwayFromCenter(
  linePoint: Point,
  centerPoint: Point,
  awayAmount: number
) {
  return calculateIntersection(
    linePoint,
    centerPoint,
    { x: 0, y: centerPoint.y - awayAmount },
    { x: WIDTH, y: centerPoint.y - awayAmount }
  );
}

function rotatePoint({ x, y }: { x: number; y: number }, angle: number) {
  const r = angle * (Math.PI / 180);
  return {
    x: x * Math.cos(r) - y * Math.sin(r),
    y: x * Math.sin(r) + y * Math.cos(r),
  };
}

function drawPoly(
  ctx: CanvasRenderingContext2D,
  points: {
    x: number;
    y: number;
  }[]
) {
  ctx.beginPath();
  ctx.fillStyle = "lightblue";
  for (const { x, y } of points) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

// https://dirask.com/posts/JavaScript-calculate-intersection-point-of-two-lines-for-given-4-points-VjvnAj
function calculateIntersection(p1: Point, p2: Point, p3: Point, p4: Point) {
  const c2x = p3.x - p4.x; // (x3 - x4)
  const c3x = p1.x - p2.x; // (x1 - x2)
  const c2y = p3.y - p4.y; // (y3 - y4)
  const c3y = p1.y - p2.y; // (y1 - y2)

  // down part of intersection point formula
  const d = c3x * c2y - c3y * c2x;

  if (d == 0) {
    throw new Error("Number of intersection points is zero or infinity.");
  }

  // upper part of intersection point formula
  const u1 = p1.x * p2.y - p1.y * p2.x; // (x1 * y2 - y1 * x2)
  const u4 = p3.x * p4.y - p3.y * p4.x; // (x3 * y4 - y3 * x4)

  // intersection point formula

  const px = (u1 * c2x - c3x * u4) / d;
  const py = (u1 * c2y - c3y * u4) / d;

  const p = { x: px, y: py };

  return p;
}
