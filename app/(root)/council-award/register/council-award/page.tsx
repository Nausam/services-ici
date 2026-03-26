"use client";

import { toast } from "@/hooks/use-toast";
import { createCouncilAwardRegistration } from "@/lib/actions/councilAward.actions";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const CATEGORIES = [
  "އިސްލާމްދީނާއި ތަރުބިއްޔަތުގެ ދާއިރާ (މަދުވެގެން 10 އަހަރު)",
  "ޞިއްޙަތާއި ކުޅިވަރުގެ ދާއިރާ (މަދުވެގެން 15 އަހަރު)",
  "ޢުމްރާނީ ތަރައްޤީ އާއި އުފެއްދުންތެރިކަމުގެ ދާއިރާ (މަދުވެގެން 20 އަހަރު)",
  "މަސައްކަތްތެރިކަމާއި ފަންނީ ހުނަރުގެ ދާއިރާ (މަދުވެގެން 20 އަހަރު)",
  "ވިޔަފާރިއާއި އިޤްތިޞާދުގެ ދާއިރާ (މަދުވެގެން 15 އަހަރު)",
  "ދިވެހި ތާރީޙާއި ޡަޤާފަތުގެ ދާއިރާ (މަދުވެގެން 10 އަހަރު)",
  "ދިވެހި ބަހާއި އަދަބިއްޔާތުގެ ދާއިރާ (މަދުވެގެން 10 އަހަރު)",
  "މީހުން ބިނާކުރުމާއި، ހިންގުމުގެ ދާއިރާ (މަދުވެގެން 15 އަހަރު)",
  "އައު ހޯދުންތަކާއި އީޖާދުގެ ދާއިރާ",
  "ސައިންސާއި ޓެކްނޮލޮޖީގެ ދާއިރާ (މަދުވެގެން 10 އަހަރު)",
  "ތަޢުލީމުގެ ދާއިރާ (މިހާރު ޚިދުމަތް ކުރަމުންދާ އަދި ޚިދުމަތް ކޮށްފައިވާ ފަރާތްތައް. މަދުވެގެން 15 އަހަރު)",
  "އެދުރު އެވޯޑް (އޯލެވެލް އަދި އޭލެވެލް އިމްތިހާނުގެ ގަދަ 10 ގައި ހިމެނިފައިވާ އިންނަމާދޫ އަށް ނިސްބަތްވާ ދަރިވަރުންނަށް ހިތްވަރު ދިނުމުގެ ގޮތުން ދެވޭ އެވޯޑް)",
];

const MONTHS_DV = [
  "ޖެނުއަރީ",
  "ފެބުރުއަރީ",
  "މާރިޗު",
  "އެޕްރީލް",
  "މެއި",
  "ޖޫން",
  "ޖުލައި",
  "އޮގަސްޓު",
  "ސެޕްޓެމްބަރު",
  "އޮކްޓޯބަރު",
  "ނޮވެމްބަރު",
  "ޑިސެމްބަރު",
];

const DAYS_DV = [
  "އާދިއްތަ",
  "ހޯމަ",
  "އަންގާރަ",
  "ބުދަ",
  "ބުރާސްފަތި",
  "ހުކުރު",
  "ހޮނިހިރު",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDateISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

type CustomDatePickerProps = {
  label: string;
  value: Date | null;
  onChange: (d: Date) => void;
};

type PickerView = "days" | "months" | "years";

const YEAR_MIN = 1950;
const YEAR_MAX = new Date().getFullYear() + 5;

const CustomDatePicker = ({
  label,
  value,
  onChange,
}: CustomDatePickerProps) => {
  const [open, setOpen] = useState(false);
  const [pickerView, setPickerView] = useState<PickerView>("days");
  const ref = useRef<HTMLDivElement>(null);
  const yearGridRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    value?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    value?.getMonth() ?? today.getMonth(),
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setPickerView("days");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (pickerView === "years" && yearGridRef.current) {
      const activeBtn = yearGridRef.current.querySelector("[data-active]");
      if (activeBtn) activeBtn.scrollIntoView({ block: "center" });
    }
  }, [pickerView]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else setViewMonth(viewMonth - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else setViewMonth(viewMonth + 1);
  };

  const isSelected = (day: number) =>
    value?.getFullYear() === viewYear &&
    value?.getMonth() === viewMonth &&
    value?.getDate() === day;

  const isToday = (day: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === day;

  const formatted = value
    ? `${value.getDate()} ${MONTHS_DV[value.getMonth()]} ${value.getFullYear()}`
    : "";

  const years = Array.from(
    { length: YEAR_MAX - YEAR_MIN + 1 },
    (_, i) => YEAR_MAX - i,
  );

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          if (open) setPickerView("days");
        }}
        className={`w-full flex items-center justify-between rounded-xl border px-4 py-3.5 font-dhivehi transition-all duration-200 ${
          open
            ? "border-emerald-400 ring-2 ring-emerald-100 bg-white"
            : "border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
      >
        <span className={value ? "text-slate-800" : "text-slate-400"}>
          {formatted || label}
        </span>
        <CalendarDays className="w-5 h-5 text-slate-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 p-4 left-0 sm:left-auto sm:right-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            {pickerView === "days" && (
              <button
                type="button"
                onClick={nextMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                setPickerView(
                  pickerView === "days"
                    ? "years"
                    : pickerView === "years"
                      ? "days"
                      : "days",
                )
              }
              className="font-dhivehi text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors mx-auto"
            >
              {pickerView === "years"
                ? "އަހަރެއް ނަންގަވާ"
                : pickerView === "months"
                  ? `${viewYear}`
                  : `${MONTHS_DV[viewMonth]} ${viewYear}`}
            </button>

            {pickerView === "days" && (
              <button
                type="button"
                onClick={prevMonth}
                className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-slate-500" />
              </button>
            )}
          </div>

          {/* Year grid */}
          {pickerView === "years" && (
            <div
              ref={yearGridRef}
              className="grid grid-cols-4 gap-1 max-h-56 overflow-y-auto"
            >
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  data-active={y === viewYear ? "" : undefined}
                  onClick={() => {
                    setViewYear(y);
                    setPickerView("months");
                  }}
                  className={`py-2 rounded-lg text-sm transition-colors ${
                    y === viewYear
                      ? "bg-emerald-600 text-white font-bold"
                      : y === today.getFullYear()
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {/* Month grid */}
          {pickerView === "months" && (
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS_DV.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setViewMonth(i);
                    setPickerView("days");
                  }}
                  className={`py-2.5 rounded-lg font-dhivehi text-sm transition-colors ${
                    i === viewMonth &&
                    viewYear === (value?.getFullYear() ?? today.getFullYear())
                      ? "bg-emerald-600 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}

          {/* Day grid */}
          {pickerView === "days" && (
            <>
              <div className="grid grid-cols-7 gap-0 mb-1">
                {DAYS_DV.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[11px] font-dhivehi text-slate-400 py-1"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`e-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        onChange(new Date(viewYear, viewMonth, day));
                        setOpen(false);
                        setPickerView("days");
                      }}
                      className={`mx-auto w-9 h-9 rounded-full text-sm flex items-center justify-center transition-all duration-150 ${
                        isSelected(day)
                          ? "bg-emerald-600 text-white font-bold shadow-md shadow-emerald-600/30"
                          : isToday(day)
                            ? "bg-emerald-50 text-emerald-700 font-semibold ring-1 ring-emerald-200"
                            : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {day}
                    </button>
                  ),
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const CouncilAwardRegisterPage = () => {
  const [fullName, setFullName] = useState("");
  const [idCardNumber, setIdCardNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [examDate, setExamDate] = useState<Date | null>(null);
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdhuruAward = selectedCategory.startsWith("އެދުރު އެވޯޑް");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast({ title: "ފުރިހަމަ ނަން ލިޔުއްވާ", variant: "destructive" });
      return;
    }
    if (!idCardNumber.trim() || idCardNumber.length < 2) {
      toast({ title: "އައިޑީ ކާޑް ނަންބަރު ލިޔުއްވާ", variant: "destructive" });
      return;
    }
    if (!selectedCategory) {
      toast({ title: "ދާއިރާއެއް ނަންގަވާ", variant: "destructive" });
      return;
    }
    if (!description.trim()) {
      toast({ title: "ތަފްސީލު ލިޔުއްވާ", variant: "destructive" });
      return;
    }
    if (isEdhuruAward && !examDate) {
      toast({
        title: "އިމްތިހާނު ނިމުނު ތާރީޚް ނަންގަވާ",
        variant: "destructive",
      });
      return;
    }
    if (!isEdhuruAward && (!startDate || !endDate)) {
      toast({
        title: "ޚިދުމަތް ކުރި މުއްދަތު ނަންގަވާ",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createCouncilAwardRegistration({
        fullName: fullName.trim(),
        idCardNumber: idCardNumber.trim(),
        category: selectedCategory,
        startDate: startDate ? formatDateISO(startDate) : undefined,
        endDate: endDate ? formatDateISO(endDate) : undefined,
        examDate: examDate ? formatDateISO(examDate) : undefined,
        description: description.trim(),
      });

      if (result) {
        setFullName("");
        setIdCardNumber("");
        setSelectedCategory("");
        setStartDate(null);
        setEndDate(null);
        setExamDate(null);
        setDescription("");
        router.push("/");
        toast({
          title: `${result.fullName} ގެ ހުށަހެޅުން ރެޖިސްޓާ ކުރެވިއްޖެ`,
          variant: "default",
        });
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "ALREADY_REGISTERED_THIS_YEAR"
      ) {
        toast({
          title: "މި އައިޑީ ކާޑުން މިއަހަރު މިހާރު ހުށަހެޅިފައިވޭ",
          variant: "destructive",
        });
      } else {
        toast({
          title: "ހުށަހެޅުން ރެޖިސްޓާ ނުކުރެވުނު",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/^A/, "").replace(/\D/g, "").slice(0, 6);
    setIdCardNumber(`A${raw}`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* ── Banner ── */}
      <div className="relative bg-gradient-to-l from-teal-800 to-emerald-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-5 py-14 md:py-20 text-center">
          <p
            className="text-emerald-200 font-dhivehi text-lg md:text-xl mb-3"
            dir="rtl"
          >
            މާޅޮސްމަޑުލު އުތުރުބުރީ އިންނަމާދޫ ކައުންސިލް
          </p>
          <h1
            className="font-dhivehi text-4xl md:text-6xl font-bold text-white leading-snug"
            dir="rtl"
          >
            &rdquo;ޚިދުމަތް&ldquo; އެވޯޑް އަށް ހުށަހެޅުން
          </h1>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="max-w-4xl mx-auto px-5 pt-6 pb-20" dir="rtl">
        {/* Note */}
        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 px-5 py-3.5">
          <p className="font-dhivehi text-sm text-amber-800 leading-relaxed">
            <span className="font-bold text-red-600">ނޯޓް : </span>
            އިތުރު މައުލޫމާތު ހޯއްދެއްވުމަށް{" "}
            <span dir="ltr" className="font-semibold text-amber-900">
              7981984
            </span>{" "}
            އަށް ގުޅުއްވުން އެދެން!
          </p>
        </div>

        <form className="space-y-10" onSubmit={handleSubmit}>
          {/* ─ Name & ID ─ */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="font-dhivehi text-xl md:text-2xl text-emerald-900 font-semibold mb-5">
              ހުށަހަޅާ ފަރާތުގެ މަޢުލޫމާތު
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-dhivehi text-slate-500 mb-2">
                  ފުރިހަމަ ނަން
                </label>
                <input
                  type="text"
                  dir="rtl"
                  lang="dv"
                  placeholder="ފުރިހަމަ ނަން"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right font-dhivehi text-slate-800 placeholder:text-slate-300 transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-dhivehi text-slate-500 mb-2">
                  އައިޑީ ކާޑް ނަންބަރު
                </label>
                <input
                  type="text"
                  dir="ltr"
                  placeholder="A123456"
                  value={idCardNumber}
                  onChange={handleIdCardChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right text-slate-800 font-bold tracking-widest placeholder:text-slate-300 placeholder:font-normal placeholder:tracking-normal transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
                />
              </div>
            </div>
          </section>

          {/* ─ Category ─ */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="font-dhivehi text-xl md:text-2xl text-emerald-900 font-semibold mb-1">
              ދާއިރާ ނަންގަވާ
            </h2>
            <p className="font-dhivehi text-sm text-slate-400 mb-5">
              ތިރީގައިވާ ދާއިރާ ތަކުން ދާއިރާއެއް ނަންގަވާ
            </p>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full text-right rounded-xl border px-5 py-4 font-dhivehi transition-all duration-200 flex items-center justify-between ${
                  dropdownOpen
                    ? "border-emerald-400 ring-2 ring-emerald-100 bg-white"
                    : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span
                  className={
                    selectedCategory ? "text-slate-800" : "text-slate-400"
                  }
                >
                  {selectedCategory || "ދާއިރާއެއް ނަންގަވާ"}
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute z-50 mt-1.5 w-full rounded-xl bg-white border border-slate-200 shadow-xl overflow-hidden">
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {CATEGORIES.map((cat, i) => {
                      const active = selectedCategory === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-right px-5 py-3.5 font-dhivehi flex items-center gap-3 transition-colors ${
                            active
                              ? "bg-emerald-50 text-emerald-800"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`shrink-0 w-6 h-6 rounded-full text-xs flex items-center justify-center font-mono ${
                              active
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="flex-1">{cat}</span>
                          {active && (
                            <svg
                              className="w-5 h-5 text-emerald-500 shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.5}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ─ Date Range / Exam Date ─ */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            {isEdhuruAward ? (
              <>
                <h2 className="font-dhivehi text-xl md:text-2xl text-emerald-900 font-semibold mb-1">
                  އޭލެވެލް ނުވަތަ އޯލެވެލް ނިމުނު ތާރީޚް
                </h2>
                <p className="font-dhivehi text-sm text-slate-400 mb-5">
                  އިމްތިހާނު ނިމުނު ތާރީޚް ނަންގަވާ
                </p>
                <div className="max-w-sm">
                  <CustomDatePicker
                    label="ތާރީޚް ނަންގަވާ"
                    value={examDate}
                    onChange={setExamDate}
                  />
                </div>
              </>
            ) : (
              <>
                <h2 className="font-dhivehi text-xl md:text-2xl text-emerald-900 font-semibold mb-1">
                  ޚިދުމަތް ކޮށްދެއްވި މުއްދަތު
                </h2>
                <p className="font-dhivehi text-sm text-slate-400 mb-5">
                  ޚިދުމަތް ފެށި ތާރީޚާއި ނިމުނު ތާރީޚް
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-dhivehi text-slate-500 mb-2">
                      ފެށުނު ތާރީޚް
                    </label>
                    <CustomDatePicker
                      label="ތާރީޚް ނަންގަވާ"
                      value={startDate}
                      onChange={setStartDate}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-dhivehi text-slate-500 mb-2">
                      ނިމުނު ތާރީޚް
                    </label>
                    <CustomDatePicker
                      label="ތާރީޚް ނަންގަވާ"
                      value={endDate}
                      onChange={setEndDate}
                    />
                  </div>
                </div>
              </>
            )}
          </section>

          {/* ─ Description ─ */}
          <section className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
            <h2 className="font-dhivehi text-xl md:text-2xl text-emerald-900 font-semibold mb-1">
              ތަފްސީލު
            </h2>
            <p className="font-dhivehi text-sm text-slate-400 mb-5">
              ހޯއްދެވި ކާމިޔާބީ ތަކާއި ޚިދުމަތުގެ ތަފްސީލު
            </p>
            <textarea
              rows={7}
              placeholder="ކާމިޔާބީ ތަކާއި ޚިދުމަތުގެ ތަފްސީލު ލިޔުއްވާ..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-right font-dhivehi text-slate-800 placeholder:text-slate-300 resize-none transition-all duration-200 hover:border-slate-300 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 focus:bg-white"
            />
          </section>

          {/* ─ Submit ─ */}
          <div className="flex justify-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative px-12 py-4 rounded-xl bg-emerald-700 text-white font-dhivehi text-xl font-semibold overflow-hidden transition-all duration-300 hover:bg-emerald-800 active:scale-[0.97] shadow-lg shadow-emerald-700/20 hover:shadow-xl hover:shadow-emerald-700/30 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">
                {isSubmitting ? "ހުށަހެޅެނީ..." : "ހުށަހަޅުއްވާ"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-l from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouncilAwardRegisterPage;
