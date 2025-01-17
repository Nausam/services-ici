import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const Home = () => {
  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-50">
        {/* Hero Section */}
        <section className="text-center py-16 bg-gradient-to-r from-blue-600 to-teal-400 text-white">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-6xl font-black leading-snug">
              Welcome to Innamaadhoo Council Registration Portal
            </h2>
            <p className="mt-4 text-lg">
              Register for council services and stay connected with our
              community.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="/services">
                <Button className="bg-white text-teal-600 hover:bg-gray-100">
                  Services
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12">
          <div className="container mx-auto text-center">
            <h3 className="text-3xl font-bold text-gray-800">
              Waste Management Registration
            </h3>
            <p className="text-gray-600 mt-2">
              Join our waste management program to help keep our community clean
              and sustainable. Register now to get started!
            </p>

            <div className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
              <div className="text-left">
                <h4 className="text-xl font-semibold text-gray-800">
                  Waste Management Registration
                </h4>
                <p className="text-gray-600 mt-2">
                  By registering for waste management services, you contribute
                  to a cleaner environment and ensure proper waste disposal for
                  our community.
                </p>
              </div>
              <div className="mt-6 text-center">
                <Link
                  href="services/register/waste-management"
                  className="bg-cyan-600 py-4 px-6 rounded-lg text-white hover:bg-cyan-700"
                >
                  Register Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-600 text-white py-6">
          <div className="container mx-auto text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Innamaadhoo Council. All rights
              reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
};

export default Home;
