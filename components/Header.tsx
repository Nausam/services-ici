import React from "react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header
      className="bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md py-4 px-6 z-50 sticky top-0"
      dir="rtl"
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/icons/logo-small.png" // Replace with the actual path to your logo
            alt="Council Logo"
            width={80} // Adjust width as needed
            height={80} // Adjust height as needed
            className="mr-3"
          />
          <h1 className="text-2xl font-dhivehi text-cyan-900 hidden md:flex">
            އިންނަމާދޫ ކައުންސިލް
          </h1>
        </Link>

        {/* Login Button */}
        <div>
          <Link href="/login">
            <div className="bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300 font-medium text-lg">
              Login
            </div>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
