import React from "react";

import HuthubaBangiForm from "@/components/huthuba-bangi-competition/HuthubaBangiForm";

const HuthubaBangiCompetitionPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative isolate flex justify-center items-center h-40 md:h-60 lg:h-72 overflow-hidden"
        dir="rtl"
        style={{
          backgroundColor: "#063f3d",
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(52, 211, 153, 0.38), transparent 34%), radial-gradient(ellipse at 84% 76%, rgba(125, 211, 252, 0.24), transparent 38%), linear-gradient(135deg, #064e3b 0%, #0f766e 48%, #083344 100%)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            backgroundImage:
              "linear-gradient(45deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16)), linear-gradient(135deg, rgba(255, 255, 255, 0.16) 12%, transparent 12.5%, transparent 87%, rgba(255, 255, 255, 0.16) 87.5%, rgba(255, 255, 255, 0.16))",
            backgroundSize: "70px 70px",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.28,
            backgroundImage:
              "radial-gradient(circle at 22% 38%, rgba(255, 255, 255, 0.2) 0 1px, transparent 2px), radial-gradient(circle at 72% 62%, rgba(167, 243, 208, 0.28) 0 1px, transparent 2px)",
            backgroundSize: "54px 54px, 76px 76px",
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
            d="M0 118c102-34 204-42 309-19 92 20 152 61 257 33 118-31 173-89 303-62 111 23 196 78 331 32v78H0Z"
            fill="currentColor"
          />
          <path
            d="M0 145c128-34 213-23 317 0 103 23 196 43 314 1 135-48 217-73 352-33 69 20 135 25 217 2"
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
              "linear-gradient(to left, transparent, rgba(209, 250, 229, 0.48), transparent)",
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
              "linear-gradient(to left, transparent, rgba(125, 211, 252, 0.36), transparent)",
          }}
        />
        <h1 className="relative z-10 font-dhivehi text-3xl md:text-4xl lg:text-6xl font-bold text-white text-center px-4 drop-shadow-lg">
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
