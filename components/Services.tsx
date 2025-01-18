import React from "react";
import ServiceCard from "./ServiceCard";
import { AnimatedGroup } from "./ui/animated-group";

const Services = () => {
  return (
    <section className="mt-20 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto">
        <AnimatedGroup
          className="grid gap-2 grid-cols-1"
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
          <h3 className="text-3xl md:text-5xl font-dhivehi text-cyan-900 text-center">
            ރެޖިސްޓާކުރުން
          </h3>
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
  );
};

export default Services;
