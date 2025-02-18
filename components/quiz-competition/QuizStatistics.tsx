"use client";

import React, { useEffect, useState } from "react";
import { getQuizStatistics } from "@/lib/actions/quizCompetition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const QuizStatistics = () => {
  const [stats, setStats] = useState<{
    dailyStats: Record<
      string,
      { total: number; correct: number; incorrect: number }
    >;
    topCorrect: string | null;
    topIncorrect: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getQuizStatistics();
        setStats(data);
      } catch (error) {
        console.error("Error fetching quiz statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center h-screen items-center">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      </div>
    );

  if (!stats) {
    return (
      <p className="text-center text-gray-500">No statistics available.</p>
    );
  }

  return (
    <div dir="rtl" className="grid gap-6 mt-10 font-dhivehi">
      <div className="flex items-center justify-center">
        {/* Most Correct Answers */}
        <div className="flex flex-col items-center justify-center border  border-cyan-700/50 rounded-xl p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-md w-full">
          <h2 className="font-dhivehi text-3xl text-cyan-800 font-bold mb-2">
            އެންމެ ގިނައިން ރަނގަޅު ޖަވާބުދިން
          </h2>
          <p className="text-2xl text-cyan-900 font-extrabold mt-4">
            {stats.topCorrect ? stats.topCorrect : " ނެތް "}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-cyan-950">
            {" "}
            ސުވާލު މުބާރާތުގެ ސްޓެޓިސްޓިކްސް{" "}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-xl text-cyan-900">
                  ސުވާލު ނަންބަރު
                </th>
                <th className="border border-gray-300 p-2 text-xl text-cyan-900">
                  ޖަވާބު ދިން ފަރާތްތައް
                </th>
                <th className="border border-gray-300 p-2 text-xl text-cyan-900">
                  ރަނގަޅު ޖަވާބު ދިން ފަރާތްތައް
                </th>
                <th className="border border-gray-300 p-2 text-xl text-cyan-900">
                  ރަނގަޅު ނޫން ޖަވާބު ދިން ފަރާތްތައް
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.dailyStats).map(
                ([questionNumber, data]) => (
                  <tr key={questionNumber}>
                    <td className="border border-gray-300 p-2 text-center text-lg text-cyan-800">
                      {questionNumber}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-lg text-cyan-800">
                      {data.total}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-green-600 text-lg">
                      {data.correct}
                    </td>
                    <td className="border border-gray-300 p-2 text-center text-red-600 text-lg">
                      {data.incorrect}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizStatistics;
