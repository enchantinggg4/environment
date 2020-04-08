import P5 from "p5";
import RenderableConsumer from "../MessageConsumer";
import EvolutionEnvironment from "../../shared/neat-env/EvolutionEnvironment";

export interface IRenderable {
  render(p5: P5): void;
}
export default class ItemRenderer extends P5 implements RenderableConsumer {
  private items: IRenderable[] = [];

  private cx = 0;
  private cy = 0;
  private zoom = 1;
  headless: boolean = false;

  consume(items: IRenderable[]): void {
    this.items = items;
  }

  constructor(ref: HTMLElement) {
    super(() => undefined, ref);
    this.pixelDensity(1);
  }

  setup = () => {
    this.createCanvas(EvolutionEnvironment.WIDTH, EvolutionEnvironment.HEIGHT);
    // this.frameRate(30);
  };

  draw = () => {
    // this.checkDrag();
    if (this.headless) return;
    this.background(0, 0, 0);
    this.items.forEach((it: IRenderable) => it.render(this));
  };

  private checkDrag() {
    this.translate(this.cx, this.cy);
    this.scale(this.zoom);
  }

  mouseWheel(event: any): void {
    // cmd button  +zoom in out
    // if(this.keyIsDown(91)){
    this.zoom += event.delta / 1000;
    event.stopPropagation();
    event.preventDefault();
    // }
  }

  mouseDragged(event: any): void {
    this.cx += event.movementX;
    this.cy += event.movementY;
  }
}
