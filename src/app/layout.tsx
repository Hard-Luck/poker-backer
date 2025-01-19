import "@/app/globals.css";
import Header from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import TrpcProvider from "@/lib/trpc/Provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={roboto.className + " flex flex-col items-center"}
    >
      <body>
        <ClerkProvider>
          <TrpcProvider cookies={cookies}>
            <Toaster />
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              {children}
            </ThemeProvider>
          </TrpcProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
