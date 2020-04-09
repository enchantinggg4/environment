import Player from "../../base/player/Player";
import TargetEnvironment from "../TargetEnvironment";
import { Network } from "neataptic";
import Vector from "../../base/util/Vector";
import EvolutionEnvironment from "../../neat-env/EvolutionEnvironment";
import collision from "../../base/util/collision";

export default class TargetSeeker extends Player<TargetEnvironment> {
  radius: number = 8;
  x: number = 0;
  y: number = 0;
  private inputs: number[] = [];
  private output: number[] = [];

  constructor(public brain: Network) {
    super();
    this.brain.score = 0;
  }

  get json(): any {
    return {
      radius: this.radius,
      x: this.x,
      y: this.y,
      inputs: this.inputs,
      outputs: this.output,
      type: "PLAYER",
    };
  }

  calcInputs(env: TargetEnvironment) {
    const inputs = [];
    const distance = env.target.location
      .sub(this.location)
      .div(new Vector(TargetEnvironment.WIDTH, TargetEnvironment.HEIGHT).mag());

    const relDist = distance.mag();

    const angle = distance.heading(); // / (2 * Math.PI);
    if (angle < 0) {
      const positiveAngle = Math.PI * 2 + angle;
      inputs.push(1 - relDist, positiveAngle / (Math.PI * 2));
    } else {
      inputs.push(1 - relDist, angle / (Math.PI * 2));
    }

    this.inputs = inputs;
  }

  update(env: TargetEnvironment): void {
    this.calcInputs(env);
    const output = this.brain.activate(this.inputs);
    this.output = output;

    const angle = output[0] * (Math.PI * 2);
    const distance = output[1]; // output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1];

    const dX = distance * Math.cos(angle) * 3;
    const dY = distance * Math.sin(angle) * 3;

    this.x += dX;
    this.y += dY;

    const score =
      this.location.distance(env.target.location) /
      new Vector(TargetEnvironment.WIDTH, TargetEnvironment.HEIGHT).mag();
    const sc = isNaN(score) ? 0 : isFinite(score) ? 1 - score : 0;
    this.brain.score += sc;

    collision(this, env.players, this.radius);
  }
}
