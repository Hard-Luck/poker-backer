import React, { type PropsWithChildren } from "react";
import { Header } from "./Header";
import NavBar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <>{children}</>
      <NavBar />
    </>
  );
};
export default Layout;
