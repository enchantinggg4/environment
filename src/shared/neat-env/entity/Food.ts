import Player from "../../base/player/Player";
import EvolutionEnvironment from "../EvolutionEnvironment";

export default class Food extends Player<EvolutionEnvironment> {
  alive: boolean = true;
  radius = 5;
  x = 0;
  y = 0;

  get json(): any {
    return {
      type: "FOOD",
      x: this.x,
      radius: this.radius,
      y: this.y,
      alive: this.alive,
    };
  }

  update(env: EvolutionEnvironment): void {}
}


