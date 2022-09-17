const cDiv = document.createElement("div");
cDiv.className = "canvas-container";
const c = document.createElement("canvas");
cDiv.append(c);

const widthSlider = document.createElement("input");
widthSlider.type = "range";
widthSlider.min = "1";
widthSlider.max = "800";
const widthText = document.createElement("p");

const heightSlider = document.createElement("input");
heightSlider.type = "range";
heightSlider.min = "1";
heightSlider.max = "800";
const heightText = document.createElement("p");

document.body.append(widthText, widthSlider, heightText, heightSlider, cDiv);

const ctx = c.getContext("2d");

function draw() {
  const width = parseInt(widthSlider.value);
  const height = parseInt(heightSlider.value);
  c.width = width;
  c.height = height;
  widthText.innerText = "Width: " + width;
  heightText.innerText = "Height: " + height;

  const aspectRatio = height / width;

  const rect1 = [
    { x: -100, y: -100 },
    { x: +100, y: -100 },
    { x: +100, y: +100 },
    { x: -100, y: +100 },
  ];

  const rect2 = [
    { x: -100 + 300, y: -100 },
    { x: +100 + 300, y: -100 },
    { x: +100 + 300, y: +100 },
    { x: -100 + 300, y: +100 },
  ];

  const rect3 = [
    { x: -100 - 300, y: -100 },
    { x: +100 - 300, y: -100 },
    { x: +100 - 300, y: +100 },
    { x: -100 - 300, y: +100 },
  ];

  const transformRect = (
    rect: {
      x: number;
      y: number;
    }[]
  ) => {
    return rect
      .map(({ x, y }) => ({ x: x * aspectRatio * 0.9, y: y * 0.9 }))
      .map(({ x, y }) => ({
        x: x + width / 2,
        y: y + height / 2,
      }));
  };

  drawPoly(ctx, transformRect(rect1));
  drawPoly(ctx, transformRect(rect2));
  drawPoly(ctx, transformRect(rect3));

  // Text
  ctx.fillStyle = "black";
  ctx.font = "20px monospace";
  ctx.fillText("Aspect ratio: " + (height / width).toFixed(3), 10, 25);
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
