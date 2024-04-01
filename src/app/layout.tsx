import "@/app/globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import TrpcProvider from "@/lib/trpc/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="flex flex-col items-center">
        <ClerkProvider>
          <TrpcProvider cookies={cookies}>
            <Toaster />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange>
              <Header />
              {children}
            </ThemeProvider>
          </TrpcProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
