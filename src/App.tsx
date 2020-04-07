import React, { FC, useEffect, useRef, useState } from "react";
import "./App.css";
import Render from "./render/Render";
import { Graph } from "react-d3-graph";
/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore
import worker from "workerize-loader?inline!./worker";
import {
  WebsocketMessageListener,
  WorkerMessageListener,
} from "./render/MessageListener";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { observer, useLocalStore } from "mobx-react";

// Attach an event listener to receive calculations from your worker

const App: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [wrk, setWorker] = useState<Worker | null>(null);

  const stats = useLocalStore(() => [
    {
      average: 0,
      best: 0,
      page: "Stats",
    },
  ]);
  const [network, setNetwork] = useState<any>({
    nodes: [{ id: "Harry" }],
    links: [],
  });
  const [generation, setGeneration] = useState(0);
  const [render, setRender] = useState<Render | null>(null);
  const [headless, setHeadless] = useState(false);

  const handleGenerationFinished = (e: any) => {
    if (e.data.type === "generationFinished") {
      const example: any = e.data.best;
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
      setGeneration(e.data.generation);
      stats.push({
        average: e.data.averageScore,
        best: e.data.bestScore,
        page: "Stats",
      });
    }
  };

  useEffect(() => {
    if (ref.current && !render) {
      const r = new Render(ref.current);

      const useWorker = true;

      if (useWorker) {
        const workerInstance = worker();
        setWorker(workerInstance);
        new WorkerMessageListener(workerInstance, r);

        workerInstance.addEventListener("message", handleGenerationFinished);
      } else {
        // const ws = new WebSocket("ws://localhost:8080/socket");
        const ws = new WebSocket("ws://89.223.53.11:8080/socket");

        new WebsocketMessageListener(ws, r);
      }
      setRender(r);
    }
  }, [ref.current]);

  const data = [...stats];

  return (
    <div className="App">
      <button
        onClick={() => {
          setHeadless(!headless);
          if (headless && render) {
            render.consume([]);
          }
          if (wrk)
            wrk.postMessage({
              headless: !headless,
            });
        }}
      >
        {headless ? "Turn off" : "Turn on"} headless
      </button>
      <div ref={ref} />
      <h1>Generation {generation}</h1>
      <LineChart width={1200} height={600} data={data}>
        <Line isAnimationActive={false} type="monotone" dataKey="best" stroke="red" />
        <Line isAnimationActive={false} type="monotone" dataKey="average" stroke="#8884d8" />
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="name" />
        <YAxis />
      </LineChart>
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
};

export default observer(App);
