"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getQuizSubmissionById } from "@/lib/actions/quizCompetition";
import { Models } from "node-appwrite";

const QuizSubmissionDetails = () => {
  const { idCardNumber } = useParams();
  const [submission, setSubmission] = useState<Models.Document | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getQuizSubmissionById(idCardNumber);
        setSubmission(response);
      } catch (err) {
        setError("ޕާޓިސިޕަންޓް ތަފްޞީލް ނުފެނުނު");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmission();
  }, [idCardNumber]);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl font-semibold font-dhivehi">
          {error}
        </p>
      </div>
    );

  if (!submission)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-xl font-semibold font-dhivehi">
          ޕާޓިސިޕަންޓް ނުފެނުނު.
        </p>
      </div>
    );

  const infoSection = (label: string, value: any) => (
    <div className="flex justify-between items-center p-4 border-b last:border-none">
      <p className="text-xl font-medium text-cyan-900">{label}</p>
      <p className="text-lg font-semibold text-slate-500">{value || "ނެތް"}</p>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="h-full flex items-center justify-center p-4 mt-10"
    >
      <div className="max-w-5xl w-full mt-5">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 p-6">
            <h2 className="text-3xl font-bold text-white text-center font-dhivehi">
              ސުވާލު ނަންބަރު {submission.questionNumber}
            </h2>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid font-dhivehi grid-cols-1 gap-4">
              {infoSection("ފުރިހަމަ ނަން", submission.fullName)}
              {infoSection(
                "އައިޑީކާޑް",
                <span className="font-sans font-semibold">
                  {submission.idCardNumber}
                </span>
              )}
              {infoSection("ފޯނު ނަންބަރު", submission.contactNumber)}
              {infoSection("ދެއްވި ޖަވާބު", submission.answer)}
              {infoSection(
                "ޖަވާބު ރަނގަޅު؟",
                submission.correct ? "✅ ރަނގަޅު" : "❌ ނޫން"
              )}
              {infoSection(
                "ޖަވާބުދެއްވި ތާރީހާއި ގަޑި",
                <span className="font-sans font-semibold">
                  {new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(new Date(submission.$createdAt))}{" "}
                  -{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // ✅ AM/PM format
                  }).format(new Date(submission.$createdAt))}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSubmissionDetails;
