import WasteRegistrationForm from "@/components/waste-management/WasteRegistrationForm";
import React from "react";

const WasteManagementRegistrationPage = () => {
  return (
    <section className="max-w-7xl mx-auto ">
      <div
        className="relative flex justify-center items-center bg-cover bg-center h-40 md:h-60 lg:h-72"
        style={{
          backgroundImage: "url('/assets/images/waste-bg.jpg')",
        }}
      >
        <h1 className="relative z-10 text-cyan-900 lg:text-6xl md:text-5xl text-4xl font-dhivehi text-center backdrop-blur-[5px] p-4 rounded-md shadow-md">
          ކުނި އުކާލުމަށާއި ކުނި ނައްތާލުމަށް ރެޖިސްޓާ ކުރުން
        </h1>
      </div>
      <div className="my-10">
        <WasteRegistrationForm type="Create" />
      </div>
    </section>
  );
};

export default WasteManagementRegistrationPage;
