import { getUserAuth } from "@/lib/auth/utils";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getUserAuth();
  if (session?.session) redirect("/dashboard");

  return <div className="h-screen pt-8 ">{children}</div>;
}
