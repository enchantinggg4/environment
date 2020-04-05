import P5 from "p5";
import Player from "../env/player/Player";
import EvolutionEnvironment from "./EvolutionEnvironment";
import Vector from "../env/util/Vector";
import { IRenderable } from "../render/Render";

export default class TestPlayer extends Player<EvolutionEnvironment> {
  static MAX_MATH = 100;

  update(env: EvolutionEnvironment): void {
    this.x += Math.random() - 0.5;
    this.y += Math.random() - 0.5;
  }
}

export class TestPlayerRenderable implements IRenderable {
  x: number = 0;
  y: number = 0;

  constructor(p: any) {
    Object.assign(this, p);
  }

  render(p5: P5): void {
    p5.fill("green");
    p5.ellipse(
      this.x,
      this.y,
      50
    );
  }
}
