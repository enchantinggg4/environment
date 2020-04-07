export default (label: string, block: () => void) => {
  const time1 = new Date().getTime();
  block();
  console.log(`${label} took ${new Date().getTime() - time1}`);
};
