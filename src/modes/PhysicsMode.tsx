import React, { FC, useEffect, useRef, useState } from "react";
import "../App.css";
/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore

import { observer, useLocalStore } from "mobx-react";
import HeatmapRenderer from "../render/renders/HeatmapRenderer";
import P5 from "p5";

const App: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [render, setRender] = useState<P5 | null>(null);

  useEffect(() => {
    if (ref.current && !render) {
      const r = HeatmapRenderer(ref.current);
      setRender(r);
    }


    return () => {
      console.log("Removing sketch!!!")
      render?.remove()
    }
  }, [ref.current]);

  return (
    <div className="App">
      <div id={"physics-mode"} ref={ref} />
    </div>
  );
};

export default observer(App);
