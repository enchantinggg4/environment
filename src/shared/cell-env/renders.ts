import { IRenderable } from "../../render/renders/ItemRenderer";
import P5 from "p5";
import CellEnvironment from "./CellEnvironment";
import Cell from "./entity/Cell";
import Vector from "../base/util/Vector";

export class CellRenderable implements IRenderable {
  x: number = 0;
  y: number = 0;
  inputs: number[] = [];
  radius: number = 0;
  energy: number = 0;
  color!: number[];
  alive: boolean = true;

  constructor(p: any) {
    Object.assign(this, p);
  }

  render(p5: P5): void {
    p5.stroke("black");
    if (!this.alive) {
      p5.stroke(0, 0, 0, 100);
      p5.fill(255, 255);
    } else {
      p5.stroke(0, 0, 0, 100);
      p5.fill([...this.color, (this.energy / Cell.MAX_ENERGY) * 255]);
    }

    p5.rect(
      this.x * CellEnvironment.SCALE,
      this.y * CellEnvironment.SCALE,
      CellEnvironment.SCALE,
      CellEnvironment.SCALE
    );
  }
}

export class GridRenderable implements IRenderable {
  grid: (number | null)[][] = [];

  constructor(p: any) {
    Object.assign(this, p);
  }

  render(p5: P5): void {
    for (let y = 0; y < this.grid.length; y++) {
      for (let x = 0; x < this.grid[y].length; x++) {
        if (this.grid[y][x] == null) {
          p5.fill("black");
        } else {
          p5.fill("green");
        }

        p5.rect(
          x * CellEnvironment.SCALE,
          y * CellEnvironment.SCALE,
          CellEnvironment.SCALE,
          CellEnvironment.SCALE
        );
      }
    }
  }
}
