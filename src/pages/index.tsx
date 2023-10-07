import { SignInButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import Image from "next/image";

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
      <main className="flex h-screen flex-col items-center justify-center bg-theme-black">
        <Image
          src="/logo-white.png"
          alt="logo"
          width={400}
          height={400}
          className="rounded-full py-4 xl:bg-transparent"
        />
        <SignInButton afterSignInUrl="/" afterSignUpUrl="/">
          <button className="w-full max-w-sm rounded-lg bg-theme-header px-5 py-2.5 text-center text-sm font-medium text-white  focus:outline-none focus:ring-4 ">
            Sign in
          </button>
        </SignInButton>
      </main>
    </>
  );
};

export default Home;
