"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMadhahaParticipantByDocumentId } from "@/lib/actions/madhaha.actions";
import { MadhahaCompetitionRegistration } from "@/types";
import PlaceholderCard from "@/components/PlaceholderCard";
import MadhahaCompetitionForm from "@/components/madhaha-competition/MadhahaForm";

const UpdateMadhahaPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [registration, setRegistration] =
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
          setRegistration({
            $id: data.$id,
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
          router.push("/competitions/madhaha-competition");
        }
      } catch (error) {
        console.error("Failed to fetch participant:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipant();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-16 h-16 border-4 border-dashed border-cyan-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!registration) {
    return (
      <div className="flex justify-center items-center h-screen">
        <PlaceholderCard title="ރެޖިސްޓްރޭޝަން ނުފެނުނު!" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto h-screen">
      <div className="my-10">
        <MadhahaCompetitionForm type="Update" registration={registration} />
      </div>
    </div>
  );
};

export default UpdateMadhahaPage;
