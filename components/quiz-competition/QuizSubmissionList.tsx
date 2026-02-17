"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getAllQuizSubmissions } from "@/lib/actions/quizCompetition";
import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";
import { Input } from "../ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/providers/UserProvider";
import PlaceholderCard from "../PlaceholderCard";
import {
  QUIZ_COMPETITION_DEFAULT_YEAR,
  QUIZ_COMPETITION_YEARS,
} from "@/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SubmissionCardSkeleton() {
  return (
    <div className="flex items-center justify-between border border-slate-200 rounded-xl p-5 bg-cyan-50/30">
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-7 w-[180px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
    </div>
  );
}

interface QuizSubmission {
  fullName: string;
  idCardNumber: string;
  contactNumber: string;
  idCardUrl?: string;
  submissionDate: string;
  questionNumber: string;
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
  const [selectedYear, setSelectedYear] = useState(QUIZ_COMPETITION_DEFAULT_YEAR);
  const limit = 15;

  const { isSuperAdmin } = useUser();

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const offset = (currentPage - 1) * limit;
        const response = await getAllQuizSubmissions(
          limit,
          offset,
          selectedDate,
          selectedYear
        );
        setSubmissions(response.documents);
        setTotalPages(Math.ceil(response.total / limit));
      } catch (err) {
        setError("Failed to fetch quiz submissions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [currentPage, selectedDate, selectedYear]);

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
    <>
      {isSuperAdmin ? (
        <div className="w-full mx-auto p-5 mt-20">
          <h1 className="md:text-3xl text-2xl font-dhivehi text-start text-cyan-950 mb-5">
            މިއަދުގެ ސުވާލަށް ޖަވާބުދެއްވި ފަރާތްތައް
          </h1>

          {/* Year and Date Filters */}
          <div className="flex flex-wrap gap-4 mb-5">
            <div className="w-32">
              <label className="font-dhivehi text-cyan-900 block mb-1">
                އަހަރު
              </label>
              <Select
                value={String(selectedYear)}
                onValueChange={(v) => setSelectedYear(Number(v))}
              >
                <SelectTrigger className="border-cyan-600 font-dhivehi">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUIZ_COMPETITION_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <label className="font-dhivehi text-cyan-900 block mb-1">
                ދުވަސް
              </label>
              <Input
                dir="rtl"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border border-cyan-600 rounded-md px-3 py-1 w-full"
              />
            </div>
          </div>

          {loading ? (
            <div
              dir="rtl"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-5"
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <SubmissionCardSkeleton key={i} />
              ))}
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
                  href={`/competitions/quiz-competition/${submission.idCardNumber}/${submission.questionNumber}?year=${selectedYear}`}
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
      ) : (
        <PlaceholderCard title="ސުވާލު މުބާރާތުގެ އެކްސެސް ތިޔަފަރާތަށް ލިބިފައެއް ނުވޭ!" />
      )}
    </>
  );
};

export default QuizSubmissionsList;
