
import {IRenderable} from "../Render";
import P5 from "p5"
import EvolutionEnvironment from "src/shared/evolution-env/EvolutionEnvironment";
import Vector from "src/shared/env/util/Vector";
import TestPlayer from "src/shared/evolution-env/TestPlayer";


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
    // console.log(this.inputs)
    for (let i = 0; i < EvolutionEnvironment.INPUT_FOOD_COUNT; i++) {
      p5.stroke("yellow");

      if (this.inputs[i * 2] === 0 && this.inputs[i * 2 + 1] === 0) continue;
      const angle = this.inputs[i * 2 + 1] * 2 * Math.PI;
      const addVector = new Vector(Math.cos(angle), Math.sin(angle)).mult(
        (1 - this.inputs[i * 2]) * this.viewDistance
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

  private drawDecision(p5: P5) {
    p5.stroke("white");
    const decisionVector = new Vector(
      Math.cos(this.outputs[0] * Math.PI * 2),
      Math.sin(this.outputs[0] * Math.PI * 2)
    ).mult(this.outputs[0] * this.viewDistance / 3);
    p5.line(
      this.x,
      this.y,
      this.x + decisionVector.x,
      this.y + decisionVector.y
    );
  }

  render(p5: P5): void {
    p5.stroke("white");
    // p5.noFill();
    p5.noStroke();
    // p5.ellipse(this.x, this.y, this.viewDistance * 2);

    if (this.elite) p5.fill("red");
    else p5.fill("green");
    p5.circle(this.x, this.y, TestPlayer.RADIUS * 2);
    this.drawFoodInputs(p5);
    this.drawDecision(p5);
    // this.drawPlayerInputs(p5);
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