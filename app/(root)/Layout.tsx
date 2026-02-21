import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex w-full max-w-[100vw] min-w-0 flex-col overflow-x-hidden">
      <div className="flex-1 min-w-0">{children}</div>
    </main>
  );
};

export default Layout;
