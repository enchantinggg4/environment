export default (matrix: number[][]) => {
  const arr: number[] = [];
  matrix.forEach((row) => {
    row.forEach((it) => arr.push(it));
  });
  return arr;
};
