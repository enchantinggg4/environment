import Player from "./player/Player";

export default abstract class Environment {
  public lastUpdate: number = new Date().getMilliseconds();

  abstract init(): void;

  abstract turn(): void;

  abstract serializePlayers(): any[]

  performTurn() {
    this.lastUpdate = new Date().getMilliseconds();
  }
}
