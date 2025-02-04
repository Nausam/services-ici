"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllQuranCompetitionRegistrations } from "@/lib/actions/quranCompetition.actions";
import Q_ParticipantCard from "./Q_ParticipantCard";
import { QuranCompetitionRegistration } from "@/types";

const QuranCompetitionDashboard = () => {
  const [registrations, setRegistrations] = useState<
    QuranCompetitionRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await getAllQuranCompetitionRegistrations();
        setRegistrations(data);
      } catch (error) {
        console.error("Failed to fetch registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const downloadCSV = () => {
    if (registrations.length === 0) return;

    // CSV Header in Dhivehi (Reversed Order)
    const csvHeader = `
އިޤްރާރު,ފައިނަލް ނުބަލައި ނިމޭ,ފައިނަލް ނުބަލައި ފެށޭ,ފައިނަލް ބަލައިގެން ނިމޭ,ފައިނަލް ބަލައިގެން ފެށޭ,ނުބަލައި ނިމޭ,ނުބަލައި ފެށޭ,ބަލައިގެން ނިމޭ,ބަލައިގެން ފެށޭ,އިޤްރާރު ކުރުން އަށްވަނީ,އިޤްރާރު ކުރި ތާރީހް,ބޭންކުގެ ނަން,ބޭންކު އެކައުންޓް ނަންބަރު,ބޭންކު އެކައުންޓް ނަން,ބެލެނިވެރިޔާގެ ފޯނު ނަންބަރު,ހުރިގާތް,ބެލެނިވެރިޔާގެ ދާއިމީ އެޑްރެސް,ބެލެނިވެރިޔާގެ އައިޑީކާޑް,ބެލެނިވެރިޔާގެ ނަން,ފޯނު ނަންބަރު,އުފަން ތާރީހް,ޖިންސު,ދާއިމީ އެޑްރެސް,އައިޑީކާޑް ނަންބަރު,ފުރިހަމަ ނަން\n`;

    const csvRows = registrations
      .map((reg: any) =>
        [
          reg.agreeToTerms ? "✔️ އިޤްރާރު ކުރެވިއްޖެ" : "❌ ނުކުރެވިއްޖެ",
          reg.finalRoundNubalaaKiyevunNimey ? "✔️" : "❌",
          reg.finalRoundNubalaaKiyevunFeshey ? "✔️" : "❌",
          reg.finalRoundBalaigenKiyevunNimey ? "✔️" : "❌",
          reg.finalRoundBalaigenKiyevunFeshey ? "✔️" : "❌",
          reg.nubalaaKiyevunNimey ? "✔️" : "❌",
          reg.nubalaaKiyevunFeshey ? "✔️" : "❌",
          reg.balaigenKiyevunNimey ? "✔️" : "❌",
          reg.balaigenKiyevunFeshey ? "✔️" : "❌",
          reg.agreeyerName,
          reg.agreedDate,
          reg.bankName,
          reg.bankAccountNumber,
          reg.bankAccountName,
          reg.parentContactNumber || "-",
          reg.relationship || "-",
          reg.parentAddress || "-",
          reg.parentIdCardNumber || "-",
          reg.parentName || "-",
          reg.contactNumber,
          reg.dateOfBirth,
          reg.sex,
          reg.address,
          reg.idCardNumber,
          reg.fullName,
        ].join(",")
      )
      .join("\n");

    const csvContent = csvHeader + csvRows;
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quran_competition_data.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-cyan-600 text-4xl font-semibold animate-pulse font-dhivehi">
          ޕާޓިސިޕަންޓްގެ ތަފްޞީލް ލޯޑިންގް
        </p>
      </div>
    );
  if (registrations.length === 0) return <p>No registrations found.</p>;

  return (
    <div className="p-4">
      <div className="flex justify-end mb-4">
        <Button
          onClick={downloadCSV}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Download CSV
        </Button>
      </div>

      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {registrations.map((reg: any) => (
          <Q_ParticipantCard
            key={reg.idCardNumber}
            fullName={reg.fullName}
            idCardNumber={reg.idCardNumber}
            contactNumber={reg.contactNumber}
          />
        ))}
      </div>
    </div>
  );
};

export default QuranCompetitionDashboard;
