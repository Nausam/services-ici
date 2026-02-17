"use client";

import { useState, useRef } from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { uploadQuizQuestions } from "@/lib/actions/quizCompetition";
import { formatExcelDate } from "@/constants";
import { useUser } from "@/providers/UserProvider";
import PlaceholderCard from "../PlaceholderCard";
import { toast } from "@/hooks/use-toast";
import { FileSpreadsheet, Upload, X } from "lucide-react";

const UploadQuiz = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isSuperAdmin } = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const f = event.target.files[0];
      if (f.name.endsWith(".xlsx")) setFile(f);
      else
        toast({
          title: "އެކްސެލް ފައިލް (.xlsx) ނަންގަވާ",
          variant: "destructive",
        });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const f = e.dataTransfer.files[0];
      if (f.name.endsWith(".xlsx")) setFile(f);
      else
        toast({
          title: "އެކްސެލް ފައިލް (.xlsx) ނަންގަވާ",
          variant: "destructive",
        });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const clearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "ފައިލް އެއް ނަންގަވާ", variant: "destructive" });
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (!e.target?.result) return;

      const data = new Uint8Array(e.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const parsedData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
      }) as any[][];

      const questions = parsedData.slice(1).map((row) => ({
        questionNumber: String(row[0]),
        date: formatExcelDate(row[1]),
        question: row[2],
        options: [row[3] || "", row[4] || "", row[5] || ""],
        correctAnswer: row[6],
      }));

      try {
        await uploadQuizQuestions(questions);
        toast({ title: "ސުވާލު ސެޕްމިޓް ކުރެވިއްޖެ!", variant: "default" });
        clearFile();
      } catch (error) {
        console.error("Failed to upload questions:", error);
        toast({
          title: "އަޕްލޯޑް ކުރެވޭނެކަމެއް ނުވެއްޖެ",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {isSuperAdmin ? (
        <div
          dir="rtl"
          className="w-full max-w-xl mx-auto mt-6 p-6 sm:p-8 rounded-2xl bg-white border border-cyan-200/80 shadow-lg shadow-cyan-500/5"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/15 to-cyan-600/10">
              <FileSpreadsheet className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="font-dhivehi text-xl sm:text-2xl font-bold text-cyan-950">
                ސުވާލު އަޕްލޯޑް
              </h2>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileChange}
            className="hidden"
          />

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative flex flex-col items-center justify-center gap-3 py-10 px-6 rounded-xl border-2 border-dashed cursor-pointer
              transition-all duration-200
              ${
                dragActive
                  ? "border-cyan-500 bg-cyan-50/80"
                  : "border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50/50"
              }
            `}
          >
            {file ? (
              <>
                <FileSpreadsheet className="h-10 w-10 text-cyan-600" />
                <p className="font-dhivehi text-cyan-900 font-medium text-center break-all">
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearFile();
                  }}
                  className="mt-1 flex items-center gap-1.5 font-dhivehi text-sm text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  ފައިލް އިތުރު ކުރޭ
                </button>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-cyan-400" />
                <p className="font-dhivehi text-cyan-800">
                  އެކްސެލް ފައިލް އަޕްލޯޑް ކުރައްވާ!
                </p>
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="w-full sm:w-auto bg-gradient-to-br from-cyan-500 to-cyan-700 text-white hover:from-cyan-600 hover:to-cyan-800 shadow-md hover:shadow-lg transition-all duration-200 font-dhivehi px-6"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  އަޕްލޯޑް ކުރަނީ...
                </span>
              ) : (
                "ސުވާލު އަޕްލޯޑް ކުރޭ"
              )}
            </Button>
          </div>

          <p className="font-dhivehi text-xs text-cyan-600/80 mt-4 text-right">
            <a
              href="/assets/files/Sample_Quiz_Upload.xlsx"
              download
              className="underline hover:text-cyan-700"
            >
              ސެމްޕަލް ފައިލް ޑައުންލޯޑް ކުރޭ
            </a>
          </p>
        </div>
      ) : (
        <PlaceholderCard title="ސުވާލު އަޕްލޯޑް ކުރުމުގެ އެކްސެސް ތިޔަފަރާތަށް ލިބިފައެއް ނުވޭ!" />
      )}
    </>
  );
};

export default UploadQuiz;
