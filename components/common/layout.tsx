import React from "react";
import { Header } from "./header";

type Props = {
  children: React.ReactNode;
};

export const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      <main className="mx-3">{children}</main>
    </>
  );
};
