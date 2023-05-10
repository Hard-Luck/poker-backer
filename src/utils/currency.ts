export function formatCurrency(number: number) {
  if (number === 0) {
    return "0";
  }

  const formattedNumber = Math.abs(number);
  const prefix = number < 0 ? "-" : "";

  return `${prefix}£${formattedNumber}`;
}
