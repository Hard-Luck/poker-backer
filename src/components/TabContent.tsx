import { BackingForRender } from "@/app/(app)/floats/BackingsTabs";
import { ItemCard } from "./ItemCard";
import { formatDateStringToLongDate } from "@/models/utils/timestamp";

export function TabContent({ backings }: { backings: BackingForRender[] }) {
  const backingWithFormattedDate: {
    id: number;
    name: string;
    lastSession: string;
  }[] = backings.map(backing => {
    const formatted = {
      id: backing.id,
      name: backing.name,
      lastSession: "No sessions played",
    };
    if (backing.lastSession) {
      formatted.lastSession = formatDateStringToLongDate(backing.lastSession);
    }
    return formatted;
  });
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {backingWithFormattedDate.map(backing => (
        <ItemCard key={backing.id} backing={backing} />
      ))}
    </div>
  );
}
