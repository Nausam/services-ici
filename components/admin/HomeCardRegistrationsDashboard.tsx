"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Phone,
  Search,
  User,
} from "lucide-react";

import PlaceholderCard from "@/components/PlaceholderCard";
import {
  getAllHomeCardRegistrations,
  getHomeCardRegistrationsForExport,
} from "@/lib/actions/home.actions";
import type { HomeCardRegistration } from "@/types";

type HomeCardRegistrationDocument = HomeCardRegistration & {
  $id: string;
};

const PAGE_SIZE_OPTIONS = [12, 24, 50];

function formatDisplayDate(value: string | undefined) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AgeLabel({ age }: { age: HomeCardRegistration["age"] }) {
  return (
    <span className="rounded-full bg-cyan-50 px-2.5 py-1 font-dhivehi text-xs font-medium text-cyan-700">
      {age === "below18" ? "18 އަހަރުން ދަށް" : "18 އަހަރުން މަތި"}
    </span>
  );
}

function DetailItem({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof CreditCard;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
      <div className="min-w-0 text-right">
        <p className="font-dhivehi text-xs text-slate-400">{label}</p>
        <div className="mt-0.5 break-words text-sm font-medium text-slate-700">
          {children}
        </div>
      </div>
    </div>
  );
}

function DocumentLink({ href, label }: { href?: string; label: string }) {
  if (!href) {
    return (
      <span className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center font-dhivehi text-xs text-slate-400">
        <FileText className="h-4 w-4 shrink-0" />
        {label}: ނެތް
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-100 bg-cyan-50 px-3 py-2 text-center font-dhivehi text-xs font-medium text-cyan-700 transition-colors hover:border-cyan-200 hover:bg-cyan-100"
    >
      <FileText className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
    </a>
  );
}

export default function HomeCardRegistrationsDashboard() {
  const [registrations, setRegistrations] = useState<
    HomeCardRegistrationDocument[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setDebouncedSearchTerm(searchTerm),
      300
    );

    return () => window.clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    let cancelled = false;

    const loadRegistrations = async () => {
      setLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * itemsPerPage;
        const result = await getAllHomeCardRegistrations(
          itemsPerPage,
          offset,
          debouncedSearchTerm
        );

        if (cancelled) return;

        setRegistrations(
          (result.documents as HomeCardRegistrationDocument[]) ?? []
        );
        setTotalItems(result.total ?? 0);
      } catch (loadError) {
        if (cancelled) return;

        console.error("Failed to load home-card registrations:", loadError);
        setRegistrations([]);
        setTotalItems(0);
        setError("ރެޖިސްޓްރޭޝަންތައް ލޯޑް ނުކުރެވުނު.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadRegistrations();

    return () => {
      cancelled = true;
    };
  }, [currentPage, itemsPerPage, debouncedSearchTerm, retryToken]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const downloadCSV = async () => {
    setExporting(true);

    try {
      const result = await getHomeCardRegistrationsForExport(
        debouncedSearchTerm
      );
      const documents = result.documents as HomeCardRegistrationDocument[];

      if (documents.length === 0) return;

      const escapeCSV = (value: unknown) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;
      const ageLabel = (age: HomeCardRegistration["age"]) =>
        age === "below18" ? "18 އަހަރުން ދަށް" : "18 އަހަރުން މަތި";
      const header = [
        "ފުރިހަމަ ނަން",
        "އުމުރު",
        "އައިޑީކާޑް ނަންބަރު",
        "ފޯނު ނަންބަރު",
        "ހޯމް ކާޑް",
        "ހުށަހެޅި ތާރީޚު",
        "އައިޑީކާޑް ކޮޕީ",
        "ބެލެނިވެރިޔާގެ ސިޓީ",
      ].map(escapeCSV).join(",");
      const rows = documents
        .map((document) =>
          [
            document.fullName,
            ageLabel(document.age),
            document.idCardNumber,
            document.contactNumber,
            document.homeCardTitle,
            document.createdAt,
            document.idCard,
            document.parentApprovalLetter,
          ]
            .map(escapeCSV)
            .join(",")
        )
        .join("\n");
      const blob = new Blob(["\uFEFF" + header + "\n" + rows], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "home-card-registrations.csv";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (exportError) {
      console.error("Failed to export home-card registrations:", exportError);
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-[3px] border-cyan-200 border-t-cyan-600" />
          <span className="font-dhivehi text-sm text-slate-400">
            ލޯޑް ވަނީ...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="space-y-5 p-4 md:p-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-dhivehi text-2xl font-semibold text-cyan-950 md:text-3xl">
                ހޯމް ކާޑް ރެޖިސްޓްރޭޝަންތައް ({totalItems})
              </h2>
              <p className="mt-1 font-dhivehi text-sm text-slate-400">
                ހޯމް ކާޑްގެ ފޯމުން ލިބުނު ހުށަހެޅުންތައް
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
              <div className="relative min-w-0 flex-1 sm:min-w-[17rem] xl:w-[22rem] xl:flex-none">
                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="ނަން، އައިޑީ ކާޑް، ފޯނު..."
                  aria-label="ރެޖިސްޓްރޭޝަން ހޯދާ"
                  dir="rtl"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-4 pr-10 text-right font-dhivehi text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-300 focus:border-cyan-400 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                />
              </div>

              <button
                type="button"
                onClick={downloadCSV}
                disabled={exporting || totalItems === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                <span>{exporting ? "Preparing CSV..." : "Download CSV"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <select
              value={itemsPerPage}
              onChange={(event) => {
                setItemsPerPage(Number(event.target.value));
                setCurrentPage(1);
              }}
              aria-label="ޞަފްޙާއަކަށް ރެޖިސްޓްރޭޝަންތައް"
              dir="rtl"
              className="w-full rounded-xl border border-cyan-200 bg-white px-4 py-2 text-sm font-dhivehi text-cyan-800 shadow-sm outline-none transition-colors focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 sm:w-auto"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  ޞަފްޙާއަކަށް {size}
                </option>
              ))}
            </select>
            <p className="text-left text-xs text-slate-400" dir="ltr">
              {registrations.length} of {totalItems} registrations
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8 text-center"
        >
          <p className="font-dhivehi text-sm text-red-700">{error}</p>
          <button
            type="button"
            onClick={() => setRetryToken((value) => value + 1)}
            className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 font-dhivehi text-sm text-white transition-colors hover:bg-cyan-700"
          >
            އަލުން ލޯޑް ކުރޭ
          </button>
        </div>
      ) : registrations.length === 0 ? (
        <PlaceholderCard
          title={
            debouncedSearchTerm
              ? "ހޯދުމާ ގުޅޭ ރެޖިސްޓްރޭޝަނެއް ނުފެނުނު."
              : "ހުށަހެޅުންތަކެއް ނުފެނުނު."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {registrations.map((registration) => (
              <article
                key={registration.$id}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:border-cyan-200 hover:shadow-md"
              >
                <div className="h-1 bg-gradient-to-l from-cyan-400 via-sky-500 to-cyan-600" />

                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-600">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="break-words font-dhivehi text-lg font-semibold text-slate-800">
                          {registration.fullName || "—"}
                        </h3>
                        <p className="mt-1 break-words font-dhivehi text-sm text-slate-500">
                          {registration.homeCardTitle || "—"}
                        </p>
                      </div>
                    </div>
                    <AgeLabel age={registration.age} />
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <DetailItem icon={CreditCard} label="އައިޑީކާޑް ނަންބަރު">
                      <span dir="ltr" style={{ unicodeBidi: "embed" }}>
                        {registration.idCardNumber || "—"}
                      </span>
                    </DetailItem>
                    <DetailItem icon={Phone} label="ފޯނު ނަންބަރު">
                      <span dir="ltr" style={{ unicodeBidi: "embed" }}>
                        {registration.contactNumber || "—"}
                      </span>
                    </DetailItem>
                  </div>

                  <div className="flex items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span className="font-dhivehi">ހުށަހެޅި ތާރީޚު:</span>
                    <span dir="ltr" style={{ unicodeBidi: "embed" }}>
                      {formatDisplayDate(registration.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4">
                  <p className="mb-2 font-dhivehi text-xs text-slate-400">
                    އަޕްލޯޑް ކުރި ފައިލްތައް
                  </p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <DocumentLink
                      href={registration.idCard}
                      label="އައިޑީކާޑް ކޮޕީ"
                    />
                    <DocumentLink
                      href={registration.parentApprovalLetter}
                      label="ބެލެނިވެރިޔާގެ ސިޓީ"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
                <span>Previous</span>
              </button>

              <span className="text-sm font-medium text-cyan-800" dir="ltr">
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span>Next</span>
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
