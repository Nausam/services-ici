import React from "react";
import Image from "next/legacy/image";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <section className="flex flex-1 flex-col items-center bg-white p-4 justify-center lg:p-10 lg:py-0 mt-5">
        {/* <div className="flex items-center justify-center gap-2">
          <Image
            src="/assets/icons/logo-small.png"
            alt="logo"
            width={330}
            height={170}
          />
        </div>
        <p className="text-5xl font-dhivehi mt-5 text-cyan-950">
          އިންނަމާދޫ ކައުންސިލް
        </p> */}

        {children}
      </section>
    </div>
  );
};

export default Layout;
