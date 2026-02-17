"use client";

import React, { useEffect, useState } from "react";
import { getQuizStatistics } from "@/lib/actions/quizCompetition";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/providers/UserProvider";
import Link from "next/link";
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

function QuizStatisticsSkeleton() {
  return (
    <div dir="rtl" className="grid gap-6 mt-10 font-dhivehi">
      <div className="flex flex-col items-center justify-center border border-cyan-200 rounded-xl p-6 bg-gradient-to-t from-cyan-50 to-cyan-100 shadow-md w-full">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-[100px]" />
        </div>
        <div className="flex gap-4 mt-10 w-full justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className="h-10 rounded-full min-w-[140px] max-w-[200px]"
              />
            ))}
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="border border-gray-300 shadow-md rounded-lg overflow-hidden mt-5">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
            <div className="bg-white divide-y">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div
                  key={i}
                  className="p-3 grid grid-cols-4 gap-4 items-center"
                >
                  <Skeleton className="h-5 w-8" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
  const [selectedYear, setSelectedYear] = useState(
    QUIZ_COMPETITION_DEFAULT_YEAR,
  );

  const { isSuperAdmin } = useUser();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetchStats = async () => {
      try {
        // When 2025 is selected, fetch with no year filter (null) for legacy/all data
        const yearParam =
          selectedYear === 2025 ? undefined : selectedYear;
        const data = await getQuizStatistics(yearParam);
        if (cancelled) return;

        // ✅ Keep `idCardNumber` when setting to state
        const formattedTopCorrect = data.topCorrect?.map((user) => ({
          idCardNumber: user.idCardNumber,
          name: user.name,
          count: user.count,
        }));

        // ✅ Filter to show only the highest scoring participants
        const highestCount = formattedTopCorrect?.[0]?.count || 0;
        const filteredTopCorrect = formattedTopCorrect?.filter(
          (user) => user.count === highestCount,
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
        if (!cancelled) console.error("Error fetching quiz statistics:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [selectedYear]);

  if (loading && !stats) {
    return (
      <>
        {isSuperAdmin && <QuizStatisticsSkeleton />}
      </>
    );
  }

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
            <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
              <h2 className="font-dhivehi text-3xl text-cyan-950 font-bold">
                އެންމެ ގިނައިން ރަނގަޅު ޖަވާބުދިން
              </h2>
              <div className="relative">
                <Select
                value={String(selectedYear)}
                onValueChange={(v) => setSelectedYear(Number(v))}
              >
                <SelectTrigger className="w-[100px] font-dhivehi">
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
                {loading && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-cyan-600/30 border-t-cyan-600 rounded-full animate-spin" />
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-10">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 justify-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton
                      key={i}
                      className="h-10 rounded-full min-w-[140px] max-w-[200px]"
                    />
                  ))}
                </div>
              ) : stats?.topCorrect?.length ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4 justify-center">
                  {stats.topCorrect.map((user, index) => (
                    <Link
                      key={user.idCardNumber + index}
                      href={`/competitions/quiz-competition/${user.idCardNumber}?year=${selectedYear}`}
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

          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-64 mx-auto" />
              </CardHeader>
              <CardContent>
                <div className="border border-gray-300 shadow-md rounded-lg overflow-hidden mt-5">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-4 grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <Skeleton key={i} className="h-6" />
                    ))}
                  </div>
                  <div className="bg-white divide-y">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="p-3 grid grid-cols-4 gap-4 items-center"
                      >
                        <Skeleton className="h-5 w-8" />
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                        <Skeleton className="h-5 w-12" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center md:text-3xl text-2xl text-cyan-950">
                ރަމަޟާން ދީނީ ސުވާލު މުބާރާތް 1447
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
                    ),
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          )}
        </div>
      )}
    </>
  );
};

export default QuizStatistics;
