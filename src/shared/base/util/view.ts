import Vector from "./Vector";
import Player from "../player/Player";

function distance(a: Vector, b: Vector) {
  return Math.sqrt(Math.pow(b.y - a.y, 2) + Math.pow(b.x - a.x, 2));
}

function dist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function collidePointLine(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  buffer = 0.1
) {
  // get distance from the point to the two ends of the line
  const d1 = dist(px, py, x1, y1);
  const d2 = dist(px, py, x2, y2);

  // get the length of the line
  const lineLen = dist(x1, y1, x2, y2);

  // since floats are so minutely accurate, add a little buffer zone that will give collision

  // if the two distances are equal to the line's length, the point is on the line!
  // note we use the buffer here to give a range, rather than one #
  return !!(d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer);
}

function collidePointCircle(
  x: number,
  y: number,
  cx: number,
  cy: number,
  d: number
) {
  //2d
  return dist(x, y, cx, cy) <= d / 2;
}

function collideLineCircle(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cx: number,
  cy: number,
  diameter: number
) {
  // is either end INSIDE the circle?
  // if so, return true immediately
  const inside1 = collidePointCircle(x1, y1, cx, cy, diameter);
  const inside2 = collidePointCircle(x2, y2, cx, cy, diameter);
  if (inside1 || inside2) return true;

  // get length of the line
  let distX = x1 - x2;
  let distY = y1 - y2;
  const len = Math.sqrt(distX * distX + distY * distY);

  // get dot product of the line and circle
  const dot =
    ((cx - x1) * (x2 - x1) + (cy - y1) * (y2 - y1)) / Math.pow(len, 2);

  // find the closest point on the line
  const closestX = x1 + dot * (x2 - x1);
  const closestY = y1 + dot * (y2 - y1);

  // is this point actually on the line segment?
  // if so keep going, but if not, return false
  const onSegment = collidePointLine(closestX, closestY, x1, y1, x2, y2);
  if (!onSegment) return false;

  // draw a debug circle at the closest point on the line

  // get distance to closest point
  distX = closestX - cx;
  distY = closestY - cy;
  const distance = Math.sqrt(distX * distX + distY * distY);

  if (distance <= diameter / 2) {
    return true;
  }
  return false;
}

const intersects = (
  loc: Vector,
  lineVector: Vector,
  observable: Player<any>
) => {
  return collideLineCircle(
    loc.x,
    loc.y,
    loc.x + lineVector.x,
    loc.y + lineVector.y,
    observable.x,
    observable.y,
    observable.radius * 2
  );
};

export default function createView(
  loc: Vector,
  fov: number,
  dist: number,
  observables: Player<any>[],
  inputs: number,
  offsetRadian: number = 0
): (Player<any> | null)[] {
  const view = new Vector(1, 0);
  // observables = observables.filter((it) => distance(it.location, loc) < dist);

  const inputz: (Player<any> | null)[] = [];
  for (let i = 0; i < inputs; i++) {
    const angle = (i / inputs) * fov - offsetRadian;
    const lineVector = view.copy().rotate(angle).mult(dist);
    const inter = observables.find((it) => intersects(loc, lineVector, it));

    inputz.push(inter || null);
  }
  return inputz;
}
