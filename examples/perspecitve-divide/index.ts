const WIDTH = 1000;
const HEIGHT = 800;

const c = document.createElement("canvas");
document.body.appendChild(c);
c.width = WIDTH;
c.height = HEIGHT;

const slider = document.createElement("input");
slider.type = "range";
slider.min = "1.0";
slider.max = "10.0";
slider.step = "0.01";

document.body.appendChild(slider);

const ctx = c.getContext("2d");

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);
  const value = parseFloat(slider.value);
  ctx.fillStyle = "grey";
  drawLinesToCenter(ctx);
  const points1 = getSquare(value, WIDTH, HEIGHT);
  const points2 = getSquare(value, WIDTH * 0.7, HEIGHT * 0.7);
  [...points1, ...points2].forEach((p) => drawPoint(ctx, p));
  const sidePolies = [
    [points1[0], points1[3], points2[3], points2[0]],
    [points1[0], points1[1], points2[1], points2[0]],
    [points1[1], points1[2], points2[2], points2[1]],
    [points1[2], points1[3], points2[3], points2[2]],
  ];
  const backPoly = [points2[0], points2[1], points2[2], points2[3]];
  sidePolies.forEach((p) => drawPoly(ctx, 0.15, p));
  drawPoly(ctx, 0.1, backPoly);
}
draw();

slider.addEventListener("input", draw);

function getSquare(divider: number, w: number, h: number) {
  const halfW = w / 2;
  const halfH = h / 2;
  const halfCanvasW = WIDTH / 2;
  const halfCanvasH = HEIGHT / 2;
  const points = {
    x1: -halfW / divider + halfCanvasW,
    y1: -halfH / divider + halfCanvasH,
    x2: +halfW / divider + halfCanvasW,
    y2: -halfH / divider + halfCanvasH,
    x3: +halfW / divider + halfCanvasW,
    y3: +halfH / divider + halfCanvasH,
    x4: -halfW / divider + halfCanvasW,
    y4: +halfH / divider + halfCanvasH,
  };
  return [
    { x: points.x1, y: points.y1 },
    { x: points.x2, y: points.y2 },
    { x: points.x3, y: points.y3 },
    { x: points.x4, y: points.y4 },
  ];
}

function drawPoint(
  ctx: CanvasRenderingContext2D,
  { x, y }: { x: number; y: number }
) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
}

function drawPoly(
  ctx: CanvasRenderingContext2D,
  opacity: number,
  points: {
    x: number;
    y: number;
  }[]
) {
  ctx.globalAlpha = opacity;
  ctx.beginPath();
  ctx.fillStyle = "green";
  for (const { x, y } of points) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();
}

function drawLinesToCenter(ctx: CanvasRenderingContext2D) {
  ctx.globalAlpha = 0.25;
  ctx.beginPath();
  const corners = [
    [0, 0],
    [WIDTH, 0],
    [WIDTH, HEIGHT],
    [0, HEIGHT],
  ];
  for (const [x, y] of corners) {
    ctx.moveTo(WIDTH / 2, HEIGHT / 2);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();

  // Hacky trianlges
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT / 2);
  ctx.lineTo(0, HEIGHT);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(WIDTH, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT / 2);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.closePath();

  ctx.fill();

  ctx.globalAlpha = 1;
}
