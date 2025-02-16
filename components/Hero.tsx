import React from "react";
import { TextEffect } from "./ui/text-effect";

const Hero = () => {
  return (
    <section className="text-center md:py-5 mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="md:text-7xl xl:text-8xl text-5xl font-dhivehi leading-snug text-cyan-900">
          ރ. އިންނަމާދޫ ކައުންސިލް
        </h1>

        <h2 className="text-xl md:text-4xl md:mt-10 mt-5 font-dhivehi leading-snug text-cyan-900">
          ސެލްފް ސާރވިސް ޕޯޓަލްއަށް މަރުހަބާ!
        </h2>

        <p className="mt-10  font-dhivehi text-cyan-900 leading-relaxed"></p>
      </div>
    </section>
  );
};

export default Hero;
