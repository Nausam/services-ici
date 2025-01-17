import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

import { AnimatedGroup } from "@/components/ui/animated-group";
import { Separator } from "@/components/ui/separator";
import { TextEffect } from "@/components/ui/text-effect";

const Home = () => {
  return (
    <>
      <main
        className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50 relative overflow-hidden"
        dir="rtl"
      >
        {/* Faded Gradient Glow Effect */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-2xl opacity-40"></div>
        </div>

        {/* Hero Section */}
        <section className="relative text-center py-16 text-white z-10">
          <div className="max-w-7xl mx-auto">
            {/* <h1 className="md:text-7xl xl:text-8xl text-5xl font-dhivehi leading-snug text-cyan-900">
              ރ. އިންނަމާދޫ ކައުންސިލްގެ ހިދުމަތް ޕޯޓަލް
            </h1> */}

            <TextEffect
              className="md:text-7xl xl:text-8xl text-5xl font-dhivehi leading-snug text-cyan-900"
              per="char"
              as="h1"
              preset="fade-in-blur"
            >
              ރ. އިންނަމާދޫ ކައުންސިލް
            </TextEffect>
          </div>
        </section>

        {/* Services Section */}
        <section className="mt-10 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto ">
            {/* <h3 className="text-4xl md:text-6xl font-dhivehi text-cyan-900 mb-10 text-center">
              ހިދުމަތްތައް
            </h3> */}

            <AnimatedGroup
              className="grid gap-8 sm:grid-cols-1 md:grid-cols-1"
              variants={{
                container: {
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.05,
                    },
                  },
                },
                item: {
                  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: {
                      duration: 1.2,
                      type: "spring",
                      bounce: 0.3,
                    },
                  },
                },
              }}
            >
              <ServiceCard
                title="ކުނި އުކާލުމަށާއި ކުނި ނައްތާލުމަށް ރެޖިސްޓާ ކުރުން"
                description="ސާފު ތާހިރު ވެށްޓެއް ޤާއިމުކުރުމަށާއި، އަޅުގަނޑުމެންގެ މުޖުތަމަޢުއިން ރަނގަޅު ގޮތުގައި ކުނި ނައްތާލުމަށް އެހީތެރިވެދެއްވާ!"
                link="/services/register/waste-management"
                buttonText=" ރެޖިސްޓާ "
                dueDate="February 15, 2025"
                image="/assets/images/waste.jpg"
              />
            </AnimatedGroup>
          </div>
        </section>

        {/* Footer */}
        {/* <footer className="bg-blue-600 text-white py-6 relative z-10" dir="ltl">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Innamaadhoo Council. All rights
              reserved.
            </p>
          </div>
        </footer> */}
      </main>
    </>
  );
};

export default Home;
