import P5 from "p5";
import { TestPlayerRenderable } from "../evolution-env/TestPlayer";
import EvolutionEnvironment from "../evolution-env/EvolutionEnvironment";

export interface IRenderable {
  render(p5: P5): void;
}
export default class Render extends P5 {
  public items: IRenderable[] = [];

  constructor(ref: HTMLElement) {
    super(() => undefined, ref);
  }

  private getItems = async () => {
    return this.items;
  };

  setup = () => {
    this.createCanvas(EvolutionEnvironment.WIDTH, EvolutionEnvironment.HEIGHT);
    // this.frameRate(30);
  };

  draw = () => {
    this.background(0, 0, 0);
    this.items.forEach((it: IRenderable) => it.render(this));
  };
}
