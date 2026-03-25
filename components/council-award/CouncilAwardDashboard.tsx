"use client";

import React, { useEffect, useState } from "react";
import {
  Award,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Trash2,
  User,
} from "lucide-react";
import PlaceholderCard from "@/components/PlaceholderCard";
import {
  deleteCouncilAwardRegistration,
  getAllCouncilAwardRegistrations,
} from "@/lib/actions/councilAward.actions";
import type { CouncilAwardDocument } from "@/types";

function formatDisplayDate(iso: string | null | undefined) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function DateText({ children }: { children: React.ReactNode }) {
  return <span dir="ltr" style={{ unicodeBidi: "embed" }}>{children}</span>;
}

function dateRangeLabel(doc: CouncilAwardDocument) {
  if (doc.examDate) return formatDisplayDate(doc.examDate);
  const s = formatDisplayDate(doc.startDate);
  const e = formatDisplayDate(doc.endDate);
  if (s === "—" && e === "—") return "—";
  return `${s} – ${e}`;
}

function truncateCategory(cat: string, max = 60) {
  if (!cat || cat.length <= max) return cat;
  return cat.slice(0, max) + "...";
}

const CouncilAwardDashboard = () => {
  const [documents, setDocuments] = useState<CouncilAwardDocument[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<string>("");

  const fetchDocs = async (page: number) => {
    try {
      const isSearching = debouncedSearchTerm.trim().length > 0;

      if (isSearching) {
        const { documents: docs } = await getAllCouncilAwardRegistrations(
          500,
          0,
          selectedYear || undefined,
        );
        const q = debouncedSearchTerm.toLowerCase().trim();
        const list = (docs as CouncilAwardDocument[]).filter(
          (d) =>
            (d.fullName || "").toLowerCase().includes(q) ||
            (d.idCardNumber || "").toLowerCase().includes(q) ||
            (d.category || "").toLowerCase().includes(q),
        );
        setDocuments(list);
        setTotalItems(list.length);
        return;
      }

      const offset = (page - 1) * itemsPerPage;
      const { documents: docs, total } = await getAllCouncilAwardRegistrations(
        itemsPerPage,
        offset,
        selectedYear || undefined,
      );
      setDocuments(docs as CouncilAwardDocument[]);
      setTotalItems(total);
    } catch (e) {
      console.error("Failed to fetch council award registrations:", e);
      setDocuments([]);
      setTotalItems(0);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs(currentPage);
  }, [currentPage, itemsPerPage, debouncedSearchTerm, selectedYear]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const isSearching = debouncedSearchTerm.trim().length > 0;
  const totalPages = isSearching
    ? 1
    : Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleDelete = async (id: string) => {
    if (!window.confirm("މި ހުށަހެޅުން ޑިލީޓް ކުރައްވާނަންތޯ?")) return;
    try {
      await deleteCouncilAwardRegistration(id);
      await fetchDocs(currentPage);
    } catch (e) {
      console.error(e);
    }
  };

  const downloadCSV = () => {
    if (documents.length === 0) return;
    const header =
      "fullName,idCardNumber,category,startDate,endDate,examDate,description,year,createdAt\n";
    const rows = documents
      .map((d) =>
        [
          `"${(d.fullName || "").replace(/"/g, '""')}"`,
          `"${(d.idCardNumber || "").replace(/"/g, '""')}"`,
          `"${(d.category || "").replace(/"/g, '""')}"`,
          `"${d.startDate || ""}"`,
          `"${d.endDate || ""}"`,
          `"${d.examDate || ""}"`,
          `"${(d.description || "").replace(/"/g, '""')}"`,
          `"${d.year || ""}"`,
          `"${d.$createdAt || ""}"`,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob(["\uFEFF" + header + rows], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "council_award_registrations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const yearOptions = [
    { value: "", label: "ހުރިހާ" },
    ...Array.from({ length: Math.max(1, currentYear - 2021) }, (_, i) => {
      const y = currentYear - i;
      return { value: String(y), label: String(y) };
    }),
  ];

  if (initialLoading) {
    return (
      <div className="flex justify-center min-h-[50vh] items-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-[3px] border-emerald-200 border-t-emerald-600 animate-spin" />
          <span className="font-dhivehi text-sm text-slate-400">
            ލޯޑް ވަނީ...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4" dir="rtl">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-dhivehi text-xl md:text-2xl font-bold text-slate-800">
              ޚިދުމަތް އެވޯޑް
            </h2>
            <p className="font-dhivehi text-sm text-slate-400">
              ޖުމްލަ ހުށަހެޅުން:{" "}
              <span className="text-emerald-600 font-semibold">
                {totalItems}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>CSV</span> <span className="font-dhivehi">ޑައުންލޯޑް</span>
        </button>
      </div>

      {/* ── Filters bar ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="ނަން، އައިޑީ ކާޑް ނުވަތަ ދާއިރާ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-4 py-2.5 text-right font-dhivehi text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white transition-all"
              dir="rtl"
            />
          </div>

          {/* Year */}
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-dhivehi text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 cursor-pointer min-w-[100px]"
          >
            {yearOptions.map((o) => (
              <option key={o.value || "all"} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          {/* Per page */}
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(parseInt(e.target.value, 10));
              setCurrentPage(1);
            }}
            disabled={isSearching}
            className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 cursor-pointer disabled:opacity-50 min-w-[100px]"
          >
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* ── Content ── */}
      {documents.length === 0 ? (
        <PlaceholderCard title="ހުށަހެޅުންތަކެއް ނުފެނުނު." />
      ) : (
        <>
          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {documents.map((d) => {
              const isExpanded = expandedId === d.$id;
              return (
                <div
                  key={d.$id}
                  className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200/60 transition-all duration-200 overflow-hidden"
                >
                  {/* Card top accent */}
                  <div className="h-1 bg-gradient-to-l from-emerald-400 via-teal-500 to-emerald-600" />

                  <div className="p-5 space-y-4">
                    {/* Name + ID */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-dhivehi font-semibold text-slate-800 truncate">
                            {d.fullName}
                          </p>
                          <p className="font-mono text-xs text-slate-500 tracking-wider">
                            {d.idCardNumber}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[11px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                        {d.year || "—"}
                      </span>
                    </div>

                    {/* Category pill */}
                    <div className="flex items-start gap-2">
                      <Award className="w-3.5 h-3.5 text-emerald-500 mt-1 shrink-0" />
                      <p className="font-dhivehi text-sm text-slate-700 leading-relaxed">
                        {truncateCategory(d.category)}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-slate-500">
                        <DateText>{dateRangeLabel(d)}</DateText>
                      </span>
                    </div>

                    {/* Description (expandable) */}
                    {d.description && (
                      <div>
                        <p
                          className={`font-dhivehi text-sm text-slate-600 leading-relaxed ${
                            isExpanded ? "" : "line-clamp-2"
                          }`}
                        >
                          {d.description}
                        </p>
                        {d.description.length > 80 && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : d.$id)
                            }
                            className="mt-1 font-dhivehi text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            {isExpanded
                              ? "ކުޑަކޮށް ދައްކާ"
                              : "އިތުރަށް ކިޔާ..."}
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      <DateText>{d.$createdAt ? formatDisplayDate(d.$createdAt) : ""}</DateText>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.$id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium font-dhivehi text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      ޑިލީޓް
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Pagination ── */}
          {!isSearching && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => p - 1)}
                disabled={currentPage <= 1}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page: number;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                        currentPage === page
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage >= totalPages}
                className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CouncilAwardDashboard;
