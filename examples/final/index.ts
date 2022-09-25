const WIDTH = 1000;
const HEIGHT = 1000;

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

let mouseX = 0;
let mouseY = 0;

function draw() {
  c.width = WIDTH;
  c.height = HEIGHT;

  const mouseXratio = (mouseX / c.width) * (1 * Math.PI);
  // console.log(mouseX / c.width);
  const mouseYratio = (mouseY / c.height) * (1 * Math.PI);

  // const width = parseFloat(widthSlider.value);
  // const height = parseFloat(heightSlider.value);
  const width = 0.00001;
  const height = 0.0001;
  widthText.innerText = "Width: " + width;
  heightText.innerText = "Height: " + height;

  const transform = (xy: number, z: number) => {
    return xy / (z * Math.tan(0.78539816 / 2.0));
  };

  const scale = 1;
  const distanceOffset = 10;
  const xyOffset = 1;

  const faces = [
    // bottom
    [
      {
        x: -0.5,
        y: 0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: 0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: 0.5,
        z: 0.5,
      },
      {
        x: -0.5,
        y: 0.5,
        z: 0.5,
      },
    ],
    // Front
    [
      {
        x: -0.5,
        y: -0.5,
        z: 0.5,
      },
      {
        x: 0.5,
        y: -0.5,
        z: 0.5,
      },
      {
        x: 0.5,
        y: 0.5,
        z: 0.5,
      },
      {
        x: -0.5,
        y: 0.5,
        z: 0.5,
      },
    ],
    // Back
    [
      {
        x: -0.5,
        y: -0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: -0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: 0.5,
        z: -0.5,
      },
      {
        x: -0.5,
        y: 0.5,
        z: -0.5,
      },
    ],

    // Top
    [
      {
        x: -0.5,
        y: -0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: -0.5,
        z: -0.5,
      },
      {
        x: 0.5,
        y: -0.5,
        z: 0.5,
      },
      {
        x: -0.5,
        y: -0.5,
        z: 0.5,
      },
    ],
  ].map((points) =>
    points
      .map((p) => rotate3D(p, mouseYratio, mouseXratio, 0))
      .map(({ x, y, z }) => ({ x: x * scale, y: y * scale, z: z * scale }))
      .map(({ x, y, z }) => ({
        x: x,
        y: y,
        z: z + distanceOffset,
      }))
      // .map(({ x, y, z }) => ({ x: x + width, y: y + 0.5, z: z + height }))
      .map(({ x, y, z }) => ({ x: transform(x, z), y: transform(y, z) }))
      .map(({ x, y }) => ({
        x: x * WIDTH + WIDTH / 2,
        y: y * HEIGHT + HEIGHT / 2,
      }))
  );
  drawPoly(ctx, [100, 100, 255], faces[0]);
  drawPoly(ctx, [100, 255, 100], faces[1]);
  drawPoly(ctx, [100, 255, 100], faces[2]);
  drawPoly(ctx, [100, 100, 255], faces[3]);
}

draw();

widthSlider.addEventListener("input", () => draw());
heightSlider.addEventListener("input", () => draw());
c.addEventListener("mousemove", (event) => {
  mouseX = event.offsetX;
  mouseY = event.offsetY;
  draw();
});

function drawPoly(
  ctx: CanvasRenderingContext2D,
  color: [number, number, number],
  points: {
    x: number;
    y: number;
  }[]
) {
  ctx.beginPath();
  ctx.fillStyle = `rgb(${color.join(",")}, 0.0)`;
  ctx.lineWidth = 3;
  for (const { x, y } of points) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function rotatePoint({ x, y }: { x: number; y: number }, r: number) {
  return {
    x: x * Math.cos(r) - y * Math.sin(r),
    y: x * Math.sin(r) + y * Math.cos(r),
  };
}

// https://en.wikipedia.org/wiki/Rotation_matrix#General_rotations
function rotate3D(
  { x, y, z }: { x: number; y: number; z: number },
  /* around x */ roll: number, // y
  /* around y */ pitch: number, // B
  /* around z */ yaw: number // a
) {
  /*
  [cos(a)*cos(B), cos(a)*sin(B)*sin(y)-sin(a)*cos(y), cos(a)*sin(B)*cos(y)+sin(a)*sin(y)]
  [sin(a)*cos(B), sin(a)*sin(B)*sin(y)+cos(a)*cos(y), sin(a)*sin(B)*cos(y)-cos(a)*sin(y)]
  [   -sin(B),               cos(B)*sin(y),                     cos(B)*cos(y)           ]
  */

  //[Math.cos(yaw)*Math.cos(pitch), Math.cos(yaw)*Math.sin(pitch)*Math.sin(roll)-Math.sin(yaw)*Math.cos(roll), Math.cos(yaw)*Math.sin(pitch)*Math.cos(roll)+Math.sin(yaw)*Math.sin(roll)]
  //[Math.sin(yaw)*Math.cos(pitch), Math.sin(yaw)*Math.sin(pitch)*Math.sin(roll)+Math.cos(yaw)*Math.cos(roll), Math.sin(yaw)*Math.sin(pitch)*Math.cos(roll)-Math.cos(yaw)*Math.sin(roll)]
  //[   -Math.sin(pitch)                Math.cos(pitch)*Math.sin(roll),                     Math.cos(pitch)*Math.cos(roll)           ]

  return {
    x:
      Math.cos(yaw) * Math.cos(pitch) * x +
      (Math.cos(yaw) * Math.sin(pitch) * Math.sin(roll) -
        Math.sin(yaw) * Math.cos(roll)) *
        y +
      (Math.cos(yaw) * Math.sin(pitch) * Math.cos(roll) +
        Math.sin(yaw) * Math.sin(roll)) *
        z,
    y:
      Math.sin(yaw) * Math.cos(pitch) * x +
      (Math.sin(yaw) * Math.sin(pitch) * Math.sin(roll) +
        Math.cos(yaw) * Math.cos(roll)) *
        y +
      (Math.sin(yaw) * Math.sin(pitch) * Math.cos(roll) -
        Math.cos(yaw) * Math.sin(roll)) *
        z,
    z:
      -Math.sin(pitch) * x +
      Math.cos(pitch) * Math.sin(roll) * y +
      Math.cos(pitch) * Math.cos(roll) * z,
  };
}
