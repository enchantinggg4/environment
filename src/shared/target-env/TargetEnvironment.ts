import Environment from "../base/Environment";
import { Postable } from "../neat-env/Postable";
import { architect, methods, Neat } from "neataptic";
import Target from "./entity/Target";
import TargetSeeker from "./entity/TargetSeeker";
import Player from "../base/player/Player";
import Cell from "../cell-env/entity/Cell";

export default class TargetEnvironment extends Environment {
  static INPUT_COUNT = 2;
  static OUTPUT_COUNT = 2;

  static WIDTH = 1200;
  static HEIGHT = 800;

  static POP_SIZE = 100;
  private neat!: Neat;

  public target!: Target;

  public players: TargetSeeker[] = [];
  private iteration: number = 0;

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

    this.players = this.neat.population.map((it) => {
      const p = new TargetSeeker(it);
      p.x = Math.random() * TargetEnvironment.WIDTH;
      p.y = Math.random() * TargetEnvironment.HEIGHT;
      return p;
    });
    this.target.x = TargetEnvironment.WIDTH / 2;
    this.target.y = TargetEnvironment.HEIGHT / 2;
  }

  init(): void {
    this.target = new Target();
    this.target.x = TargetEnvironment.WIDTH / 2;
    this.target.y = TargetEnvironment.HEIGHT / 2;
    this.neat = new Neat(
      TargetEnvironment.INPUT_COUNT,
      TargetEnvironment.OUTPUT_COUNT,
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
        popsize: TargetEnvironment.POP_SIZE,
        mutationRate: 0.3,
        elitism: Math.round(0.1 * TargetEnvironment.POP_SIZE),
        network: architect.Random(
          TargetEnvironment.INPUT_COUNT,
          1,
          TargetEnvironment.OUTPUT_COUNT
        ),
      }
    );

    this.players = this.neat.population.map((it) => {
      const p = new TargetSeeker(it);
      p.x = Math.random() * TargetEnvironment.WIDTH;
      p.y = Math.random() * TargetEnvironment.HEIGHT;
      return p;
    });
  }

  turn(ctx: Postable): void {
    this.iteration++;

    const edge = (it: Player<TargetEnvironment>) => {
      it.update(this);
      if (it.x > TargetEnvironment.WIDTH) it.x = 0;
      if (it.x < 0) it.x = TargetEnvironment.WIDTH;

      if (it.y > TargetEnvironment.HEIGHT) it.y = 0;
      if (it.y < 0) it.y = TargetEnvironment.HEIGHT;
    };

    for (let it of this.players) {
      edge(it);
    }

    edge(this.target);

    // if (this.foods.length === EvolutionEnvironment.ITERS) {
    if (this.iteration === 1000) {
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
    // @ts-ignore
    const p: Player<TargetEnvironment>[] = [this.target].concat(this.players);
    return p.map((it) => it.json);
  }


}
