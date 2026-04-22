import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Calendar, ChevronRight } from "lucide-react";

export function ItemCard({
  backing,
}: {
  backing: { id: number; name: string; lastSession: string };
}) {
  return (
    <Link href={`/floats/${backing.id}`} className="block group">
      <Card className="h-full border-border hover:border-primary/50 hover:shadow-md transition-all duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold group-hover:text-primary transition-colors">
              {backing.name}
            </CardTitle>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </div>
          <CardDescription className="flex items-center gap-1.5 text-sm">
            <Calendar className="h-3.5 w-3.5" />
            {backing.lastSession}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
}
