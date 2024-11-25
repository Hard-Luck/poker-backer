import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ItemCard({
  backing,
}: {
  backing: { id: number; name: string; lastSession: string };
}) {
  return (
    <Link href={`/floats/${backing.id}`}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader>
          <CardTitle>{backing.name}</CardTitle>
          <CardDescription>Last session: {backing.lastSession}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
