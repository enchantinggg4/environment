import React, { FC, useEffect, useRef, useState } from "react";
import "../App.css";
/* eslint import/no-webpack-loader-syntax:0 */
// @ts-ignore

import { observer, useLocalStore } from "mobx-react";
import HeatmapRenderer from "../render/renders/HeatmapRenderer";

const App: FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  const [render, setRender] = useState<HeatmapRenderer | null>(null);

  useEffect(() => {
    if (ref.current && !render) {
      const r = new HeatmapRenderer(ref.current);
      setRender(r);
    }
  }, [ref.current]);

  return (
    <div className="App">
      <div ref={ref} />
    </div>
  );
};

export default observer(App);
