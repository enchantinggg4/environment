import Vector from "./Vector";

export default (vec: Vector, snapX: number, snapY: number = snapX) => {
  return new Vector(
    Math.round(vec.x / snapX) * snapX,
    Math.round(vec.y / snapY) * snapY
  );
};
