import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full h-screen flex-col">
      <div className="mx-auto max-w-7xl">
        Header
        <div className="flex-1 mt-20">{children}</div>
      </div>
    </main>
  );
};

export default Layout;
