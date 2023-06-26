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
      </Head>
      <main>
        <header className="flex justify-center">
          <SignInButton afterSignInUrl="/" mode="modal" afterSignUpUrl="/">
            <button className="rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600">
              Sign in
            </button>
          </SignInButton>
        </header>
      </main>
    </>
  );
};

export default Home;
