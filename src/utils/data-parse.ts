import { getBackingHistory } from "@/models/backing";

type FullBackingForDownload = Awaited<ReturnType<typeof getBackingHistory>>;
type Transaction = "chop" | "session" | "topUp";
type CSVRow = [
  Date,
  Transaction,
  string,
  number | "n/a",
  number,
  number,
  number,
];

export function parseBackingHistoryToCsv(
  backingHistory: FullBackingForDownload
) {
  if (!backingHistory) {
    return "";
  }
  const headers = [
    "Date",
    "Type",
    "Name",
    "length",
    "Value",
    "Float Balance",
    "Makeup",
  ];
  const rows = formatTransactions(backingHistory);
  sortTransactions(rows);
  updateFloatBalance(rows, backingHistory.float);
  let csv = `name,${backingHistory.name},float:,${backingHistory.float},${new Date()}\n`;
  csv += headers.join(",") + "\n";
  csv += rows.map(row => row.join(",")).join("\n");

  return csv;
}

function formatTransactions(
  backingHistory: NonNullable<FullBackingForDownload>
) {
  const users: Record<string, string> = {};
  backingHistory.access.forEach(access => {
    users[access.user_id] = access.user.username;
  });
  const transactions: CSVRow[] = [];
  backingHistory.session.forEach(session => {
    transactions.push([
      session.created_at,
      "session",
      users[session.user_id],
      session.length ?? "n/a",
      session.amount,
      0,
      0,
    ]);
  });
  backingHistory.chops.forEach(chop => {
    transactions.push([
      chop.created_at,
      "chop",
      users[chop.user_id],
      "n/a",
      chop.amount,
      0,
      0,
    ]);
  });
  backingHistory.topUps.forEach(topUp => {
    transactions.push([
      topUp.created_at,
      "topUp",
      users[topUp.user_id],
      "n/a",
      topUp.amount,
      0,
      0,
    ]);
  });
  return transactions;
}

function sortTransactions(transactions: CSVRow[]) {
  return transactions.sort((a, b) => {
    return new Date(a[0]).getTime() - new Date(b[0]).getTime();
  });
}

function updateFloatBalance(transactions: CSVRow[], startingBalance: number) {
  let rollingTotal = startingBalance;
  let makeup = 0;
  for (const transaction of transactions) {
    const value = transaction[4];
    const type = transaction[1];

    switch (type) {
      case "chop":
        rollingTotal = startingBalance;
        makeup = 0;
        break;
      case "session":
        rollingTotal += value;
        makeup -= value;
        break;
      case "topUp":
        rollingTotal += value;
        makeup += value;
        break;
    }
    transaction[6] += makeup;
    transaction[5] = rollingTotal;
  }
}
