import Environment from "./env/Environment";
import sleep from "./env/util/sleep";
import EvolutionEnvironment from "./evolution-env/EvolutionEnvironment";

// @ts-ignore
self.window = self;
const ctx: Worker = self as any;

// replace this with your environment implementation
const env: Environment = new EvolutionEnvironment();
env.init();

const runner = (async () => {
  let iteration = 0;
  while (true) {
    iteration++;
    env.turn();
    await sleep(25);

    ctx.postMessage({
      type: "items",
      items: env.serializePlayers(),
    });
  }
})();
