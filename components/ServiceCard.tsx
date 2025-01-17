import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

type ServiceCardProps = {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  dueDate?: string; // Optional due date
  category?: string; // Optional category
  image?: string; // Optional image URL
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  link,
  buttonText,
  dueDate,
  category,
  image,
}) => {
  return (
    <div className="flex flex-col bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-8 max-w-3xl mx-auto hover:shadow-xl transition-shadow duration-300 md:mt-10 gap-6 md:flex-row-reverse">
      {/* Optional Image */}
      {image && (
        <div
          className="relative w-full h-40 md:w-1/3 md:h-auto rounded-lg overflow-hidden bg-cover bg-center md:block hidden"
          style={{
            backgroundImage: `url('${image}')`,
          }}
        ></div>
      )}
      {image && (
        <div
          className="relative w-full h-40 rounded-lg overflow-hidden bg-cover bg-center block md:hidden"
          style={{
            backgroundImage: `url('${image}')`,
            backgroundSize: "120%", // Adds the zoom-in effect
          }}
        ></div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1">
        {/* Title and Due Date */}
        <div className="flex flex-col items-start mb-6">
          {dueDate && (
            <div className="inline-flex items-center bg-slate-100 text-cyan-800 text-sm font-bold py-1 px-3 rounded-md whitespace-nowrap shadow-md">
              {dueDate}
              <div className="mr-2">
                <Image
                  src="/assets/icons/hourglass.png"
                  alt="hourglass"
                  width={15}
                  height={15}
                />
              </div>
            </div>
          )}
          <h3 className="text-3xl font-bold font-dhivehi text-cyan-900 leading-tight mt-5">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-lg font-dhivehi text-slate-600 mb-6">
          {description}
        </p>

        {/* Button */}
        <div className="flex justify-start text-right">
          <Link href={link}>
            <Button
              type="submit"
              size="lg"
              className="bg-cyan-700 text-white hover:bg-cyan-600 transition duration-300 px-6 py-3 rounded-md shadow-md font-dhivehi text-xl"
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
