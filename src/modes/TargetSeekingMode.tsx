import React, { FC, useEffect, useRef, useState } from "react";
import "../App.css";
import { Graph } from "react-d3-graph";
/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore

import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { observer, useLocalStore } from "mobx-react";
import {
  WebsocketMessageListener,
  WorkerMessageListener,
} from "../render/MessageListener";
import ItemRenderer from "../render/renders/ItemRenderer";
import MessageConsumer from "../render/MessageConsumer";
import P5 from "p5"
// Attach an event listener to receive calculations from your worker

const App: FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [wrk, setWorker] = useState<Worker | null>(null);

  const [render, setRender] = useState<P5 & MessageConsumer | null>(null);

  useEffect(() => {
    if (ref.current && !render) {
      const r = ItemRenderer(ref.current);

      const workerInstance = new Worker("../shared/target-env/worker", {
        name: "target-worker",
        type: "module",
      });
      setWorker(workerInstance);
      new WorkerMessageListener(workerInstance, r);

      setRender(r);
    }
    return () => {
      render?.remove();
      wrk?.terminate();
    }
  }, [ref.current]);

  return (
    <div className="App">
      <div ref={ref} />
    </div>
  );
};

export default observer(App);
