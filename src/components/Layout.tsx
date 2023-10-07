import React, { type PropsWithChildren } from "react";
import Header from "./Header";
import { Toaster } from "sonner";
import Head from "next/head";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>Poker Backer</title>
        <meta name="description" content="Poker Backer" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Header />
      <Toaster richColors />
      <>{children}</>
    </>
  );
};
export default Layout;
