import Player from "../../base/player/Player";
import EvolutionEnvironment from "../EvolutionEnvironment";
import { Network } from "neataptic";
import Food from "./Food";

export default class TestPlayer extends Player<EvolutionEnvironment> {
  static RADIUS = 5;
  static SPEED = 0.5;

  x = 0;
  y = 0;

  inputs: number[] = [0, 0, 0, 0];
  outputs: number[] = [];
  viewDistance = 100;
  elite: boolean = false;
  radius = TestPlayer.RADIUS;

  constructor(public brain: Network) {
    super();
    this.brain.score = 0;
    this.elite = !!(brain as any).elite;
  }

  update(env: EvolutionEnvironment): void {
    this.calcInputs(env);
    const output = this.activate(this.brain.activate(this.inputs));
    // const output = this.brain.activate(this.inputs);
    this.outputs = output;

    const angle = output[0] * (Math.PI * 2);
    const distance = output[1]; // output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1];

    const shouldEat = output[2] > 0.5;
    const dX = distance * Math.cos(angle) * TestPlayer.SPEED;
    const dY = distance * Math.sin(angle) * TestPlayer.SPEED;

    this.x += dX;
    this.y += dY;
    this.checkFood(env, shouldEat);
    // this.checkCollision(env);
    //
  }

  private activate(output: number[]) {
    return output.map((it) => 1 / (1 + Math.exp(-it * 4)));
  }

  private checkFood(env: EvolutionEnvironment, shouldEat: boolean) {
    if (shouldEat) {
      const closestFood = env.foods.find(
        (it) => it.location.distance(this.location) <= 2 // make it harder to eat!
      );

      if (closestFood) {
        closestFood.alive = false;
        this.brain.score += 10;
      } else {
        this.brain.score -= 0.01;
      }
    }
  }

  /**
   * Pretty fast, < 3 ms
   * @param env
   */
  private calcInputs(env: EvolutionEnvironment) {
    const inputs: number[] = [];

    const goodFoods: any[] = [];
    const distances = [];
    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      distances[i] = Infinity;
      goodFoods[i] = null;
    }

    const f = env.foods;
    for (let i = 0; i < f.length; i++) {
      const dist = f[i].location.distance(this.location);
      if (dist > this.viewDistance) continue;
      for (let j = 0; j < EvolutionEnvironment.INPUT_FOOD_COUNT; j++) {
        if (dist < distances[j]) {
          distances[j] = dist;
          goodFoods[j] = f[i];
          break;
        }
      }
    }

    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      const closestFood = goodFoods[i];
      if (closestFood) {
        const distance = closestFood.location
          .sub(this.location)
          .div(this.viewDistance);

        const relDist = distance.mag();

        const angle = distance.heading(); // / (2 * Math.PI);
        if (angle < 0) {
          const positiveAngle = Math.PI * 2 + angle;
          inputs.push(1 - relDist, positiveAngle / (Math.PI * 2));
        } else {
          inputs.push(1 - relDist, angle / (Math.PI * 2));
        }
      } else {
        inputs.push(0, 0);
      }
    }

    this.inputs = inputs;
  }

  get json(): any {
    return {
      type: "PLAYER",
      x: this.x,
      y: this.y,
      viewDistance: this.viewDistance,
      inputs: this.inputs,
      outputs: this.outputs,
      elite: this.elite,
    };
  }
}
