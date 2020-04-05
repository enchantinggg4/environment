import Environment from "../env/Environment";
import TestPlayer from "./TestPlayer";
import { Neat, architect, methods } from "neataptic";
import Food from "./Food";
import Player from "../env/player/Player";

export default class EvolutionEnvironment extends Environment {
  static WIDTH = 1600;
  static HEIGHT = 1200;
  static INPUT_FOOD_COUNT = 3;
  static INPUT_COUNT = EvolutionEnvironment.INPUT_FOOD_COUNT * 2;
  static POP_SIZE = 50;
  static OUTPUT_COUNT = 2;
  static ITERS = 1000;

  static FOOD_PER_PLAYER = 10;

  private _players: TestPlayer[] = [];
  private _foods: Food[] = [];

  public get foods(): Food[] {
    return this._foods.filter((it) => it.alive);
  }

  public get players(): TestPlayer[] {
    return this._players;
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
      newPopulation.push(this.neat.population[i]);
    }

    // Breed the next individuals
    for (let i = 0; i < this.neat.popsize - this.neat.elitism; i++) {
      newPopulation.push(this.neat.getOffspring());
    }

    console.log(
      "Generation ",
      this.neat.generation,
      "finished. Best is ",
      this.neat.population[0].score
    );

    // Replace the old population with the new population
    this.neat.population = newPopulation;
    this.neat.mutate();
    this.neat.generation++;

    this.initFoods();
    this._players.forEach((it) => (it.brain.score = 0));
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

  turn(ctx: Worker): void {
    this.iteration++;
    this._players.forEach((it) => {
      it.update(this);
      if (it.x > EvolutionEnvironment.WIDTH) it.x = 0;
      if (it.x < 0) it.x = EvolutionEnvironment.WIDTH;

      if (it.y > EvolutionEnvironment.HEIGHT) it.y = 0;
      if (it.y < 0) it.y = EvolutionEnvironment.HEIGHT;
    });
    this._foods.forEach((it) => {
      it.update(this);
    });
    if (this.iteration === EvolutionEnvironment.ITERS) {
      this.iteration = 0;
      ctx.postMessage({
        type: "best",
        best: (() => {
          this.neat.sort();
          return this.neat.population[0].toJSON();
        })(),
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
