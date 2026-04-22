type DateInput = Date | string | number | null | undefined;

function parseDateInput(value: DateInput) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value !== "string" && typeof value !== "number") {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function formatUnknownDate() {
  return "Unknown date";
}

export function formatDateStringToDDMMHHSS(timestamp: DateInput) {
  const date = parseDateInput(timestamp);

  if (!date) {
    return formatUnknownDate();
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}-${month} ${hours}:${minutes}`;
}

export function formatDateStringToDDMM(dateInput: DateInput) {
  const date = parseDateInput(dateInput);

  if (!date) {
    return formatUnknownDate();
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const formattedDate = `${day}-${month}`;
  return formattedDate;
}

export const formatDateStringToDDMMYY = (dateInput: DateInput) => {
  const date = parseDateInput(dateInput);

  if (!date) {
    return formatUnknownDate();
  }

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

export function convertMinsToHrsMins(mins: number): string {
  const hours = Math.floor(mins / 60);
  const minutes = mins % 60;
  let time = "";
  if (mins === 0) {
    return "0m";
  }
  if (hours > 0) {
    time += `${hours}h`;
  }
  if (minutes > 0) {
    time += ` ${minutes}m`;
  }
  return time;
}

export function isDateAfter(date: DateInput, dateToCompareTo: DateInput): boolean {
  const firstDate = parseDateInput(date);
  const secondDate = parseDateInput(dateToCompareTo);

  if (!firstDate || !secondDate) {
    return false;
  }

  return firstDate.getTime() > secondDate.getTime();
}

export function formatDateStringToLongDate(dateInput: DateInput) {
  const date = parseDateInput(dateInput);

  if (!date) {
    return formatUnknownDate();
  }

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
