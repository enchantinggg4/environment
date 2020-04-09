import P5 from "p5";
import RenderableConsumer from "../MessageConsumer";
import EvolutionEnvironment from "../../shared/neat-env/EvolutionEnvironment";
import Vector from "../../shared/base/util/Vector";
import generateHeatMap from "../../shared/base/util/generateHeatMap";
import MessageConsumer from "../MessageConsumer";

export interface IRenderable {
  render(p5: P5): void;
}

const sketch = (p: P5) => {
  const t: P5 & any = p;
  t.items = [];
  t.headless = false;
  p.setup = () => {
    p.createCanvas(EvolutionEnvironment.WIDTH, EvolutionEnvironment.HEIGHT);
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

export default (ref: HTMLElement): P5 & MessageConsumer =>
  new P5(sketch, ref) as any;
