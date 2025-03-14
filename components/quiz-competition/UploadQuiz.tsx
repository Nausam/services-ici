"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { uploadQuizQuestions } from "@/lib/actions/quizCompetition";
import { formatExcelDate } from "@/constants";
import { useUser } from "@/providers/UserProvider";
import PlaceholderCard from "../PlaceholderCard";

const UploadQuiz = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { currentUser, isSuperAdmin } = useUser();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first.");

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

      // Convert parsed data into structured objects
      const questions = parsedData.slice(1).map((row) => {
        return {
          questionNumber: String(row[0]), // Convert question number to string
          date: formatExcelDate(row[1]), // ✅ Fix: Convert Excel date properly
          question: row[2],
          options: [row[3] || "", row[4] || "", row[5] || ""], // ✅ Only 3 options
          correctAnswer: row[6], // ✅ Correct answer should match one of the 3 options
        };
      });

      console.log("📅 Converted Questions:", questions); // Debugging

      try {
        await uploadQuizQuestions(questions);
        alert("Quiz questions uploaded successfully!");
      } catch (error) {
        console.error("Failed to upload questions:", error);
        alert("Failed to upload questions.");
      } finally {
        setUploading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      {isSuperAdmin ? (
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md bg-white max-w-lg mx-auto mt-10">
          <h2 className="text-lg font-bold text-cyan-700">
            Upload Quiz Questions
          </h2>
          <input type="file" accept=".xlsx" onChange={handleFileChange} />
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Questions"}
          </Button>
        </div>
      ) : (
        <PlaceholderCard title="ސުވާލު އަޕްލޯޑް ކުރުމުގެ އެކްސެސް ތިޔަފަރާތަށް ލިބިފައެއް ނުވޭ!" />
      )}
    </>
  );
};

export default UploadQuiz;
