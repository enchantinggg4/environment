import { Postable } from "../neat-env/Postable";

export default abstract class Environment {
  public lastUpdate: number = new Date().getMilliseconds();

  abstract init(): void;

  abstract turn(ctx: Postable): void;

  abstract serializePlayers(): any[];

  performTurn(ctx: Postable) {
    this.turn(ctx);
    this.lastUpdate = new Date().getTime();
  }
}
