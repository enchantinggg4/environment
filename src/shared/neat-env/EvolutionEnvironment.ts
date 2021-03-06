import Environment from "../base/Environment";
import TestPlayer from "./entity/TestPlayer";
import Food from "./entity/Food";
import {architect, methods, Neat} from "neataptic";
import {Postable} from "./Postable";
import Player from "../base/player/Player";


export default class EvolutionEnvironment extends Environment {
  static WIDTH = 1200;
  static HEIGHT = 800;
  static INPUT_FOOD_COUNT = 3;
  static INPUT_COUNT = EvolutionEnvironment.INPUT_FOOD_COUNT * 2;
  static POP_SIZE = 50;
  static OUTPUT_COUNT = 3;
  static TIMEOUT_ITERS = 5000;

  static FOOD_PER_PLAYER = 3;

  private _players: TestPlayer[] = [];
  private _foods: Food[] = [];

  public get foods(): Food[] {
    return this._foods.filter((it) => it.alive);
  }

  public get players(): TestPlayer[] {
    return this._players;
  }

  constructor() {
    super();
  }

  private iteration: number = 0;

  private neat!: Neat;

  private initFoods() {
    this._foods = [];
    for (
      let i = 0;
      i < this._players.length * EvolutionEnvironment.FOOD_PER_PLAYER;
      i++
    ) {
      const f = new Food();
      f.x = Math.random() * EvolutionEnvironment.WIDTH;
      f.y = Math.random() * EvolutionEnvironment.HEIGHT;
      this._foods.push(f);
    }
  }

  private endEvaluation() {
    this.neat.sort();
    const newPopulation = [];

    // Elitism
    for (let i = 0; i < this.neat.elitism; i++) {
      const elite: any = this.neat.population[i];
      elite.elite = true;
      newPopulation.push(elite);
    }

    // Breed the next individuals
    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newPopulation.push(this.neat.getOffspring());
    }

    console.log(
      "Generation ",
      this.neat.generation,
      "finished. Best is ",
      this.neat.population[0].score,
      "Average is",
      this.neat.getAverage()
    );

    // Replace the old population with the new population
    this.neat.population = newPopulation;
    this.neat.mutate();
    this.neat.generation++;

    this.initFoods();
    this._players = this.neat.population.map((it) => {
      const p = new TestPlayer(it);
      p.x = Math.random() * EvolutionEnvironment.WIDTH;
      p.y = Math.random() * EvolutionEnvironment.HEIGHT;
      return p;
    });
  }

  init() {
    this.neat = new Neat(
      EvolutionEnvironment.INPUT_COUNT,
      EvolutionEnvironment.OUTPUT_COUNT,
      null,
      {
        mutation: [
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
        ],
        popsize: EvolutionEnvironment.POP_SIZE,
        mutationRate: 0.3,
        elitism: Math.round(0.1 * EvolutionEnvironment.POP_SIZE),
        network: architect.Random(
          EvolutionEnvironment.INPUT_COUNT,
          1,
          EvolutionEnvironment.OUTPUT_COUNT
        ),
      }
    );
    this._players = this.neat.population.map((it) => {
      const p = new TestPlayer(it);
      p.x = Math.random() * 800;
      p.y = Math.random() * 800;
      return p;
    });
    this.initFoods();
  }

  turn(ctx: Postable): void {
    this.iteration++;

    for (let it of this._players) {
      it.update(this);
      if (it.x > EvolutionEnvironment.WIDTH) it.x = 0;
      if (it.x < 0) it.x = EvolutionEnvironment.WIDTH;

      if (it.y > EvolutionEnvironment.HEIGHT) it.y = 0;
      if (it.y < 0) it.y = EvolutionEnvironment.HEIGHT;
    }
    for (let it of this._foods) {
      it.update(this);
    }

    // if (this.foods.length === EvolutionEnvironment.ITERS) {
    if (this.foods.length === 0 || this.iteration === EvolutionEnvironment.TIMEOUT_ITERS) {
      this.iteration = 0;
      ctx.postMessage({
        type: "generationFinished",
        best: (() => {
          this.neat.sort();
          return this.neat.population[0].toJSON();
        })(),
        averageScore: this.neat.getAverage(),
        generation: this.neat.generation,
        bestScore: this.neat.population[0].score,
      });
      this.endEvaluation();
    }
  }

  serializePlayers(): any[] {
    const p: Player<EvolutionEnvironment>[] = (this._players as Player<
      EvolutionEnvironment
    >[]).concat(this._foods);
    return p.map((it) => it.json);
  }
}
