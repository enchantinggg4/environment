import P5 from "p5";
import RenderableConsumer from "./MessageConsumer";

export interface IRenderable {
  render(p5: P5): void;
}
export default class Render extends P5 implements RenderableConsumer {
  private items: IRenderable[] = [];

  private cx = 0;
  private cy = 0;
  private zoom = 1;


  consume(items: IRenderable[]): void {
    this.items = items;
  }

  constructor(ref: HTMLElement) {
    super(() => undefined, ref);
  }

  private getItems = async () => {
    return this.items;
  };

  setup = () => {
    this.createCanvas(800, 800);
    // this.frameRate(30);
  };

  draw = () => {
    this.checkDrag();
    this.background(0, 0, 0);
    this.items.forEach((it: IRenderable) => it.render(this));
  };


  private checkDrag(){
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
