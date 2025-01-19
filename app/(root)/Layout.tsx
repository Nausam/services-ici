import Footer from "@/components/Footer";
import Header from "@/components/Header";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full h-screen flex-col">
      {/* <Header /> */}
      <div className="flex-1">{children}</div>
      {/* <Footer /> */}
    </main>
  );
};

export default Layout;
