import Environment from "../Environment";
import Vector from "../util/Vector";

export default abstract class Player<T extends Environment> {
  abstract x: number;
  abstract y: number;
  abstract radius: number;

  abstract get json(): any
  public get location(): Vector {
    return new Vector(this.x, this.y);
  }

  public set location(v: Vector) {
    this.x = v.x;
    this.y = v.y;
  }

  abstract update(env: T): void;

}
interface IUpdatable<T extends Environment> {

}
