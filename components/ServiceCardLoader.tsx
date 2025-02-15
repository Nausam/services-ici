import React from "react";

const ServiceCardLoader: React.FC = () => {
  return (
    <div className="md:mb-0 mb-5 flex border flex-col bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg rounded-xl p-8 max-w-3xl mx-auto hover:shadow-xl transition-all duration-400 mt-5 md:mt-10 gap-6 md:flex-row-reverse animate-pulse">
      {/* Image Loader */}
      <div className="relative w-full h-40 md:w-1/3 md:h-auto rounded-lg bg-slate-300/60 md:block hidden"></div>
      <div className="relative w-full h-40 rounded-lg bg-slate-300/60 md:hidden block"></div>

      {/* Content Loader */}
      <div className="flex flex-col flex-1">
        {/* Title and Due Date Loader */}
        <div className="flex flex-col items-start mb-6">
          {/* Due Date Loader */}
          <div className="inline-flex items-center bg-slate-300/60 h-6 w-36 rounded-md shadow-md"></div>

          {/* Title Loader */}
          <div className="h-8 bg-slate-300/60 w-3/4 mt-5 rounded-md"></div>
        </div>

        {/* Description Loader */}
        <div className="h-6 bg-slate-300/60 w-full mb-3 rounded-md"></div>
        <div className="h-6 bg-slate-300/60 w-5/6 mb-6 rounded-md"></div>

        {/* Button Loader */}
        <div className="h-10 bg-slate-300/60 w-40 rounded-md"></div>
      </div>
    </div>
  );
};

export default ServiceCardLoader;
