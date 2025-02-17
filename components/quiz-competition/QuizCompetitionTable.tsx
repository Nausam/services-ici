"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getAllQuizSubmissions } from "@/lib/actions/quizCompetition";
import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";

const QuizCompetitionTable = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const fetchParticipants = async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const { documents, total } = await getAllQuizSubmissions(
        itemsPerPage,
        offset
      );
      setParticipants(documents);
      setTotalItems(total);
    } catch (error) {
      console.error("Failed to fetch quiz participants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants(currentPage);
  }, [currentPage, itemsPerPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const downloadCSV = () => {
    if (participants.length === 0) return;

    const csvHeader = "Full Name, ID Card, Contact Number, Answer, Date\n";

    const csvRows = participants
      .map((p: any) =>
        [
          `"${p.fullName}"`,
          `"${p.idCardNumber}"`,
          `"${p.contactNumber}"`,
          `"${p.answer}"`,
          `"${new Date(p.submissionDate).toLocaleString()}"`,
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
    link.download = "quiz_submissions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = parseInt(e.target.value);
    setItemsPerPage(value === -1 ? totalItems : value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (participants.length === 0) {
    return (
      <p className="text-center text-gray-500">No quiz participants found.</p>
    );
  }

  return (
    <div className="p-4 mt-10">
      <h2 className="text-3xl font-dhivehi mb-10 text-right text-cyan-950">
        ރަމަޟާން ދީނީ ސުވާލު މުބާރާތް ({totalItems})
      </h2>
      <div className="flex justify-start mb-4 gap-4">
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
        <option value={4}>ޕޭޖެއްގަ 4</option>
        <option value={8}>ޕޭޖެއްގަ 8</option>
        <option value={12}>ޕޭޖެއްގަ 12</option>
        <option value={16}>ޕޭޖެއްގަ 16</option>
        <option value={20}>ޕޭޖެއްގަ 20</option>
        <option value={-1}>ހުރިހާ</option>
      </select>

      <div
        dir="rtl"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5"
      >
        {participants.map((p: any, index) => (
          <Q_ParticipantCard
            key={p.idCardNumber + index}
            fullName={p.fullName}
            idCardNumber={p.idCardNumber}
            contactNumber={p.contactNumber}
            href={`/quiz/participants/${p.idCardNumber}`}
          />
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-10">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Previous
        </Button>
        <span className="text-cyan-700 font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default QuizCompetitionTable;
