import Image from "next/image";
import React from "react";

const Persons = () => {
  return (
    <div className="w-full bg-white py-10 mt-[100px]">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-center font-dhivehi text-2xl md:text-3xl font-semibold">
          ކޯޑިނޭޓަރުންގެ މަޢުލޫމާތު
        </h2>

        {/* Table image */}
        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200">
          <Image
            src="/assets/images/coordinators.png"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Persons;
