import React from "react";

import MadhahaCompetitionForm from "@/components/madhaha-competition/MadhahaForm";

const MadhahaCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative flex justify-center items-center h-40 md:h-60 lg:h-72 bg-gradient-to-br from-violet-900 via-purple-800 to-indigo-950"
        dir="rtl"
      >
        <h1 className="font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
          އިންނަމާދޫ ކައުންސިލްގެ 4 ވަނަ މަދަޙަ މުބާރާތް
        </h1>
      </div>
      <div className="my-10">
        <MadhahaCompetitionForm type="Create" />
      </div>
    </section>
  );
};

export default MadhahaCompetitionPage;
