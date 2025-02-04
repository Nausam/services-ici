"use client";

import React, { useEffect, useState } from "react";
import { getQuranRegistrationById } from "@/lib/actions/quranCompetition.actions";
import { Models } from "node-appwrite";
import { useParams } from "next/navigation";
import Image from "next/image";

const ParticipantDetails = () => {
  const { idCardNumber } = useParams();
  const [registration, setRegistration] = useState<Models.Document | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const data = await getQuranRegistrationById(idCardNumber);
        setRegistration(data);
      } catch (err) {
        setError("ޕާޓިސިޕަންޓް ތަފްޞީލް ނުފެނުނު.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [idCardNumber]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-cyan-600 text-4xl font-semibold animate-pulse font-dhivehi">
          ޕާޓިސިޕަންޓްގެ ތަފްޞީލް ލޯޑިންގް
        </p>
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
    <div dir="rtl" className="flex justify-between items-center border-b py-2">
      <p className="text-lg text-gray-800 font-dhivehi">{label}</p>
      <p className="text-lg font-semibold text-gray-500">{value || "ނެތް"}</p>
    </div>
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-3xl w-full border border-cyan-200">
        {/* {registration.idCard && (
          <div className="mt-6 text-center font-dhivehi">
            <h4 className="text-cyan-700 font-semibold">އައިޑީކާޑް</h4>
            <Image
              src={registration.idCard}
              width={300}
              height={200}
              alt="ID Card"
              className="mx-auto mt-2 max-w-xs rounded shadow-md"
            />
          </div>
        )} */}

        <h2 className="text-3xl font-bold text-cyan-700 mt-5 mb-4 text-center font-dhivehi">
          {registration.fullName}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-dhivehi mt-10">
          {infoSection("އައިޑީކާޑް ނަންބަރު", registration.idCardNumber)}
          {infoSection("ދާއިމީ އެޑްރެސް", registration.address)}
          {infoSection("ފޯނު ނަންބަރު", registration.contactNumber)}
          {infoSection("އުފަން ތާރީހް", registration.dateOfBirth)}
          {infoSection("ޖިންސު", registration.sex)}
          {infoSection("ބެލެނިވެރިޔާގެ ނަން", registration.parentName)}
          {infoSection(
            "ބެލެނިވެރިޔާގެ އައިޑީކާޑް",
            registration.parentIdCardNumber
          )}
          {infoSection(
            "ބެލެނިވެރިޔާގެ ދާއިމީ އެޑްރެސް",
            registration.parentAddress
          )}
          {infoSection("ހުރިގާތް", registration.relationship)}
          {infoSection(
            "ބެލެނިވެރިޔާގެ ފޯނު ނަންބަރު",
            registration.parentContactNumber
          )}
          {infoSection("ބޭންކު އެކައުންޓް ނަން", registration.bankAccountName)}
          {infoSection(
            "ބޭންކު އެކައުންޓް ނަންބަރު",
            registration.bankAccountNumber
          )}
          {infoSection("ބޭންކުގެ ނަން", registration.bankName)}
          {infoSection("އިޤްރާރުވި ތާރީހް", registration.agreedDate)}
          {infoSection("ކީސްޓޭޖް", registration.keyStage)}
          {infoSection(
            " އިޤްރާރުގައި ސޮއިކުރި ފަރާތް ",
            registration.agreeyerName
          )}
        </div>

        <div className="mt-6 border-b p-4">
          <h3 className="text-2xl text-cyan-700 font-bold text-center mb-3 font-dhivehi">
            ފުރަތަމަ ރައުންޑުގައި ކިޔަވާ ގޮފި
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center font-dhivehi">
            <p>
              {registration.balaigenKiyevunFeshey
                ? "✔️ ބަލައިގެން ފެށޭ"
                : "❌ ބަލައިގެން ނިމޭ"}
            </p>
            <p>
              {registration.nubalaaKiyevunFeshey
                ? "✔️ ނުބަލައި ފެށޭ"
                : "❌ ނުބަލައި ނިމޭ"}
            </p>
          </div>
        </div>

        <div className="mt-6 border-b p-4">
          <h3 className="text-2xl text-cyan-700 font-bold text-center mb-3 font-dhivehi">
            ދެވަނަ ރައުންޑުގައި ކިޔަވާ ގޮފި
          </h3>
          <div className="grid grid-cols-2 gap-4 text-center font-dhivehi">
            <p>
              {registration.finalRoundBalaigenKiyevunFeshey
                ? "✔️  ބަލައިގެން ފެށޭ"
                : "❌  ބަލައިގެން ނިމޭ"}
            </p>
            <p>
              {registration.finalRoundNubalaaKiyevunFeshey
                ? "✔️  ނުބަލައި ފެށޭ"
                : "❌  ނުބަލައި ނިމޭ"}
            </p>
          </div>
        </div>

        {/* <div className="mt-6 text-center font-dhivehi">
          <p className="text-sm text-gray-500">
            <strong>އިޤްރާރު:</strong>{" "}
            {registration.agreeToTerms ? (
              <span className="text-green-600 font-bold">
                ✔️ އިޤްރާރު ކުރެވިއްޖެ
              </span>
            ) : (
              <span className="text-red-600 font-bold">❌ ނުކުރެވިއްޖެ</span>
            )}
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default ParticipantDetails;
