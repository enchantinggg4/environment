import { GPU } from "gpu.js";
import Vector from "./Vector";

const gpu = new GPU();
//
const generateMatrices = (w: number, h: number) => {
  const matrices: number[][] = [];
  for (let y = 0; y < h; y++) {
    matrices.push([]);
    for (let x = 0; x < w; x++) {
      matrices[y].push(0);
    }
  }
  return matrices;
};

export default (
  width: number,
  height: number,
  sliceW: number = width,
  sliceH: number = height
) => {
  const generatedEmptyMatrix = generateMatrices(sliceW, sliceH);

  const kern = gpu
    .createKernel(function (
      vecs: number[][],
      points: number,
      w: number,
      h: number,
      sliceW: number,
      sliceH: number,
      offsetX: number,
      offsetY: number
    ) {
      const sqrD = Math.sqrt(w * w + h * h);
      let avrgDist = 0;

      for (let indexOfV = 0; indexOfV < points; indexOfV++) {
        const [pX, pY] = vecs[indexOfV];
        const diffX = this.thread.x + offsetX - pX;
        const diffY = this.thread.y!! + offsetY - pY;

        avrgDist += Math.sqrt(diffX * diffX + diffY * diffY);
      }
      avrgDist /= points;
      return 1 - avrgDist / sqrD;
    })
    .setOutput([sliceW, sliceH])
    .setDynamicArguments(true);

  return (vecs: Vector[], offsetX: number, offsetY: number): number[][] => {
    if (vecs.length === 0) return generatedEmptyMatrix;
    const matrix = vecs.map((it) => [it.x, it.y]);
    return kern(
      matrix,
      matrix.length,
      width,
      height,
      sliceW,
      sliceH,
      offsetX,
      offsetY
    ) as any;
  };
};
