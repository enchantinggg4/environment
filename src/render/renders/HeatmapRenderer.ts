import P5 from "p5";
import Vector from "../../shared/base/util/Vector";
import generateHeatMap from "../../shared/base/util/generateHeatMap";

const sketch = (p: P5) => {
  const t: P5 & any = p;
  t.items = [new Vector(50, 50)];
  p.setup = () => {
    p.createCanvas(800, 800);
    t.generator = generateHeatMap(t.width, t.width);
    p.pixelDensity(1);
  };

  t.renderHeatmap = () => {
    console.log("yeah i do this shit...")
    const heatmap = t.generator(t.items, 0, 0, 1000);

    t.loadPixels();

    for (let y = 0; y < t.height; y++) {
      for (let x = 0; x < t.width; x++) {
        const offset = x + y * t.width;
        const hmv = heatmap[y][x];

        t.pixels[offset * 4] = hmv * 255;
        t.pixels[offset * 4 + 1] = 0;
        t.pixels[offset * 4 + 2] = 0;
        t.pixels[offset * 4 + 3] = (1 - hmv) * 100;
      }
    }

    p.updatePixels()
  };
  p.mouseDragged = () => {
    t.items.push(new Vector(t.mouseX, t.mouseY));
  };

  p.mousePressed = () => {
    t.items.push(new Vector(t.mouseX, t.mouseY));
  };

  p.draw = () => {
    t.background(0);
    t.items[0] = new Vector(t.mouseX, t.mouseY);
    t.renderHeatmap();
  };
};

export default (ref: HTMLElement) => new P5(sketch, ref);
