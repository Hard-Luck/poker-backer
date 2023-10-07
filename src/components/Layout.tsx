import React, { type PropsWithChildren } from "react";
import Header from "./Header";
import { Toaster } from "sonner";
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <Toaster richColors />
      <>{children}</>
    </>
  );
};
export default Layout;
