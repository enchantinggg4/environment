export default <T>(range: T[], maxVal: number = 1) => {
  return (val: number): T => {
    for (let i = 0; i < range.length; i++) {
      const start = (i / range.length) * maxVal;
      const end = ((i + 1) / range.length) * maxVal;
      if (val >= start && val < end) {
        return range[i];
      }
    }
    return range[range.length - 1];
  };
};
