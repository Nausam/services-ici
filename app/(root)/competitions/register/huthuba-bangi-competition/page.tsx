import React from "react";

import HuthubaBangiForm from "@/components/huthuba-bangi-competition/HuthubaBangiForm";

const HuthubaBangiCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative flex justify-center items-center h-40 md:h-60 lg:h-72 bg-gradient-to-br from-emerald-800 via-green-800 to-teal-950"
        dir="rtl"
      >
        <h1 className="font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
          އިންނަމާދޫ ކައުންސިލްގެ 2 ވަނަ ޙުތުބާ އަދި ބަންގި މުބާރާތް
        </h1>
      </div>
      <div className="my-10">
        <HuthubaBangiForm type="Create" />
      </div>
    </section>
  );
};

export default HuthubaBangiCompetitionPage;
