import React, { PropsWithChildren } from "react";
import { Header } from "./Header";
import { useUser } from "@clerk/nextjs";

const Layout = ({ children }: PropsWithChildren) => {
  const user = useUser();

  return (
    <>
      <Header />
      <>{children}</>
    </>
  );
};
export default Layout;
