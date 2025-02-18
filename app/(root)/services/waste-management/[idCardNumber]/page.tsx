"use client";

import React, { useEffect, useState } from "react";
import { Models } from "node-appwrite";
import { useParams } from "next/navigation";
import { getWasteRegistrationById } from "@/lib/actions/waste.actions";

const WasteParticipantDetails = () => {
  const { idCardNumber } = useParams();
  const [registration, setRegistration] = useState<Models.Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const data = await getWasteRegistrationById(idCardNumber);
        setRegistration(data.documents || []);
      } catch (err) {
        setError("ޕާޓިސިޕަންޓް ތަފްޞީލް ނުފެނުނު");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [idCardNumber]);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold font-dhivehi">
          {error}
        </p>
      </div>
    );

  if (!registration)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl font-semibold font-dhivehi">
          ޕާޓިސިޕަންޓް ނުފެނުނު.
        </p>
      </div>
    );

  const infoSection = (label: string, value: any) => (
    <div className="flex justify-between items-center p-4 border-b last:border-none">
      <p className="text-xl font-medium text-cyan-900">{label}</p>
      <p className="text-lg font-semibold text-slate-500">{value || "ނެތް"}</p>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 flex items-center justify-center p-4 "
    >
      <div className="max-w-5xl w-full mt-5">
        <h1 className="text-4xl font-bold text-cyan-900 text-center font-dhivehi mb-8">
          <span className="font-sans">{idCardNumber}</span> ގެދަށުން
          ރެޖިސްޓާކޮށްފައިވާ ({registration.length})
        </h1>

        <div className="grid gap-6">
          {registration.map((registration, index) => (
            <div
              key={registration.$id}
              className="bg-white shadow-lg rounded-xl overflow-hidden"
            >
              {/* Header Section */}
              <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-6">
                <h2 className="text-3xl font-bold text-white text-center font-dhivehi">
                  {registration.address} / ރ. އިންނަމާދޫ
                </h2>
              </div>

              {/* Details Section */}
              <div className="p-6">
                <div className="grid font-dhivehi grid-cols-1 gap-4">
                  {infoSection("ފުރިހަމަ ނަން", registration.fullName)}
                  {infoSection("އައިޑީކާޑް", registration.idCardNumber)}
                  {infoSection("ކެޓެގަރީ", registration.category)}
                  {infoSection("ފޯނު ނަންބަރު", registration.contactNumber)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WasteParticipantDetails;
