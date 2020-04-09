import CellEnvironment from "../CellEnvironment";
import Player from "../../base/player/Player";
import { Network } from "neataptic";
import mapRange from "../../base/util/mapRange";
import Vector from "../../base/util/Vector";
import edge, { edgeVector } from "../../base/util/edge";

export type CellKind = "ENERGY" | "CLONE";

export default class Cell extends Player<CellEnvironment> {
  static MAX_ENERGY = 10;
  static REPRODUCTION_ENERGY = 5;
  radius: number = 10;
  x: number = 0;
  y: number = 0;
  energy: number = 1;

  alive: boolean = true;
  private inputs: number[] = [];
  private outputs: number[] = [];

  private CONSUME_COUNT = 1;
  private PHOTO_COUNT = 0;
  private EAT_COUNT = 0;
  private MINERAL_COUNT = 0;

  private move = 0;

  private decisionMapper = mapRange([
    () => this.eat(),
    () => this.photosynthesis(),
    () => this.minerals(),
    () => this.doMove(),
  ]);

  constructor(private env: CellEnvironment, public brain: Network) {
    super();
  }

  get json(): any {
    return {
      radius: this.radius,
      energy: this.energy,
      x: this.x,
      alive: this.alive,
      inputs: this.inputs,
      outputs: this.outputs,
      y: this.y,
      eatRatio: this.EAT_COUNT / this.CONSUME_COUNT,
      photoRatio: this.PHOTO_COUNT / this.CONSUME_COUNT,
      mineralRation: this.MINERAL_COUNT / this.CONSUME_COUNT,
      type: "CELL",
    };
  }

  update(env: CellEnvironment): void {
    this.energy = Math.min(Cell.MAX_ENERGY, this.energy);
    this.calcInputs(env);
    this.energy -= 0.15;
    const [decision, move] = this.brain.activate(this.inputs);
    this.move = move;
    this.decisionMapper(decision)!();

    this.check();
  }

  private check() {
    if (this.energy < 0) {
      this.alive = false;
    }
    if (this.energy > Cell.REPRODUCTION_ENERGY) {
      const adjMatrix = [
        new Vector(1, 0), // right
        new Vector(0, 1), // bottom
        new Vector(-1, 0), // left
        new Vector(0, -1), // top
      ].map((it) =>
        edgeVector(
          CellEnvironment.WIDTH - 1,
          CellEnvironment.HEIGHT - 1,
          it.add(this.location)
        )
      );

      let offsprings = 0;
      for (let v of adjMatrix) {
        if (this.env.get(v)) continue;
        if (offsprings < 3) {
          this.env.reproduce(this, v);
          offsprings++;
        } else break;
      }

      if (offsprings > 0) this.energy -= Cell.REPRODUCTION_ENERGY;
    }
  }

  private calcInputs(env: CellEnvironment) {
    const inputs = [];
    const neighbourInputs = env.getAdjacentCells(this);

    // [has_cell, alive]
    for (let n of neighbourInputs) {
      if (!n) {
        inputs.push(0, 0);
      } else if (n.alive) {
        //alive
        inputs.push(1, 1);
      } else {
        inputs.push(1, 0);
      }
    }
    this.inputs.push(this.energy / Cell.MAX_ENERGY);
    this.inputs.push(this.y / CellEnvironment.HEIGHT);
    this.inputs = inputs;
  }

  private eat() {
    const deadCellToEat = this.env
      .getAdjacentCells(this)
      .find((it) => it && !it.alive);
    if (deadCellToEat) {
      this.EAT_COUNT += 3;
      this.CONSUME_COUNT += 3;
      this.energy += 3;
      this.env.remove(deadCellToEat);
    }
  }

  private photosynthesis() {
    const MAX_PHOTO_BONUS = 0.2;
    const bonus = (1 - this.y / CellEnvironment.HEIGHT) * MAX_PHOTO_BONUS;
    this.energy += bonus;
    this.PHOTO_COUNT += bonus;
    this.CONSUME_COUNT += bonus;
  }

  private minerals() {
    const MAX_MINERAL_BONUS = 0.5;
    const bonus = (this.y / CellEnvironment.HEIGHT) * MAX_MINERAL_BONUS;
    this.energy += bonus;
    this.MINERAL_COUNT += bonus;
    this.CONSUME_COUNT += bonus;
  }

  private doMove() {
    const angle = mapRange([0, 1, 2, 3])(this.move);

    const adjMatrix = [
      new Vector(1, 0), // right
      new Vector(0, 1), // bottom
      new Vector(-1, 0), // left
      new Vector(0, -1), // top
    ];

    const direction: Vector = edgeVector(
      CellEnvironment.WIDTH - 1,
      CellEnvironment.HEIGHT - 1,
      this.location.add(adjMatrix[angle])
    );
    this.env.move(this, direction);
  }
}
