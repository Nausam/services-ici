"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAllQuranCompetitionRegistrations } from "@/lib/actions/quranCompetition.actions";
import Q_ParticipantCard from "./Q_ParticipantCard";
import { QuranCompetitionRegistration } from "@/types";
import JSZip from "jszip";

const QuranCompetitionDashboard = () => {
  const [registrations, setRegistrations] = useState<
    QuranCompetitionRegistration[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchRegistrations = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const { documents, total } = await getAllQuranCompetitionRegistrations(
        itemsPerPage,
        offset
      );

      // Simulate total items count (if Appwrite doesn't provide it)
      setRegistrations(documents);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(currentPage);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

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

  const downloadIDCardsAsZip = async () => {
    const zip = new JSZip();

    const downloadFileAsBlob = async (url: string) => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/octet-stream", // Force download behavior
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.blob();
      } catch (error) {
        console.error("Error fetching file:", url, error);
        return null; // Skip the file if an error occurs
      }
    };

    const downloadPromises = registrations.map(async (reg) => {
      if (reg.idCard) {
        const blob = await downloadFileAsBlob(reg.idCard);
        if (blob) {
          // Dynamically detect file extension based on MIME type
          const fileType = blob.type;
          const fileExtension = fileType === "application/pdf" ? "pdf" : "jpg";

          const fileName = `${reg.fullName.replace(
            /\s+/g,
            "_"
          )}_IDCard.${fileExtension}`;
          zip.file(fileName, blob);
        }
      }
    });

    await Promise.all(downloadPromises); // Wait for all downloads to finish

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Quran_Competition_IDCards.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (registrations.length === 0) return <p>No registrations found.</p>;

  return (
    <div className="p-4 mt-10">
      <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
        ޤުރުއާން މުބާރާތުގެ ބައިވެރިން ({totalItems})
      </h2>
      <div className="flex justify-start mb-4 gap-4">
        <Button
          onClick={downloadIDCardsAsZip}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Download ID Cards (ZIP)
        </Button>
        <Button
          onClick={downloadCSV}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Download CSV
        </Button>
      </div>

      <select
        value={itemsPerPage}
        onChange={handleItemsPerPageChange}
        className="border border-cyan-600 bg-white text-cyan-800 rounded-md px-4 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-700 text-md font-dhivehi shadow-sm transition duration-200 ease-in-out mt-10 cursor-pointer"
      >
        <option value={3}>ޕޭޖެއްގަ 3</option>
        <option value={6}>ޕޭޖެއްގަ 6</option>
        <option value={9}>ޕޭޖެއްގަ 9</option>
        <option value={12}>ޕޭޖެއްގަ 12</option>
        <option value={16}>ޕޭޖެއްގަ 16</option>
      </select>

      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5"
      >
        {registrations.map((reg: any) => (
          <Q_ParticipantCard
            key={reg.idCardNumber}
            fullName={reg.fullName}
            idCardNumber={reg.idCardNumber}
            contactNumber={reg.contactNumber}
            href={`/competitions/quran-competition/${reg.idCardNumber}`}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Next
        </Button>
        <span className="text-cyan-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Previous
        </Button>
      </div>
    </div>
  );
};

export default QuranCompetitionDashboard;
