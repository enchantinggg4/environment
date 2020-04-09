import Player from "../../base/player/Player";
import TargetEnvironment from "../TargetEnvironment";
import Vector from "../../base/util/Vector";

export default class Target extends Player<TargetEnvironment> {
  radius: number = 50;
  x: number = 0;
  y: number = 0;

  private acceleration: Vector = new Vector(Math.random(), Math.random());
  get json(): any {
    return {
      radius: this.radius,
      x: this.x,
      y: this.y,
      type: "FOOD",
    };
  }

  update(env: TargetEnvironment): void {
    this.acceleration.add(new Vector(Math.random() - 0.5, Math.random() - 0.5));
    this.acceleration.normalize().mult(5);
    this.x += this.acceleration.x / 5;
    this.y += this.acceleration.y / 5;
  }
}
