"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  QUIZ_COMPETITION_DEFAULT_YEAR,
  QUIZ_COMPETITION_YEARS,
} from "@/constants";
import { getQuizStatistics } from "@/lib/actions/quizCompetition";
import { useUser } from "@/providers/UserProvider";
import { ChevronLeft, ChevronRight, Download, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function QuizStatisticsSkeleton() {
  return (
    <div dir="rtl" className="grid gap-6 mt-10 font-dhivehi">
      <div className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
        <div className="flex justify-between items-center gap-3 px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-[88px]" />
            <Skeleton className="h-6 w-40 rounded-full" />
          </div>
          <Skeleton className="h-7 w-56" />
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 flex-1 max-w-[16rem]" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
          <Skeleton className="h-7 w-64 mx-auto rounded" />
        </div>
        <div className="p-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <Skeleton className="h-[320px] w-full rounded-lg" />
          </div>
        </div>
      </div>
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
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { isSuperAdmin } = useUser();

  // Filter and paginate top correct users
  const filteredTopCorrect = useMemo(() => {
    if (!stats?.topCorrect) return [];
    const term = searchTerm.trim().toLowerCase();
    if (!term) return stats.topCorrect;
    return stats.topCorrect.filter((u) => u.name.toLowerCase().includes(term));
  }, [stats?.topCorrect, searchTerm]);

  const totalFiltered = filteredTopCorrect.length;
  const totalPages = Math.max(
    1,
    itemsPerPage === -1 ? 1 : Math.ceil(totalFiltered / itemsPerPage),
  );
  const paginatedTopCorrect = useMemo(() => {
    if (itemsPerPage === -1) return filteredTopCorrect;
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTopCorrect.slice(start, start + itemsPerPage);
  }, [filteredTopCorrect, currentPage, itemsPerPage]);

  const goToPage = (page: number) =>
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));

  const downloadTopCorrectCSV = () => {
    if (!stats?.topCorrect?.length) return;
    const BOM = "\uFEFF";
    const header = "Name,ID Card Number\n";
    const rows = stats.topCorrect
      .map(
        (u) =>
          `"${(u.name ?? "").replace(/"/g, '""')}","${(u.idCardNumber ?? "").replace(/"/g, '""')}"`
      )
      .join("\n");
    const csv = BOM + header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `top-correct-answers-${selectedYear}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const fetchStats = async () => {
      try {
        // When 2025 is selected, fetch with no year filter (null) for legacy/all data
        const yearParam = selectedYear === 2025 ? undefined : selectedYear;
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
    return <>{isSuperAdmin && <QuizStatisticsSkeleton />}</>;
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
          {/* Redesigned "Most Correct Answers" card */}
          <div className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
              <div className="flex items-center justify-start">
                <div className="relative">
                  <Select
                    value={String(selectedYear)}
                    onValueChange={(v) => setSelectedYear(Number(v))}
                  >
                    <SelectTrigger className="w-[88px] h-9 font-dhivehi bg-white border-cyan-200 shadow-sm">
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
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 border-2 border-cyan-400/40 border-t-cyan-600 rounded-full animate-spin" />
                  )}
                </div>
              </div>
              <h2 className="font-dhivehi text-xl sm:text-2xl text-cyan-950 font-bold text-center">
                އެންމެ ގިނައިން ރަނގަޅު ޖަވާބުދިން
              </h2>
              <div className="flex items-center justify-end min-w-[88px]">
                {stats?.topCorrect?.length ? (
                  <span className="font-dhivehi text-sm font-medium text-cyan-800 whitespace-nowrap">
                    {totalFiltered} ބައިވެރިން
                  </span>
                ) : (
                  <div className="w-[88px]" aria-hidden="true" />
                )}
              </div>
            </div>

            {/* Content */}
            {stats?.topCorrect?.length ? (
              <div className="p-5 space-y-4">
                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-cyan-600/70 pointer-events-none" />
                    <Input
                      type="text"
                      placeholder="ނަން ސަރޗްކުރައްވާ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full font-dhivehi text-right pr-10 pl-3 h-9 border-cyan-200 focus:ring-cyan-500 focus:border-cyan-400 rounded-lg bg-slate-50/50"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      onClick={downloadTopCorrectCSV}
                      variant="outline"
                      size="sm"
                      className="h-9 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 font-dhivehi"
                    >
                      <Download className="size-4 shrink-0 ml-1.5" />
                      Download CSV
                    </Button>
                    <select
                      value={itemsPerPage}
                      onChange={(e) =>
                        setItemsPerPage(
                          e.target.value === "all" ? -1 : Number(e.target.value),
                        )
                      }
                      className="h-9 rounded-lg border border-cyan-200 bg-slate-50/50 text-cyan-800 px-3 text-sm font-dhivehi focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 cursor-pointer"
                    >
                      <option value={8}>ޕޭޖެއްގަ 8</option>
                      <option value={12}>ޕޭޖެއްގަ 12</option>
                      <option value={24}>ޕޭޖެއްގަ 24</option>
                      <option value={48}>ޕޭޖެއްގަ 48</option>
                      <option value="all">ހުރިހާ</option>
                    </select>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-14 rounded-xl" />
                    ))}
                  </div>
                ) : totalFiltered === 0 ? (
                  <p className="text-slate-500 text-center py-10 font-dhivehi text-lg">
                    ސަރޗް ނަމަކު ނުފެނުނީ
                  </p>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {paginatedTopCorrect.map((user, index) => (
                        <Link
                          key={user.idCardNumber + index}
                          href={`/competitions/quiz-competition/${user.idCardNumber}?year=${selectedYear}`}
                          className="group block"
                        >
                          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/30 px-4 py-3 transition-all hover:border-cyan-300 hover:bg-cyan-50/50 hover:shadow-sm">
                            <span className="flex-shrink-0 w-9 h-9 rounded-full bg-cyan-600 text-white font-bold text-sm flex items-center justify-center">
                              {user.count}
                            </span>
                            <span className="font-dhivehi font-medium text-cyan-900 truncate flex-1 min-w-0 group-hover:text-cyan-800">
                              {user.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {itemsPerPage !== -1 && totalPages > 1 && (
                      <div className="flex flex-row-reverse items-center justify-center gap-2 pt-2">
                        <Button
                          onClick={() => goToPage(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          className="size-9 p-0 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="ކުރީން"
                        >
                          <ChevronLeft className="size-5" />
                        </Button>
                        <span className="min-w-[4rem] text-center text-slate-600 font-dhivehi text-sm">
                          {currentPage} / {totalPages}
                        </span>
                        <Button
                          onClick={() => goToPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          className="size-9 p-0 border-cyan-200 text-cyan-700 hover:bg-cyan-50 hover:border-cyan-300 disabled:opacity-40 disabled:pointer-events-none"
                          aria-label="ދެނެވޭ"
                        >
                          <ChevronRight className="size-5" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : !loading ? (
              <div className="px-5 py-10 text-center">
                <p className="text-slate-500 font-dhivehi text-lg">
                  {stats?.topCorrect?.length === 0
                    ? "މި އަދުގެ ސުވާލަށް އެންމެން ރަނގަޅު ޖަވާބު ނުދިނީ"
                    : "މި އަދުގެ ސުވާލަށް ރަނގަޅު ޖަވާބު ދިނި ބޭފުޅަކު ނެތް"}
                </p>
              </div>
            ) : null}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
                <Skeleton className="h-7 w-64 mx-auto rounded" />
              </div>
              <div className="p-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <Skeleton className="h-[320px] w-full rounded-lg" />
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-cyan-100 bg-white shadow-sm overflow-hidden">
              <div className="px-5 py-4 bg-gradient-to-l from-cyan-50/80 to-white border-b border-cyan-100">
                <h2 className="font-dhivehi text-xl sm:text-2xl text-cyan-950 font-bold text-center">
                  ރަމަޟާން ދީނީ ސުވާލު މުބާރާތް 1447
                </h2>
              </div>
              <div className="p-5">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="h-[340px] w-full font-dhivehi">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(stats.dailyStats).map(
                          ([questionNumber, data]) => ({
                            question: questionNumber,
                            total: data.total,
                            correct: data.correct,
                            incorrect: data.incorrect,
                          }),
                        )}
                        margin={{ top: 12, right: 12, left: 0, bottom: 8 }}
                        barCategoryGap={6}
                        barGap={2}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e2e8f0"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="question"
                          tick={{ fill: "#0e7490", fontSize: 11 }}
                          tickLine={false}
                          axisLine={{ stroke: "#cbd5e1" }}
                          interval={0}
                        />
                        <YAxis
                          tick={{ fill: "#64748b", fontSize: 12 }}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            fontFamily: "inherit",
                          }}
                          formatter={(value, name) => {
                            const labels: Record<string, string> = {
                              correct: "ރަނގަޅު ޖަވާބު ދިން",
                              incorrect: "ރަނގަޅު ނޫން ޖަވާބު ދިން",
                              total: "ޖަވާބު ދިން ފަރާތްތައް",
                            };
                            return [value ?? 0, labels[String(name)] ?? name];
                          }}
                          labelFormatter={(label) => `ސުވާލު ${label}`}
                          labelStyle={{ color: "#0e7490" }}
                          itemStyle={{ paddingTop: 4 }}
                          cursor={{ fill: "#f0fdfa", opacity: 0.6 }}
                          content={({ active, payload, label }) => {
                            if (
                              !active ||
                              !payload?.length ||
                              payload[0].payload == null
                            )
                              return null;
                            const { total, correct, incorrect } =
                              payload[0].payload;
                            return (
                              <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 shadow-md text-sm">
                                <p className="font-semibold text-cyan-800 mb-2 font-dhivehi">
                                  ސުވާލު {label}
                                </p>
                                <div className="space-y-1 font-dhivehi">
                                  <p className="text-slate-700">
                                    ޖަވާބު ދިން ފަރާތްތައް:{" "}
                                    <strong>{total}</strong>
                                  </p>
                                  <p className="text-emerald-600">
                                    ރަނގަޅު ޖަވާބު ދިން:{" "}
                                    <strong>{correct}</strong>
                                  </p>
                                  <p className="text-rose-600">
                                    ރަނގަޅު ނޫން ޖަވާބު ދިން:{" "}
                                    <strong>{incorrect}</strong>
                                  </p>
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: 12 }}
                          formatter={(value) => {
                            const labels: Record<string, string> = {
                              correct: "ރަނގަޅު ޖަވާބު ދިން",
                              incorrect: "ރަނގަޅު ނޫން ޖަވާބު ދިން",
                            };
                            return labels[value] ?? value;
                          }}
                          content={({ payload }) => (
                            <div className="flex flex-wrap justify-center gap-4 pt-2 font-dhivehi text-sm">
                              {payload?.map((entry) => {
                                const labels: Record<string, string> = {
                                  correct: "ރަނގަޅު ޖަވާބު ދިން",
                                  incorrect: "ރަނގަޅު ނޫން ޖަވާބު ދިން",
                                };
                                const label =
                                  labels[String(entry.value ?? "")] ??
                                  entry.value;
                                return (
                                  <div
                                    key={String(entry.value ?? "")}
                                    className="flex items-center gap-2"
                                    style={{ color: entry.color }}
                                  >
                                    <span
                                      className="shrink-0 rounded-sm"
                                      style={{
                                        width: 12,
                                        height: 12,
                                        backgroundColor: entry.color,
                                      }}
                                    />
                                    <span>{label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        />
                        <Bar
                          dataKey="correct"
                          name="correct"
                          fill="#059669"
                          stackId="answers"
                          radius={[0, 0, 0, 0]}
                          maxBarSize={28}
                        />
                        <Bar
                          dataKey="incorrect"
                          name="incorrect"
                          fill="#e11d48"
                          stackId="answers"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={28}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default QuizStatistics;
