import Vector from "./Vector";
import flattenMatrix from "./flattenMatrix";

describe("some", () => {
  it("test slice with offset of heatmap 4x4", () => {
    const some = [
      [0.9375, 0.96875],
      [0.96875, 1.0],
    ];

    console.log(flattenMatrix(some));
  });
});
