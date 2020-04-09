import P5 from "p5";
import EvolutionEnvironment from "../../shared/neat-env/EvolutionEnvironment";
import MessageConsumer from "../MessageConsumer";

export interface IRenderable {
  render(p5: P5): void;
}

const sketch = (w: number, h: number) => (p: P5) => {
  const t: P5 & any = p;
  t.items = [];
  t.headless = false;
  p.setup = () => {
    p.createCanvas(w, h);
    p.pixelDensity(1);
  };

  t.consume = (items: IRenderable[]) => {
    t.items = items;
  };

  p.draw = () => {
    if (t.headless) return;
    t.background(0);
    t.items.forEach((it: IRenderable) => it.render(p));
  };
};

export default (
  ref: HTMLElement,
  w: number = EvolutionEnvironment.WIDTH,
  h: number = EvolutionEnvironment.HEIGHT
): P5 & MessageConsumer => new P5(sketch(w, h), ref) as any;
