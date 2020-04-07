import P5 from "p5";
import generateHeatMap from "../../shared/env/util/generateHeatMap";
import Vector from "../../shared/env/util/Vector";

export default class HeatmapRenderer extends P5 {
  private generator!: (
    vecs: Vector[],
    offsetX: number,
    offsetY: number
  ) => number[][];

  private items: Vector[] = [];
  constructor(ref: HTMLElement) {
    super(() => undefined, ref);
  }

  setup = () => {
    this.createCanvas(300, 300);
    this.generator = generateHeatMap(this.width, this.height);
    this.pixelDensity(1)
  };

  renderHeatmap() {
    const heatmap = this.generator(this.items, 0, 0);

    this.loadPixels();

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const offset = x + y * this.width;
        const hmv = heatmap[y][x];

        this.pixels[offset * 4] = hmv * 255;
        this.pixels[offset * 4 + 1] = 100;
        this.pixels[offset * 4 + 2] = 100;
        this.pixels[offset * 4 + 3] = hmv * 255;
      }
    }

    this.updatePixels();
  }

  mousePressed(event?: object): void {
    this.items.push(new Vector(this.mouseX, this.mouseY));
    // console.log(this.items);
  }

  draw = () => {
    this.background(0);
    this.ellipse(this.mouseX, this.mouseY, 3, 3);
    this.renderHeatmap();
  };
}
