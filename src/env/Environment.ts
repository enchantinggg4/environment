import Player from "./player/Player";

export default abstract class Environment {
  public lastUpdate: number = new Date().getMilliseconds();

  abstract init(): void;

  abstract turn(ctx: Worker): void;

  abstract serializePlayers(): any[]

  performTurn(ctx: Worker) {
    this.turn(ctx);
    this.lastUpdate = new Date().getTime();
  }
}
