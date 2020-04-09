import CellEnvironment from "../CellEnvironment";
import Player from "../../base/player/Player";
import { Network } from "neataptic";
import mapRange from "../../base/util/mapRange";
import Vector from "../../base/util/Vector";
import edge, { edgeVector } from "../../base/util/edge";

export type CellKind = "ENERGY" | "CLONE";

export default class Cell extends Player<CellEnvironment> {
  static MAX_ENERGY = 15;
  static REPRODUCTION_ENERGY = 5;

  static EAT_COST = 0.5;
  static PHOTO_COST = 0.1;
  static MINERAL_COST = 0.1;
  static NOTHING_COST = 0.2;
  static MOVE_COST = 0.5;
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
    () => this.minerals(),
    () => this.photosynthesis(),
    () => this.doMove(),
    // () => this.nothing(),
  ]);

  private actionMapper = mapRange([
    [255, 0, 0],
    [0, 0, 255],
    [0, 255, 0],
    [155, 155, 155],
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
      color: this.actionMapper(this.outputs[0]),
      type: "CELL",
    };
  }

  update(env: CellEnvironment): void {
    this.energy = Math.min(Cell.MAX_ENERGY, this.energy);
    this.calcInputs(env);
    this.outputs = this.brain.activate(this.inputs);
    const [decision, move] = this.outputs;
    this.move = move;
    this.decisionMapper(decision)!();

    this.energy -= Cell.NOTHING_COST;
    this.check();
  }

  private check() {
    if (this.energy < 0) {
      this.alive = false;
    }
    if (this.energy > Cell.REPRODUCTION_ENERGY) {
      const adj = CellEnvironment.adjMatrix.map((it) =>
        edgeVector(
          CellEnvironment.WIDTH - 1,
          CellEnvironment.HEIGHT - 1,
          this.location.add(it)
        )
      );

      let offsprings = 0;
      for (let v of adj) {
        if (this.env.get(v)) continue;
        if (offsprings < 3) {
          this.env.reproduce(this, v);
          offsprings++;
        } else break;
      }

      // if(this.energy > Cell.REPRODUCTION_ENERGY && offsprings === 0){
      //   console.log("trying reproduce...?")
      // }

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
    this.energy -= Cell.EAT_COST;
    const deadCellToEat = this.env
      .getAdjacentCells(this)
      .find((it) => it && !it.alive);
    if (deadCellToEat) {
      this.EAT_COUNT += 2;
      this.CONSUME_COUNT += 2;
      this.energy += 2;
      this.env.remove(deadCellToEat);
    }
  }

  private photosynthesis() {
    this.energy -= Cell.PHOTO_COST;
    const MAX_PHOTO_BONUS = 0.35;
    const bonus = (1 - this.y / CellEnvironment.HEIGHT) * MAX_PHOTO_BONUS;
    this.energy += bonus;
    this.PHOTO_COUNT += bonus;
    this.CONSUME_COUNT += bonus;
  }

  private minerals() {
    this.energy -= Cell.MINERAL_COST;
    const MAX_MINERAL_BONUS = 0.35;
    const bonus = (this.y / CellEnvironment.HEIGHT) * MAX_MINERAL_BONUS;
    this.energy += bonus;
    this.MINERAL_COUNT += bonus;
    this.CONSUME_COUNT += bonus;
  }

  private doMove() {
    this.energy -= Cell.MOVE_COST;
    const angle = mapRange([0, 1, 2, 3])(this.move);

    const direction: Vector = edgeVector(
      CellEnvironment.WIDTH - 1,
      CellEnvironment.HEIGHT - 1,
      this.location.add(CellEnvironment.adjMatrix[angle])
    );
    this.env.move(this, direction);
  }

  private nothing() {
    this.energy -= Cell.NOTHING_COST;
  }
}
