import P5 from "p5";
import { IRenderable } from "../../render/renders/ItemRenderer";
import EvolutionEnvironment from "./EvolutionEnvironment";
import Vector from "../base/util/Vector";
import TestPlayer from "./entity/TestPlayer";

export class TestPlayerRenderable implements IRenderable {
  x: number = 0;
  y: number = 0;
  elite: boolean = false;
  viewDistance: number = 0;

  inputs: number[] = [0, 0, 0, 0];
  outputs: number[] = [];

  constructor(p: any) {
    Object.assign(this, p);
  }

  private drawFoodInputs(p5: P5) {
    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      if (this.inputs[i * 2] === 0 && this.inputs[i * 2 + 1] === 0) continue;

      const dist = (1 - this.inputs[i * 2]) * this.viewDistance;
      const angle = this.inputs[i * 2 + 1] * Math.PI * 2;

      const vec = new Vector(Math.cos(angle), Math.sin(angle)).mult(dist);

      p5.stroke("red");
      p5.line(this.x, this.y, this.x + vec.x, this.y + vec.y);
    }
  }

  private drawDecision(p5: P5) {
    p5.stroke("green");
    const decisionVector = new Vector(
      Math.cos(this.outputs[0] * Math.PI * 2),
      Math.sin(this.outputs[0] * Math.PI * 2)
    ).mult((this.outputs[0] * this.viewDistance) / 3);
    p5.line(
      this.x,
      this.y,
      this.x + decisionVector.x,
      this.y + decisionVector.y
    );
  }

  render(p5: P5): void {
    if (this.elite) p5.fill("red");
    else p5.fill("green");
    p5.circle(this.x, this.y, TestPlayer.RADIUS * 2);
    this.drawFoodInputs(p5);
    this.drawDecision(p5);
  }
}

export class FoodRenderable implements IRenderable {
  x: number = 0;
  y: number = 0;
  alive: boolean = true;

  constructor(p: any) {
    Object.assign(this, p);
  }
  render(p5: P5): void {
    if (this.alive) {
      p5.fill("yellow");
      p5.ellipse(this.x, this.y, 5);
    }
  }
}
