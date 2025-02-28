"use client";

import React from "react";

const PlaceholderCard = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="md:mb-0 mb-5 flex border border-white flex-col bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-8 max-w-3xl mx-auto mt-5 md:mt-10 gap-6 md:flex-row-reverse">
      {/* Content */}
      <div className="flex flex-col flex-1 text-center">
        <h3 className="md:text-2xl text-2xl font-bold font-dhivehi text-cyan-900 leading-tight mt-5">
          {title}
        </h3>
        <p className="md:text-lg text-md font-dhivehi text-slate-600 mt-3">
          {description}
        </p>
      </div>
    </div>
  );
};

export default PlaceholderCard;
