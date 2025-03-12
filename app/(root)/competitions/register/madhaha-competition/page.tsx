import React from "react";

import Image from "next/image";
import MadhahaCompetitionForm from "@/components/madhaha-competition/MadhahaForm";

const MadhahaCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto h-screen">
      <div className="relative flex justify-center items-center h-40 md:h-60 lg:h-72 overflow-hidden">
        <Image
          src="/assets/images/madhaha_banner.png"
          alt="Quiz Competition Banner"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
      <div className="my-10">
        <MadhahaCompetitionForm type="Create" />
      </div>
    </section>
  );
};

export default MadhahaCompetitionPage;
