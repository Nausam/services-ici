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
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
import ShufflePicker from "./ShufflePicker";
import {
  QUIZ_COMPETITION_DEFAULT_YEAR,
  QUIZ_COMPETITION_YEARS,
} from "@/constants";

const QuizStatistics = () => {
  const [stats, setStats] = useState<{
    dailyStats: Record<
      string,
      { total: number; correct: number; incorrect: number }
    >;
    topCorrect: { idCardNumber: string; name: string; count: number }[] | null;
    topIncorrect:
      | { idCardNumber: string; name: string; count: number }[]
      | null;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(
    QUIZ_COMPETITION_DEFAULT_YEAR
  );

  const { currentUser, isSuperAdmin } = useUser();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getQuizStatistics(selectedYear);

        // ✅ Keep `idCardNumber` when setting to state
        const formattedTopCorrect = data.topCorrect?.map((user) => ({
          idCardNumber: user.idCardNumber,
          name: user.name,
          count: user.count,
        }));

        // ✅ Filter to show only the highest scoring participants
        const highestCount = formattedTopCorrect?.[0]?.count || 0;
        const filteredTopCorrect = formattedTopCorrect?.filter(
          (user) => user.count === highestCount
        );

        const formattedTopIncorrect = data.topIncorrect?.map((user) => ({
          idCardNumber: user.idCardNumber,
          name: user.name,
          count: user.count,
        }));

        setStats({
          dailyStats: data.dailyStats,
          topCorrect: filteredTopCorrect || null, // ✅ Only top participants
          topIncorrect: formattedTopIncorrect || null,
        });
      } catch (error) {
        console.error("Error fetching quiz statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedYear]);

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
    <>
      {isSuperAdmin && (
        <div dir="rtl" className="grid gap-6 mt-10 font-dhivehi">
          <div className="flex flex-col items-center justify-center border border-cyan-200 rounded-xl p-6 bg-gradient-to-t from-cyan-50 to-cyan-100 shadow-md w-full">
            <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
              <h2 className="font-dhivehi text-3xl text-cyan-950 font-bold">
                އެންމެ ގިނައިން ރަނގަޅު ޖަވާބުދިން
              </h2>
              <select
                dir="rtl"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="border border-cyan-600 rounded-md px-3 py-1.5 w-28 bg-white text-cyan-900 font-semibold"
              >
                {QUIZ_COMPETITION_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 mt-10">
              {stats?.topCorrect?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 justify-center">
                  {stats.topCorrect.map((user, index) => (
                    <Link
                      key={user.idCardNumber + index}
                      href={`competitions/quiz-competition/${user.idCardNumber}?year=${selectedYear}`}
                    >
                      <div
                        key={user.idCardNumber + index}
                        className="flex justify-between items-center gap-2 bg-gradient-to-br from-cyan-400 to-cyan-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full shadow-lg border border-cyan-500 hover:shadow-xl transition-transform transform hover:-translate-y-1"
                        style={{
                          minWidth: "140px", // Smaller size for mobile
                          maxWidth: "200px", // Prevents stretching
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <span className="text-sm sm:text-lg font-semibold truncate">
                          {user.name}
                        </span>
                        <span className="bg-cyan-600 border border-cyan-500 text-white w-8 h-8 aspect-square rounded-full font-bold shadow-md flex items-center justify-center text-center text-sm sm:text-base">
                          {user.count}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No top users yet.</p>
              )}
            </div>
          </div>

          {/* <div>
            <ShufflePicker
              participants={stats?.topCorrect || []}
              onWinnersSelected={(winners) => {
                console.log("🏆 Winners:", winners);
                // You can store the winners or update state elsewhere
              }}
            />
          </div> */}

          <Card>
            <CardHeader>
              <CardTitle className="text-center md:text-3xl text-2xl text-cyan-950">
                ރަމަޟާން ދީނީ ސުވާލު މުބާރާތް 1446
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="border border-gray-300 shadow-md rounded-lg overflow-hidden mt-5">
                <TableHeader className="bg-gradient-to-br from-slate-100 to-slate-200">
                  <TableRow>
                    <TableHead className="text-lg text-center p-4 text-cyan-900">
                      ސުވާލު ނަންބަރު
                    </TableHead>
                    <TableHead className="text-lg text-center p-4 text-cyan-900">
                      ޖަވާބު ދިން ފަރާތްތައް
                    </TableHead>
                    <TableHead className="text-lg text-center p-4 text-cyan-900">
                      ރަނގަޅު ޖަވާބު ދިން
                    </TableHead>
                    <TableHead className="text-lg text-center p-4 text-cyan-900">
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
      )}
    </>
  );
};

export default QuizStatistics;
