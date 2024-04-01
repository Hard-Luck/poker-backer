export function formatTimestamp(timestamp: string) {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}-${month} ${hours}:${minutes}`;
}

export function formatShortDate(date: Date) {
  if (!date || !(date instanceof Date)) return "";
  const day = String(date.getUTCDay()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const formattedDate = `${day}-${month}`;
  return formattedDate;
}

export const formatLongDateWithTime = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function convertMinsToHrsMins(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  const hourString = hours === 1 ? `${hours} hr` : `${hours} hrs`;
  const minString = minutes === 1 ? `${minutes}` : `${minutes}`;
  return `${hourString === "0 hrs" ? "" : hourString} ${
    minutes === 0 ? "" : minString
  }`;
}

export function isDateAfter(date1: Date, date2: Date): boolean {
  return date1.getTime() > date2.getTime();
}

export function formatLongDate(date: Date) {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daySuffix = getDaySuffix(day);

  const monthName = monthNames[monthIndex] || "";

  const formattedDate = `${day}${daySuffix} of ${monthName} ${year}`;
  return formattedDate;
}

function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }

  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
