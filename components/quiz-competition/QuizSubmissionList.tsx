"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getAllQuizSubmissions } from "@/lib/actions/quizCompetition";
import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";
import { Input } from "../ui/input";

interface QuizSubmission {
  fullName: string;
  idCardNumber: string;
  contactNumber: string;
  idCardUrl?: string;
  submissionDate: string;
}

// Function to get today's date in "YYYY-MM-DD" format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const QuizSubmissionsList = () => {
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  const limit = 15;

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const response = await getAllQuizSubmissions(
          limit,
          offset,
          selectedDate
        );
        setSubmissions(response.documents);
        setTotalPages(Math.ceil(response.total / limit)); // Calculate total pages
      } catch (err) {
        setError("Failed to fetch quiz submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentPage, selectedDate]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full mx-auto p-5 mt-20">
      <h1 className="text-3xl font-dhivehi text-start text-cyan-950 mb-5">
        މިއަދުގެ ސުވާލަށް ޖަވާބުދެއްވި ފަރާތްތައް
      </h1>

      {/* Date Filter Input */}
      <div className="flex  gap-4 mb-5">
        <div className="w-48">
          <Input
            dir="rtl"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border justify-end border-cyan-600 rounded-md px-3 py-1 w-full mt-5"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center h-screen items-center">
          <div className="flex flex-col items-center gap-4">
            {/* Spinner */}
            <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
          </div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-3xl font-dhivehi text-slate-500">
          ނެތް!
        </p>
      ) : (
        <div
          dir="rtl"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5"
        >
          {submissions.map((submission, index) => (
            <Q_ParticipantCard
              key={index}
              fullName={submission.fullName}
              idCardNumber={submission.idCardNumber}
              contactNumber={submission.contactNumber}
              href={`/competitions/quiz-competition/${submission.idCardNumber}`}
              idCardUrl={submission.idCardUrl}
            />
          ))}
        </div>
      )}

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

export default QuizSubmissionsList;
