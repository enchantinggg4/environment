// @ts-ignore
import Environment from "src/shared/env/Environment";
import sleep from "../base/util/sleep";
import CellEnvironment from "./CellEnvironment";

// // @ts-ignore
// self.window = self;
// // @ts-ignore
// const ctx: Worker = self as any;

// replace this with your environment implementation
const env: Environment = new CellEnvironment();
env.init();

let headless = false;


/* eslint-disable */
const ctx = self;
// @ts-ignore
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
        // @ts-ignore
        ctx.postMessage({
          type: "items",
          items: env.serializePlayers(),
        });
      }
      await sleep(0);
    }

    if (iteration % 10000 === 0) {
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
