import React from "react";

import MadhahaCompetitionForm from "@/components/madhaha-competition/MadhahaForm";

const MadhahaCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative isolate flex justify-center items-center h-40 md:h-60 lg:h-72 overflow-hidden"
        dir="rtl"
        style={{
          backgroundColor: "#24124f",
          backgroundImage:
            "radial-gradient(ellipse at top right, rgba(45, 212, 191, 0.42), transparent 34%), radial-gradient(ellipse at 18% 82%, rgba(251, 191, 36, 0.22), transparent 36%), linear-gradient(135deg, #31105f 0%, #7c2d92 46%, #111c4d 100%)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.2,
            backgroundImage:
              "linear-gradient(30deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16)), linear-gradient(150deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16))",
            backgroundSize: "72px 42px",
          }}
        />
        <svg
          aria-hidden="true"
          className="h-24 w-full text-white/20 md:h-32"
          preserveAspectRatio="none"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            left: 0,
          }}
          viewBox="0 0 1200 180"
        >
          <path
            d="M0 112C96 78 188 71 276 91c102 24 164 80 274 54 103-24 148-93 269-82 127 12 190 96 381 38v79H0Z"
            fill="currentColor"
          />
          <path
            d="M0 143c135-38 225-17 318 8 95 26 178 56 310 11 126-43 199-91 344-51 78 22 143 27 228 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 32,
            left: 32,
            top: 24,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(255, 255, 255, 0.45), transparent)",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            right: 32,
            left: 32,
            bottom: 24,
            height: 1,
            background:
              "linear-gradient(to left, transparent, rgba(253, 230, 138, 0.4), transparent)",
          }}
        />
        <h1 className="relative z-10 font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
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
