import React from "react";

import Image from "next/image";
import HuthubaBangiForm from "@/components/huthuba-bangi-competition/HuthubaBangiForm";

const HuthubaBangiCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto h-screen">
      <div className="relative flex justify-center items-center h-40 md:h-60 lg:h-72 overflow-hidden">
        <Image
          src="/assets/images/huthuba_banner.png"
          alt="Quiz Competition Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
      <div className="my-10">
        <HuthubaBangiForm type="Create" />
      </div>
    </section>
  );
};

export default HuthubaBangiCompetitionPage;
