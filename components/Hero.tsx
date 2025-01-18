import React from "react";
import { TextEffect } from "./ui/text-effect";

const Hero = () => {
  return (
    <section className="relative text-center md:py-5 mt-20">
      <div className="max-w-7xl mx-auto">
        <TextEffect
          className="md:text-7xl xl:text-8xl text-5xl font-dhivehi leading-snug text-cyan-900"
          per="char"
          as="h1"
          preset="fade-in-blur"
        >
          ރ. އިންނަމާދޫ ކައުންސިލް
        </TextEffect>

        <TextEffect
          className="text-xl md:text-4xl md:mt-10 mt-5 font-dhivehi leading-snug text-cyan-900"
          per="char"
          as="h1"
          preset="fade-in-blur"
        >
          ސެލްފް ސާރވިސް ޕޯޓަލްއަށް މަރުހަބާ!
        </TextEffect>

        <p className="mt-10  font-dhivehi text-cyan-900 leading-relaxed"></p>
      </div>
    </section>
  );
};

export default Hero;
