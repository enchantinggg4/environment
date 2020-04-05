import P5 from "p5";
import Player from "../env/player/Player";
import EvolutionEnvironment from "./EvolutionEnvironment";
import { IRenderable } from "../render/Render";
import { Network } from "neataptic";
import Vector from "../env/util/Vector";

export type PlayerType = "PLAYER" | "FOOD";

export default class TestPlayer extends Player<EvolutionEnvironment> {
  static RADIUS = 5;
  static SPEED = 1;

  inputs: number[] = [0, 0, 0, 0];
  viewDistance = 100;

  constructor(public brain: Network) {
    super();
    this.brain.score = 0;
  }

  get json(): any {
    return {
      type: "PLAYER",
      x: this.x,
      y: this.y,
      viewDistance: this.viewDistance,
      inputs: this.inputs,
    };
  }

  update(env: EvolutionEnvironment): void {
    this.calcInputs(env);
    // const output = this.activate(this.brain.activate(this.inputs));
    const output = this.brain.activate(this.inputs);

    const angle = output[0] / (Math.PI * 2);
    const distance = output[1] > 1 ? 1 : output[1] < 0 ? 0 : output[1];

    const dX = distance * Math.cos(angle) * TestPlayer.SPEED;
    const dY = distance * Math.sin(angle) * TestPlayer.SPEED;

    this.x += dX;
    this.y += dY;
    this.checkFood(env);
    // this.checkCollision(env);
  }

  private activate(output: number[]) {
    return output.map((it) => 1 / (1 + Math.exp(-it)));
  }

  private checkCollision(env: EvolutionEnvironment) {
    env.players.forEach((it) => {
      if (
        it !== this &&
        it.location.distance(this.location) < TestPlayer.RADIUS * 2
      ) {
        const newLoc = it.location
          .sub(this.location)
          .normalize()
          .mult(TestPlayer.RADIUS * 2);
        this.x = it.location.x - newLoc.x;
        this.y = it.location.y - newLoc.y;
      }
    });
  }

  private checkFood(env: EvolutionEnvironment) {
    const closestFood = env.foods.find(
      (it) => it.location.distance(this.location) <= TestPlayer.RADIUS
    );

    if (closestFood) {
      closestFood.alive = false;
      this.brain.score++;
    }
  }

  private calcInputs(env: EvolutionEnvironment) {
    const inputs: number[] = [];

    // food

    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      const closestFood = env.foods
        .filter(
          (it) => it.location.distance(this.location) <= this.viewDistance
        )
        .sort(
          (a, b) =>
            a.location.distance(this.location) -
            b.location.distance(this.location)
        )[i];

      if (closestFood) {
        const distance = closestFood.location
          .sub(this.location)
          .div(this.viewDistance);

        const relDist = distance.mag();

        // angleToPoint(this.x, this.y, player.x, player.y) / (2 * PI)
        const angle = distance.heading() / (2 * Math.PI);

        inputs.push(relDist, angle);
      } else {
        inputs.push(0, 0);
      }
    }

    // console.log(inputs)

    // const closestPlayer = env.players
    //   .filter(
    //     (it) =>
    //       it !== this &&
    //       it.location.distance(this.location) <= this.viewDistance
    //   )
    //   .sort(
    //     (a, b) =>
    //       a.location.distance(this.location) -
    //       b.location.distance(this.location)
    //   )[0];
    //
    // if (closestPlayer) {
    //   const distance = closestPlayer.location
    //     .sub(this.location)
    //     .div(this.viewDistance);
    //   inputs.push(distance.x, distance.y);
    // } else {
    //   inputs.push(0, 0);
    // }

    this.inputs = inputs;
  }
}

export class TestPlayerRenderable implements IRenderable {
  x: number = 0;
  y: number = 0;
  viewDistance: number = 0;

  inputs: number[] = [0, 0, 0, 0];

  constructor(p: any) {
    Object.assign(this, p);
  }

  private drawFoodInputs(p5: P5) {
    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      p5.stroke("yellow");

      const angle = this.inputs[i * 2 + 1] * 2 * Math.PI;
      const addVector = new Vector(Math.cos(angle), Math.sin(angle)).mult(
        this.inputs[i * 2] * this.viewDistance
      );
      // console.log(angle);
      p5.line(this.x, this.y, this.x + addVector.x, this.y + addVector.y);
    }
  }

  private drawPlayerInputs(p5: P5) {
    if (this.inputs[2] === -1) return;

    p5.stroke("red");
    p5.line(
      this.x,
      this.y,
      this.x + this.inputs[2] * this.viewDistance,
      this.y + this.inputs[3] * this.viewDistance
    );
  }

  render(p5: P5): void {
    p5.stroke("white");
    // p5.noFill();
    // p5.ellipse(this.x, this.y, this.viewDistance * 2);
    p5.fill("green");
    p5.circle(this.x, this.y, TestPlayer.RADIUS * 2);
    this.drawFoodInputs(p5);
    // this.drawPlayerInputs(p5);
  }
}
