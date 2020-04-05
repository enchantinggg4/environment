import Player from "../env/player/Player";
import EvolutionEnvironment from "./EvolutionEnvironment";
import { IRenderable } from "../render/Render";
import P5 from "p5";
export default class Food extends Player<EvolutionEnvironment> {
  alive: boolean = true;

  get json(): any {
    return {
      type: "FOOD",
      x: this.x,
      y: this.y,
      alive: this.alive,
    };
  }

  update(env: EvolutionEnvironment): void {}
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
