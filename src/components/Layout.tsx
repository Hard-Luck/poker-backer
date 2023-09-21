import React, { type PropsWithChildren } from "react";
import Header from "./Header";
import Script from "next/script";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Script src="https://js.pusher.com/beams/1.0/push-notifications-cdn.js" />
      <Header />
      <>{children}</>
    </>
  );
};
export default Layout;
