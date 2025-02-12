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
      className="bg-gradient-to-r from-blue-100 to-blue-50 backdrop-blur-md  px-6 z-50 sticky top-0 shadow-sm"
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
            priority
          />
          <h1 className="mr-3 text-2xl font-dhivehi text-cyan-900 hidden md:flex">
            އިންނަމާދޫ ކައުންސިލް
          </h1>
        </Link>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="flex gap-4">
              <div className="bg-slate-300 animate-pulse h-12 w-24 rounded-lg"></div>
              <div className="bg-slate-300 animate-pulse h-12 w-20 rounded-lg"></div>
            </div>
          ) : currentUser ? (
            <>
              {isAdmin && (
                <div className="flex gap-4">
                  <button
                    onClick={handleSignOut}
                    className="bg-rose-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-500 transition duration-300 font-dhivehi text-lg"
                  >
                    ލޮގް-އައުޓް
                  </button>

                  <Link href="/admin">
                    <div className="bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition duration-300 font-dhivehi text-lg">
                      އެޑްމިން
                    </div>
                  </Link>
                </div>
              )}
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
