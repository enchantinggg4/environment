import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Render from "./render/Render";
import { Graph } from "react-d3-graph";
import { Node } from "neataptic";
/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore
import worker from "workerize-loader?inline!./worker";
import { TestPlayerRenderable } from "./evolution-env/TestPlayer";
import { FoodRenderable } from "./evolution-env/Food"; // eslint-disable-line no-console

const workerInstance = worker();
// Attach an event listener to receive calculations from your worker

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [network, setNetwork] = useState<any>({
    nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
    links: [
      { source: "Harry", target: "Sally" },
      { source: "Harry", target: "Alice" },
    ],
  });
  const [render, setRender] = useState<Render | null>(null);
  const [headless, setHeadless] = useState(false);
  useEffect(() => {
    if (ref.current && !render) {
      const r = new Render(ref.current);
      workerInstance.addEventListener("message", (e: any) => {
        if (e.data.type === "items") {
          r.items = e.data.items.map((it: any) => {
            if (it.type === "FOOD") {
              return new FoodRenderable(it);
            } else {
              return new TestPlayerRenderable(it);
            }
          });
        } else if (e.data.type === "best") {
          const example: any = e.data.best;

          // {
          //   nodes: [
          //     { bias: 0, type: "input", squash: "LOGISTIC", mask: 1, index: 0 },
          //     { bias: 0, type: "input", squash: "LOGISTIC", mask: 1, index: 1 },
          //     { bias: 0, type: "input", squash: "LOGISTIC", mask: 1, index: 2 },
          //     { bias: 0, type: "input", squash: "LOGISTIC", mask: 1, index: 3 },
          //     {
          //       bias: -0.095487706381563,
          //       type: "hidden",
          //       squash: "GAUSSIAN",
          //       mask: 1,
          //       index: 4,
          //     },
          //     {
          //       bias: 0.04862687405984173,
          //       type: "output",
          //       squash: "LOGISTIC",
          //       mask: 1,
          //       index: 5,
          //     },
          //     {
          //       bias: 0.02526666663829752,
          //       type: "output",
          //       squash: "LOGISTIC",
          //       mask: 1,
          //       index: 6,
          //     },
          //   ],
          //     connections: [
          //   { weight: 2.808843296986469, from: 0, to: 5, gater: null },
          //   { weight: 1.706239555801526, from: 0, to: 6, gater: null },
          //   { weight: 2.801117518212109, from: 1, to: 5, gater: null },
          //   { weight: 1.5166937543434595, from: 2, to: 5, gater: null },
          //   { weight: 0.5415428941610785, from: 2, to: 6, gater: null },
          //   { weight: 2.7630112571062284, from: 3, to: 5, gater: null },
          //   { weight: 0.6431568425966637, from: 3, to: 6, gater: null },
          //   { weight: -0.0725659767963077, from: 1, to: 4, gater: null },
          //   { weight: 0.02124721517906676, from: 4, to: 6, gater: null },
          //   { weight: -0.05385433105393309, from: 0, to: 4, gater: null },
          // ],
          //   input: 4,
          //   output: 2,
          //   dropout: 0,
          // }

          const formatted = {
            nodes: example.nodes.map((it: any, index: number) => {
              return {
                id: it.index,
                label: `${it.type} ${it.bias}`,
              };
            }),
            links: example.connections.map((it: any) => ({
              source: it.from,
              target: it.to,
              label: it.weight,
            })),
          };
          setNetwork(formatted);
        }
      });
      setRender(r);
    }
  }, [ref.current]);

  return (
    <div className="App">
      <button
        onClick={() => {
          setHeadless(!headless);
          if (headless && render) {
            render.items = [];
          }
          workerInstance.postMessage({
            headless: !headless,
          });
        }}
      >
        {headless ? "Turn off" : "Turn on"} headless
      </button>
      <div ref={ref} />
      <Graph
        id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
        data={network}
        config={{
          nodeHighlightBehavior: true,
          directed: true,
          node: {
            color: "lightgreen",
            size: 120,
            highlightStrokeColor: "blue",
            labelProperty: "label",
          },
          link: {
            highlightColor: "lightblue",
            labelProperty: "label",
          },
        }}
      />
    </div>
  );
}

export default App;
