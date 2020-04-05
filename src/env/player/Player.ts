import Environment from "../Environment";
import Vector from "../util/Vector";

export default abstract class Player<T extends Environment> {
  x: number = 0;
  y: number = 0;

  public get location(): Vector {
    return new Vector(this.x, this.y);
  }

  abstract update(env: T): void;
}
interface IUpdatable<T extends Environment> {

}
