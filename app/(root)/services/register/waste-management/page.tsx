import WasteRegistrationForm from "@/components/waste-management/WasteRegistrationForm";
import React from "react";

const WasteManagementRegistrationPage = () => {
  return (
    <section className="max-w-7xl mx-auto">
      <div
        className="relative flex justify-center items-center bg-cover bg-center h-40 md:h-60 lg:h-72"
        style={{
          backgroundImage: "url('/assets/images/waste-bg.jpg')", // Replace with the path to your image
        }}
      >
        <h1 className="relative z-10 text-cyan-900 lg:text-6xl md:text-5xl text-4xl font-dhivehi text-center bg-white/80 p-4 rounded-md shadow-md">
          ކުނި އުކާލުމާއި ކުނި ނައްތާލުމަށް ރަޖިސްޓާ ކުރުން
        </h1>
      </div>
      <div className="mt-10">
        <WasteRegistrationForm type="Create" />
      </div>
    </section>
  );
};

export default WasteManagementRegistrationPage;