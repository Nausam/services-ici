import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-gradient-to-r from-blue-50 to-blue-200 text-cyan-900 font-bold py-6 z-10"
      dir="ltl"
    >
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Innamaadhoo Council. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
