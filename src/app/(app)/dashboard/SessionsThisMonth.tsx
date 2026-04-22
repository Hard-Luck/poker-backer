import { Card, CardContent } from "@/components/ui/card";
import { getUserAuth } from "@/lib/auth/utils";
import { getSessionsPlayedThisMonth } from "@/models/sessions";
import { CalendarDays } from "lucide-react";

export default async function SessionsThisMonth() {
  const { session } = getUserAuth();
  if (!session) throw new Error("No session found");
  const sessionsPlayedThisMonth = await getSessionsPlayedThisMonth(
    session.user.id
  );
  const sessionOrSessions = sessionsPlayedThisMonth === 1 ? "Session" : "Sessions";
  
  return (
    <Card className="border-border bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4 md:p-6 flex items-center gap-4">
        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-full bg-primary/10">
          <CalendarDays className="h-6 w-6 md:h-7 md:w-7 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl md:text-4xl font-bold text-foreground">
            {sessionsPlayedThisMonth}
          </span>
          <span className="text-sm text-muted-foreground">
            {sessionOrSessions} this month
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
