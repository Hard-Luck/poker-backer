export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}-${month} ${hours}:${minutes}`;
}

export function formatShortDate(date: Date) {

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const formattedDate = `${day}-${month}`;
  return formattedDate;
}

export function convertMinsToHrsMins(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const hourString = hours === 1 ? `${hours} hr` : `${hours} hrs`;
  const minString = minutes === 1 ? `${minutes} min` : `${minutes} mins`;
  return `${hourString} ${minString}`;
}

export function isDateAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}
