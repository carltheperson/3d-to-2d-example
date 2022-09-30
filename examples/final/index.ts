const FACES = [
  // bottom
  [
    { x: -0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },
  ],
  // Front
  [
    { x: -0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: 0.5, y: 0.5, z: 0.5 },
    { x: -0.5, y: 0.5, z: 0.5 },
  ],
  // Back
  [
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: 0.5, z: -0.5 },
    { x: -0.5, y: 0.5, z: -0.5 },
  ],
  // Top
  [
    { x: -0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: -0.5 },
    { x: 0.5, y: -0.5, z: 0.5 },
    { x: -0.5, y: -0.5, z: 0.5 },
  ],
];

const CUBE_DISTANCE = 10;
const WIDTH = 1000;
const HEIGHT = 1000;
const FOV_ANGLE = 45;

const c = document.createElement("canvas");
c.width = WIDTH;
c.height = HEIGHT;
const ctx = c.getContext("2d");
ctx.lineWidth = 3;
document.body.append(c);

function transform2DTo3D(xy: number, z: number) {
  const angleRadians = (FOV_ANGLE / 180) * Math.PI;
  return xy / (z * Math.tan(angleRadians / 2));
}

function draw(mouseX: number, mouseY: number) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  const mouseXratio = (mouseX / WIDTH) * Math.PI;
  const mouseYratio = (mouseY / HEIGHT) * Math.PI;

  const faces2D = FACES.map((points) =>
    points
      .map((p) => rotate3D(p, mouseYratio, mouseXratio, 0))
      .map(({ x, y, z }) => ({ x: x, y: y, z: z + CUBE_DISTANCE }))
      .map(({ x, y, z }) => ({
        x: transform2DTo3D(x, z),
        y: transform2DTo3D(y, z),
      }))
      .map(({ x, y }) => ({
        x: x * WIDTH + WIDTH / 2,
        y: y * HEIGHT + HEIGHT / 2,
      }))
  );

  for (const face of faces2D) {
    drawPolygonOutline(ctx, face);
  }
}

c.addEventListener("mousemove", (event) => draw(event.offsetX, event.offsetY));
draw(0, 0);

function drawPolygonOutline(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[]
) {
  ctx.beginPath();
  for (const { x, y } of points) {
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

// https://en.wikipedia.org/wiki/Rotation_matrix#General_rotations
function rotate3D(
  { x, y, z }: { x: number; y: number; z: number },
  /* around x */ roll: number, // y
  /* around y */ pitch: number, // B
  /* around z */ yaw: number // a
) {
  /*
  [cos(y)*cos(p), cos(y)*sin(p)*sin(r)-sin(y)*cos(r), cos(y)*sin(p)*cos(r)+sin(y)*sin(r)]
  [sin(y)*cos(p), sin(y)*sin(p)*sin(r)+cos(y)*cos(r), sin(y)*sin(p)*cos(r)-cos(y)*sin(r)]
  [   -sin(p),               cos(p)*sin(r),                     cos(p)*cos(r)           ]
 */

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
