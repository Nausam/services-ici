"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getHuthubaBangiParticipantByIdCard } from "@/lib/actions/huthubaBangi.actions";
import { HuthubaBangiCompetitionRegistration } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import PlaceholderCard from "@/components/PlaceholderCard";

const BangiHuthubaParticipantDetails = () => {
  const { idCardNumber } = useParams();
  const router = useRouter();

  const [participant, setParticipant] =
    useState<HuthubaBangiCompetitionRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        if (!idCardNumber) return;

        const data = await getHuthubaBangiParticipantByIdCard(
          Array.isArray(idCardNumber) ? idCardNumber[0] : idCardNumber
        );

        if (data) {
          // ✅ Type assertion to match the expected type
          setParticipant({
            fullName: data.fullName || "",
            address: data.address || "",
            idCardNumber: data.idCardNumber || "",
            contactNumber: data.contactNumber || "",
            competitionType: data.competitionType || "ހުތުބާ",
            idCard: data.idCard || "",
            ageGroup: data.ageGroup || "",
          });
        } else {
          router.push("/competitions/bangi-huthuba-competition");
        }
      } catch (error) {
        console.error("Failed to fetch participant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [idCardNumber, router]);

  // ✅ Helper Function to Render Info Sections
  const infoSection = (label: string, value: any) => (
    <div className="flex justify-between items-center p-4 border-b last:border-none">
      <p className="text-xl font-medium text-cyan-900">{label}</p>
      <p className="text-lg font-semibold text-slate-500">{value || "ނެތް"}</p>
    </div>
  );

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (!participant) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <PlaceholderCard title="ޕާޓިސިޕެންޓް ތަފްޞީލް ނުފެނުނު" />
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="h-full flex items-center justify-center p-4 mt-10"
    >
      <div className="max-w-5xl w-full">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-6 rounded-t-xl">
            <h2 className="text-3xl font-bold text-white text-center font-dhivehi leading-relaxed">
              {participant.fullName}
            </h2>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid font-dhivehi grid-cols-1 gap-4">
              {infoSection("ފުރިހަމަ ނަން", participant.fullName)}
              {infoSection(
                "އައިޑީކާޑް",
                <span className="font-mono font-semibold">
                  {participant.idCardNumber}
                </span>
              )}
              {infoSection(
                "ފޯނު ނަންބަރު",
                <span className="font-mono font-semibold">
                  {participant.contactNumber}
                </span>
              )}
              {infoSection("އެޑްރެސް", participant.address)}
              {infoSection(
                "ބައިވެރިވާން އެދޭ ބައި",
                participant.competitionType
              )}
              {infoSection("އުމުރުފުރާ", participant.ageGroup)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BangiHuthubaParticipantDetails;
