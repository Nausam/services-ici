"use client";

import React from "react";
import { useUser } from "@/providers/UserProvider";
import Image from "next/image";
import Link from "next/link";
import { signOutUser } from "@/lib/actions/user.actions";

const Header = () => {
  const { currentUser, isAdmin, loading } = useUser();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  console.log(currentUser);

  return (
    <header
      className="bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md py-4 px-6 z-50 sticky top-0"
      dir="rtl"
    >
      <nav className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/icons/logo-small.png"
            alt="Council Logo"
            width={80}
            height={80}
            className="mr-3"
          />
          <h1 className="text-2xl font-dhivehi text-cyan-900 hidden md:flex">
            އިންނަމާދޫ ކައުންސިލް
          </h1>
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="bg-slate-500 animate-pulse h-12 w-48 rounded-lg"></div>
          ) : currentUser ? (
            <>
              {isAdmin && (
                <button
                  onClick={handleSignOut}
                  className="bg-rose-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-500 transition duration-300 font-dhivehi text-lg"
                >
                  ލޮގް-އައުޓް
                </button>
              )}

              <Link href="/admin">
                <div className="bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300 font-dhivehi text-lg">
                  އެޑްމިން
                </div>
              </Link>
            </>
          ) : (
            <Link href="/sign-in">
              <div className="bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300 font-dhivehi text-lg">
                ލޮގިން
              </div>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
