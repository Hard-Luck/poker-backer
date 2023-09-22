import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const user = useUser();
  const router = useRouter();
  if (user.isSignedIn) void router.push("/home");
  return (
    <>
      <Head>
        <title>Poker Backer</title>
        <meta name="description" content="Poker Backer" />
        <link rel="icon" href="poker.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <main className="flex h-screen items-center justify-center bg-theme-black">
        <SignInButton afterSignInUrl="/" afterSignUpUrl="/">
          <button className="rounded-lg bg-theme-header px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 ">
            Sign in
          </button>
        </SignInButton>
      </main>
    </>
  );
};

export default Home;
