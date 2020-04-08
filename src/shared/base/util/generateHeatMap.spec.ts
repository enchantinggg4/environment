// @ts-ignore
import generateHeatMap, { testFun } from "./generateHeatMap";
import Vector from "./Vector";

/**
 * [
 *  [0.75,0.84375,0.875,0.84375],
 *  [0.75,0.59375,0.375,0.09375],
 *  [-0.25,-0.65625,-1.125,-1.65625],
 *  [-2.25,-2.90625,-3.625,-4.40625]
 * ]
 */
describe("heatmap", () => {
  it("test heatmap 4x4", () => {
    const d = [
      new Vector(2, 2),
      new Vector(3, 3),
      new Vector(1, 3),

    ];
    const w = 4;
    const h = 4;
    const gen = generateHeatMap(w, h);
    let some = gen(d, 0, 0);
    console.log(some)
    // expect(some).toEqual([
    //   Float32Array.from([0.75, 0.84375, 0.875, 0.84375]),
    //   Float32Array.from([0.84375, 0.9375, 0.96875, 0.9375]),
    //   Float32Array.from([0.875, 0.96875, 1.0, 0.96875]),
    //   Float32Array.from([0.84375, 0.9375, 0.96875, 0.9375]),
    // ]);
  });

  it("test slice of heatmap 4x4", () => {
    const d = [new Vector(2, 2)];

    const some = generateHeatMap(4, 4, 2, 2)(d, 0, 0);
    expect(some).toEqual([
      Float32Array.from([0.75, 0.84375]),
      Float32Array.from([0.84375, 0.9375]),
    ]);
  });

  it("test slice with offset of heatmap 4x4", () => {
    const d = [new Vector(2, 2)];

    const some = generateHeatMap(4, 4, 2, 2)(d, 1, 1);
    expect(some).toEqual([
      Float32Array.from([0.9375, 0.96875]),
      Float32Array.from([0.96875, 1.0]),
    ]);
  })
});
