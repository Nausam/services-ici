import React from "react";
import ServiceCard from "./ServiceCard";
import { AnimatedGroup } from "./ui/animated-group";

const Registrations = () => {
  return (
    <section className="mt-20 relative z-10 px-4 sm:px-6 md:px-8 lg:px-12 mb-10">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-2xl md:text-4xl font-dhivehi text-cyan-900 text-center">
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
      </div>
    </section>
  );
};

export default Registrations;
