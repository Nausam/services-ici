// app/schedule/page.tsx   (or pages/schedule.tsx if using Pages Router)
import React from "react";
import Image from "next/image";

const SchedulePage = () => {
  return (
    <div className="w-full bg-white py-10 mt-[100px]">
      <div className="mx-auto max-w-5xl px-4">
        <h2 className="mb-6 text-center font-dhivehi text-2xl md:text-3xl font-semibold">
          ކިޔެވުމަށް ހަމަޖެހިފައިވާ ތަރުތީބު
        </h2>

        {/* Table image */}
        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200">
          <Image
            src="/assets/images/kiyavaa1.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa2.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa3.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa4.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa5.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa6.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa7.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa8.jpg"
            alt="Reciters schedule table"
            width={1200}
            height={800}
            className="w-full h-auto object-contain"
            priority
          />
        </div>

        <div className="overflow-hidden rounded-xl shadow-md ring-1 ring-gray-200 mt-5">
          <Image
            src="/assets/images/kiyavaa9.jpg"
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

export default SchedulePage;
