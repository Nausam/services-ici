"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllQuizSubmissions } from "@/lib/actions/quizCompetition";
import { useUser } from "@/providers/UserProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlaceholderCard from "../PlaceholderCard";
import Q_ParticipantCard from "../quran-competition/Q_ParticipantCard";
import { Input } from "../ui/input";

function SubmissionCardSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3">
      <Skeleton className="h-9 w-9 shrink-0 rounded-lg" />
      <Skeleton className="h-6 flex-1 max-w-[180px] rounded" />
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
  const limit = 15;
  const selectedYear = new Date(selectedDate).getFullYear();

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
          selectedYear,
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
        <div className="w-full mx-auto p-5 mt-20 max-w-6xl">
          <div
            className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
              <div className="flex items-center justify-start">
                <div className="w-40">
                  <Input
                    dir="rtl"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border border-cyan-200 rounded-lg px-3 py-2 h-9 text-sm focus:ring-cyan-500 focus:border-cyan-400"
                  />
                </div>
              </div>
              <h2 className="font-dhivehi text-xl sm:text-2xl text-cyan-950 font-bold text-center">
                މިއަދުގެ ސުވާލަށް ޖަވާބުދެއްވި ފަރާތްތައް
              </h2>
              <div className="flex items-center justify-end" aria-hidden="true">
                <div className="w-40" />
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <SubmissionCardSkeleton key={i} />
                  ))}
                </div>
              ) : error ? (
                <p className="text-center text-red-500 py-8">{error}</p>
              ) : submissions.length === 0 ? (
                <p className="text-center text-lg font-dhivehi text-slate-500 py-12">
                  ނެތް!
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {submissions.map((submission, index) => (
                      <Q_ParticipantCard
                        key={`${submission.idCardNumber}-${index}`}
                        fullName={submission.fullName}
                        idCardNumber={submission.idCardNumber}
                        contactNumber={submission.contactNumber}
                        href={`/competitions/quiz-competition/${submission.idCardNumber}/${submission.questionNumber}?year=${selectedYear}`}
                        idCardUrl={submission.idCardUrl}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      <Button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="size-9 p-0 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-40 disabled:pointer-events-none"
                        aria-label="ދެނެވޭ"
                      >
                        <ChevronRight className="size-5" />
                      </Button>
                      <span className="min-w-[4rem] text-center text-slate-600 font-dhivehi text-sm">
                        {currentPage} / {totalPages}
                      </span>
                      <Button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="size-9 p-0 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-40 disabled:pointer-events-none"
                        aria-label="ކުރީން"
                      >
                        <ChevronLeft className="size-5" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <PlaceholderCard title="ސުވާލު މުބާރާތުގެ އެކްސެސް ތިޔަފަރާތަށް ލިބިފައެއް ނުވޭ!" />
      )}
    </>
  );
};

export default QuizSubmissionsList;
