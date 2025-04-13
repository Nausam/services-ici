"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { HuthubaBangiCompetitionRegistration, MadhahaCompetitionRegistration } from "@/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import PlaceholderCard from "@/components/PlaceholderCard";
import { getMadhahaParticipantByDocumentId, getMadhahaParticipantByIdCard } from "@/lib/actions/madhaha.actions";

const MadhahaParticipantDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const [participant, setParticipant] =
    useState<MadhahaCompetitionRegistration | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        if (!id) return;

        const data = await getMadhahaParticipantByDocumentId(
  Array.isArray(id) ? id[0] : id
);


        if (data) {
          // ✅ Type assertion to match the expected type
          setParticipant({
          fullName: data.fullName || "",
          address: data.address || "",
          idCardNumber: data.idCardNumber || "",
          contactNumber: data.contactNumber || "",
          ageGroup: data.ageGroup || "",
          groupOrSolo: data.groupOrSolo || "",
          groupMembers: data.groupMembers || [],
          madhahaName: data.madhahaName || "",
          madhahaLyrics: data.madhahaLyrics || "",
          idCard: data.idCard || "",
          groupName: data.groupName || "",
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
  }, [id, router]);

  // ✅ Helper Function to Render Info Sections
  const infoSection = (label: string, value: any) => (
    <div className="flex justify-between items-center p-4 border-b last:border-none">
      <p className="text-xl font-medium text-cyan-900">{label}</p>
      <div className="text-lg font-semibold text-slate-500">{value || "ނެތް"}</div>
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
  <div dir="rtl" className="h-full flex items-center justify-center p-4 mt-10">
    <div className="max-w-5xl w-full">
      <div className="bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-6 rounded-t-xl">
          <h2 className="text-3xl font-bold text-white text-center font-dhivehi leading-relaxed">
            {participant.groupName ? participant.groupName : participant.fullName}
          </h2>
        </div>

        {/* Details */}
        <div className="p-6">
          <div className="grid font-dhivehi grid-cols-1 gap-4">
            {infoSection(participant.groupName ? "ގްރޫޕްގެ ލީޑަރު" : "ފުރިހަމަ ނަން", participant.fullName)}
            {infoSection(
              "އައިޑީ ކާޑް",
              <span className="font-mono font-semibold">{participant.idCardNumber}</span>
            )}
            {infoSection(
              "ފޯނު ނަންބަރު",
              <span className="font-mono font-semibold">{participant.contactNumber}</span>
            )}
            {infoSection("އެޑްރެސް", participant.address)}
            {infoSection("އުމުރުފުރާ", participant.ageGroup || "ނެތް")}
           {participant.groupName ? (<></>) : infoSection("ގުރޫޕް / ވަކިވަކިން", participant.groupOrSolo)}
            {participant.groupName && infoSection("ގުރޫޕް ނަން", participant.groupName)}
            {participant.groupMembers && participant.groupMembers.length > 0 && (
  <div className="flex justify-between items-start p-4 border-b last:border-none">  
    <p className="text-xl font-medium text-cyan-900">ގުރޫޕް މެމްބަރުން</p>
    <p className="text-lg font-semibold text-slate-500 text-right font-dhivehi break-words max-w-[70%] leading-relaxed">
      {participant.groupMembers.join("، ")}
    </p>
  </div>
)}

            {participant.madhahaName && infoSection("މަދަހަ ނަން", participant.madhahaName)}
            {participant.madhahaLyrics && infoSection("މަދަހަ ލިޔުން", participant.madhahaLyrics)}
            
          </div>
        </div>
      </div>
    </div>
  </div>
);

};

export default MadhahaParticipantDetails;
