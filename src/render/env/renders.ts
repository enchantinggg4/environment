import P5 from "p5";
import EvolutionEnvironment from "src/shared/evolution-env/EvolutionEnvironment";
import Vector from "src/shared/env/util/Vector";
import TestPlayer from "src/shared/evolution-env/TestPlayer";
import { IRenderable } from "../renders/ItemRenderer";

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
    const side = Math.sqrt(EvolutionEnvironment.INPUT_COUNT);

    const heatmap = this.inputs;
    p5.loadPixels();

    const intX = Math.round(this.x);
    const intY = Math.round(this.y);

    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        const realX = intX - side / 2 + x;
        const realY = intY - side / 2 + y;

        const hmv = heatmap[x + y * side];

        const index = (realX + realY * p5.width) * 4;

        p5.pixels[index] = 255 * hmv;
        p5.pixels[index + 1] = 255 * hmv;
        p5.pixels[index + 2] = 255 * hmv;
        p5.pixels[index + 3] = 255;
      }
    }

    p5.updatePixels();
  }

  private drawDecision(p5: P5) {
    p5.stroke("white");
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
    this.drawFoodInputs(p5);
    // p5.stroke("white");
    // // p5.noFill();
    // p5.noStroke();
    // // p5.ellipse(this.x, this.y, this.viewDistance * 2);
    //
    // if (this.elite) p5.fill("red");
    // else p5.fill("green");
    // p5.circle(this.x, this.y, TestPlayer.RADIUS * 2);
    // this.drawDecision(p5);
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
