"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getHuthubaBangiParticipantByIdCard } from "@/lib/actions/huthubaBangi.actions";
import HuthubaBangiForm from "@/components/huthuba-bangi-competition/HuthubaBangiForm";
import { HuthubaBangiCompetitionRegistration } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { idCardNumber } = useParams();
  const [registrations, setRegistrations] =
    useState<HuthubaBangiCompetitionRegistration | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        if (!idCardNumber) return;

        const data = await getHuthubaBangiParticipantByIdCard(
          Array.isArray(idCardNumber) ? idCardNumber[0] : idCardNumber
        );

        if (data) {
          setRegistrations({
            fullName: data.fullName || "",
            address: data.address || "",
            idCardNumber: data.idCardNumber || "",
            contactNumber: data.contactNumber || "",
            competitionType: data.competitionType as
              | "ޙުތުބާ"
              | "ބަންގި"
              | "ދެބައި", // ✅ No conversion needed
            idCard: data.idCard || "",
            ageGroup: data.ageGroup || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch registration:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [idCardNumber]);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );

  return (
    <section className="max-w-7xl mx-auto h-screen">
      <div className="my-10">
        {registrations && (
          <HuthubaBangiForm registration={registrations} type="Update" />
        )}
      </div>
    </section>
  );
};

export default Page;
