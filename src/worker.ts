import Environment from "./env/Environment";
import sleep from "./env/util/sleep";
import EvolutionEnvironment from "./evolution-env/EvolutionEnvironment";

// @ts-ignore
self.window = self;
const ctx: Worker = self as any;

// replace this with your environment implementation
const env: Environment = new EvolutionEnvironment();
env.init();

let headless = false;

ctx.addEventListener("message", (e) => {
  if ("headless" in e.data) {
    headless = e.data.headless;
  }
});

let lastRender = new Date().getTime();
const runner = (async () => {
  let iteration = 0;
  while (true) {
    const delta = env.lastUpdate - lastRender > 33;

    if (delta) {
      lastRender = new Date().getTime();
      if (!headless) {
        ctx.postMessage({
          type: "items",
          items: env.serializePlayers(),
        });
      }
    }

    iteration++;
    env.performTurn(ctx);
    await sleep(0);
  }
})();
