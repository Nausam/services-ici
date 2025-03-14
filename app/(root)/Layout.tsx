import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full flex-col ">
      <div className="flex-1">{children}</div>
    </main>
  );
};

export default Layout;
