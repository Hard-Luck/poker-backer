import { Card, CardContent } from "@/components/ui/card";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 md:py-16 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-1/2 space-y-8 flex flex-col items-center">
          <Image
            src="/logo-white.png"
            alt="logo"
            width={300}
            height={300}
            className="rounded-lg"
          />
          <div className="md:hidden">
            <SignIn forceRedirectUrl={"/dashboard"} />
          </div>
          <div className="hidden md:block space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Welcome to Poker Backer
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your poker bankroll and share it with your backers
            </p>
          </div>
        </div>
        <div className="hidden md:block w-full md:w-1/2 mt-8 md:mt-0">
          <Card className="border-none">
            <CardContent className="p-6 flex flex-col items-center">
              <h2 className="text-2xl font-semibold mb-6">
                Log In to Your Account
              </h2>
              <SignIn forceRedirectUrl={"/dashboard"} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
