import Player from "../player/Player";
import Vector from "./Vector";

export default (w: number, h: number, it: Player<any>) => {
  if (it.x > w) it.x = 0;
  if (it.x < 0) it.x = w;

  if (it.y > h) it.y = 0;
  if (it.y < 0) it.y = h;
};

export const edgeVector = (w: number, h: number, it: Vector) => {
  if (it.x > w) it.x = 0;
  if (it.x < 0) it.x = w;

  if (it.y > h) it.y = 0;
  if (it.y < 0) it.y = h;

  return it;
};
