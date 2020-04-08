// @ts-ignore
import Environment from "src/shared/env/Environment";
import EvolutionEnvironment from "./EvolutionEnvironment";
import sleep from "../base/util/sleep";

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
const simsStarted = lastRender;
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
      await sleep(0);
    }

    if (iteration % 1000 === 0) {
      console.log(
        `Simulation frameRate is ${
          iteration / ((new Date().getTime() - simsStarted) / 1000)
        }`
      );
    }

    iteration++;
    env.performTurn(ctx);
    // await sleep(100);
  }
})();
