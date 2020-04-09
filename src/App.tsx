import { useState } from "react";
import * as React from "react";
import EvolutionMode from "./modes/EvolutionMode";
import PhysicsMode from "./modes/PhysicsMode";
import FlockMode from "./modes/FlockMode";
import TargetSeekingMode from "./modes/TargetSeekingMode";

const Page = ({ index }: any) => {
  if (index === 0) return <EvolutionMode />;
  else if (index === 1) return <PhysicsMode />;
  else if (index === 2) return <FlockMode />;
  else if (index === 3) return <TargetSeekingMode />;
  else return null;
};

export default () => {
  const [page, setPage] = useState(0);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <p style={{ padding: 8, fontSize: 16 }} onClick={() => setPage(0)}>Evolution</p>
        <p style={{ padding: 8, fontSize: 16 }} onClick={() => setPage(1)}>Heatmap</p>
        <p style={{ padding: 8, fontSize: 16 }} onClick={() => setPage(2)}>Flock</p>
        <p style={{ padding: 8, fontSize: 16 }} onClick={() => setPage(3)}>Target seeking</p>
      </div>
      <div>
        <Page index={page} />
      </div>
    </div>
  );
};
