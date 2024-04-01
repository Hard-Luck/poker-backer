export function sumValues(percentages: { [key: string]: string }) {
  return Object.values(percentages).reduce((acc, value) => {
    return acc + +value;
  }, 0);
}
