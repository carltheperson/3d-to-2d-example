const WIDTH = 500;
const HEIGHT = 500;

const cDiv = document.createElement("div");
cDiv.className = "can.0vas-container";
const c = document.createElement("canvas");
cDiv.append(c);

const widthSlider = document.createElement("input");
widthSlider.type = "range";
widthSlider.min = "-1.0";
widthSlider.max = "1.0";
widthSlider.step = "0.01";
const widthText = document.createElement("p");

const heightSlider = document.createElement("input");
heightSlider.type = "range";
heightSlider.min = "0.0";
heightSlider.max = "2.0";
heightSlider.step = "0.01";
const heightText = document.createElement("p");

document.body.append(widthText, widthSlider, heightText, heightSlider, cDiv);

const ctx = c.getContext("2d");

function draw() {
  c.width = WIDTH;
  c.height = HEIGHT;
  const width = parseFloat(widthSlider.value);
  const height = parseFloat(heightSlider.value);
  widthText.innerText = "Width: " + width;
  heightText.innerText = "Height: " + height;

  const transform = (xy: number, z: number) => {
    return xy / (z * Math.tan(0.78539816 / 2.0));
  };

  const points = [
    {
      x: 0.3,
      y: 0.5,
      z: 0.8,
    },
    {
      x: 0.7,
      y: 0.1,
      z: 0.5,
    },
    {
      x: 0.3,
      y: 0.4,
      z: 0.11,
    },
  ]
    .map(({ x, y, z }) => ({ x: x + width, y, z: z + height }))
    .map(({ x, y, z }) => ({ x: transform(x, z), y: transform(y, z) }))
    .map(({ x, y }) => ({ x: x * WIDTH, y: y * HEIGHT }));

  drawPoly(ctx, points);
}

draw();

widthSlider.addEventListener("input", () => draw());
heightSlider.addEventListener("input", () => draw());

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
