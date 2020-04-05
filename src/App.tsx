import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import Render from "./render/Render";

/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore
import worker from "workerize-loader?inline!./worker";
import {TestPlayerRenderable} from "./evolution-env/TestPlayer"; // eslint-disable-line no-console


const workerInstance = worker();
// Attach an event listener to receive calculations from your worker

function App() {
  const ref = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState<Render | null>(null);
  useEffect(() => {
    if (ref.current && !render) {
      const r = new Render(ref.current);
      workerInstance.addEventListener("message", (e: any) => {
        if (e.data.type === "items") {
          r.items = e.data.items.map((it: any) => new TestPlayerRenderable(it));
        }
      });
      setRender(r);
    }
  }, [ref.current]);

  return (
    <div className="App">
      <div ref={ref} />
    </div>
  );
}

export default App;
