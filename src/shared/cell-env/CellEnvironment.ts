import Environment from "../base/Environment";
import { Postable } from "../neat-env/Postable";
import { architect, methods, Network } from "neataptic";
import Player from "../base/player/Player";
import Cell from "./entity/Cell";
import Vector from "../base/util/Vector";
import snap from "../base/util/snap";
import edge, { edgeVector } from "../base/util/edge";

export default class CellEnvironment extends Environment {
  static adjMatrix = [
    new Vector(1, 0), // right
    new Vector(0, 1), // bottom
    new Vector(-1, 0), // left
    new Vector(0, -1), // top
  ];
  // 4 neighbours * 2 + energy + height
  static INPUT_COUNT = CellEnvironment.adjMatrix.length * 2 + 1 + 1;
  static OUTPUT_COUNT = 2;

  static SCALE = 10;

  static WIDTH = 100;
  static HEIGHT = 80;

  static POP_SIZE = 100;
  // static POP_SIZE = 1;

  public players: Cell[] = [];
  private iteration: number = 0;

  private static MUTATIONS = [
    methods.mutation.ADD_NODE,
    methods.mutation.SUB_NODE,
    methods.mutation.ADD_CONN,
    methods.mutation.SUB_CONN,
    methods.mutation.MOD_WEIGHT,
    methods.mutation.MOD_BIAS,
    methods.mutation.MOD_ACTIVATION,
    methods.mutation.ADD_GATE,
    methods.mutation.SUB_GATE,
    methods.mutation.ADD_SELF_CONN,
    methods.mutation.SUB_SELF_CONN,
    methods.mutation.ADD_BACK_CONN,
    methods.mutation.SUB_BACK_CONN,
  ];

  private grid: (Cell | null)[][] = [];

  private static MUTATION_RATE = 0.3;

  constructor() {
    super();
  }

  init(basePop: Cell[] = []): void {
    this.grid = [];
    for (let y = 0; y < CellEnvironment.HEIGHT; y++) {
      const row = [];
      for (let x = 0; x < CellEnvironment.WIDTH; x++) {
        row.push(null);
      }
      this.grid.push(row);
    }
    this.players = new Array(CellEnvironment.POP_SIZE).fill(null).map(() => {
      const brain = architect.Random(
        CellEnvironment.INPUT_COUNT,
        0,
        CellEnvironment.OUTPUT_COUNT
      );
      const p = new Cell(this, brain);
      p.x = Math.floor(Math.random() * CellEnvironment.WIDTH);
      // p.x = 0
      p.y = Math.floor(Math.random() * CellEnvironment.HEIGHT);
      // p.y = 0
      p.energy = Cell.MAX_ENERGY;
      this.put(p.location, p);
      return p;
    });
  }

  turn(ctx: Postable): void {
    this.iteration++;

    for (let it of this.players) {
      edge(CellEnvironment.WIDTH, CellEnvironment.HEIGHT, it);
      if (!it.alive) {
        if (
          it.y !== CellEnvironment.HEIGHT - 1 &&
          !this.get(new Vector(it.x, it.y + 1))
        ) {
          this.move(it, new Vector(it.x, it.y + 1));
        }
        continue;
      }
      it.update(this);
      it.location = snap(it.location, 1, 1);
    }

    if (!this.players.find((it) => it.alive)) {
      this.init();
    }
  }

  serializePlayers(): any[] {
    // @ts-ignore
    const p: Player<CellEnvironment>[] = this.players;
    return p.map((it) => it.json);
  }

  getAdjacentCells(param: Cell): (Cell | null)[] {
    return CellEnvironment.adjMatrix
      .map((it) =>
        edgeVector(
          CellEnvironment.WIDTH - 1,
          CellEnvironment.HEIGHT - 1,
          it.copy().add(param.location)
        )
      )
      .map((it) => this.get(it));
  }

  remove(deadCellToEat: Cell) {
    this.players.splice(this.players.indexOf(deadCellToEat), 1);
    this.put(deadCellToEat.location, null);
  }

  reproduce(cell: Cell, v: Vector) {
    const network = Network.fromJSON(cell.brain.toJSON());
    const newCell = new Cell(this, network);
    newCell.energy = 2;
    newCell.location = v;
    // @ts-ignore
    if (Math.random() <= CellEnvironment.MUTATION_RATE) {
      // @ts-ignore
      for (let j = 0; j < CellEnvironment.MUTATIONS.length; j++) {
        const mutationMethod = this.selectMutationMethod();
        network.mutate(mutationMethod);
      }
    }
    this.players.push(newCell);
    this.put(v, newCell);
  }

  private selectMutationMethod() {
    return CellEnvironment.MUTATIONS[
      Math.floor(Math.random() * CellEnvironment.MUTATIONS.length)
    ];
  }

  put(v: Vector, cell: Cell | null) {
    this.grid[v.y][v.x] = cell;
  }

  get(v: Vector): Cell | null {
    try {
      return this.grid[v.y][v.x];
    } catch (e) {
      console.log(v);
      throw "We got it";
    }
  }

  move(param: Cell, toCell: Vector) {
    if (!this.get(toCell)) {
      this.put(param.location, null);
      param.location = toCell;
      this.put(toCell, param);
    }
  }
}
