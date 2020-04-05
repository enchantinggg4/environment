import Environment from "../env/Environment";
import TestPlayer from "./TestPlayer";

export default class EvolutionEnvironment extends Environment {
  public players: TestPlayer[] = [];

  init() {
    this.players = new Array(5).fill(null).map((it) => {
      const p = new TestPlayer();
      p.x = Math.random() * 800;
      p.y = Math.random() * 800;
      return p;
    });
  }

  turn(): void {
    this.players.forEach((it) => {
      it.update(this);
    });
  }

  serializePlayers(): any[] {
    return this.players.map((it) => JSON.parse(JSON.stringify(it)));
  }
}
