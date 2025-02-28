"use client";

import React, { useEffect, useState } from "react";
import { getQuizStatistics } from "@/lib/actions/quizCompetition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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
      {/* <div className="flex items-center justify-center">
       
        <div className="flex flex-col items-center justify-center border  border-cyan-700/30 rounded-xl p-6 bg-gradient-to-br from-cyan-50 to-cyan-100 shadow-md w-full">
          <h2 className="font-dhivehi text-3xl text-cyan-800 font-bold mb-2">
            އެންމެ ގިނައިން ރަނގަޅު ޖަވާބުދިން
          </h2>
          <p className="text-2xl text-cyan-900 font-extrabold mt-4">
            {stats.topCorrect ? stats.topCorrect : " ނެތް "}
          </p>
        </div>
      </div> */}

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl text-cyan-800">
            ރަމަޟާން ދީނީ ސުވާލު މުބާރާތް 1446
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="border border-gray-300 shadow-md rounded-lg overflow-hidden mt-5">
            <TableHeader className="bg-gradient-to-br from-slate-100 to-slate-200">
              <TableRow>
                <TableHead className="text-lg text-center p-4 text-cyan-700">
                  ސުވާލު ނަންބަރު
                </TableHead>
                <TableHead className="text-lg text-center p-4 text-cyan-700">
                  ޖަވާބު ދިން ފަރާތްތައް
                </TableHead>
                <TableHead className="text-lg text-center p-4 text-cyan-700">
                  ރަނގަޅު ޖަވާބު ދިން
                </TableHead>
                <TableHead className="text-lg text-center p-4 text-cyan-700">
                  ރަނގަޅު ނޫން ޖަވާބު ދިން
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {Object.entries(stats.dailyStats).map(
                ([questionNumber, data], index) => (
                  <TableRow
                    key={questionNumber}
                    className={`border-b ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-all`}
                  >
                    <TableCell className="text-center text-lg font-semibold text-cyan-800 p-3">
                      {questionNumber}
                    </TableCell>
                    <TableCell className="text-center text-lg font-medium text-gray-700 p-3">
                      {data.total}
                    </TableCell>
                    <TableCell className="text-center text-lg font-bold text-green-600 p-3">
                      {data.correct}
                    </TableCell>
                    <TableCell className="text-center text-lg font-bold text-red-600 p-3">
                      {data.incorrect}
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizStatistics;
