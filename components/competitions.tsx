import React from "react";
import ServiceCard from "./ServiceCard";
import { AnimatedGroup } from "./ui/animated-group";

const Competitions = () => {
  return (
    <section className="mt-20 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-dhivehi text-cyan-900 text-center">
          މުބާރާތްތައް
        </h3>
        <ServiceCard
          title=" ޤުރުއާން މުބާރާތަށް ރެޖިސްޓާ ކުރުން "
          description=" އިންނަމާދޫ ކައުންސިލްގެ 08 ވަނަ ޤުރުއާން މުބާރާތަށް ރެޖިސްޓާ ކުރައްވާ! "
          link="/competitions/register/quran-competition"
          buttonText=" ރެޖިސްޓާ "
          dueDate="March 01, 2025"
          image="/assets/images/quran.jpg"
        />
      </div>
    </section>
  );
};

export default Competitions;
