"use client";

import { Dispatch, SetStateAction, useCallback, useId } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/legacy/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, FileText, UploadCloud } from "lucide-react";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string | undefined;
  setFile: Dispatch<SetStateAction<File | null>>; // Accepts a single file
  variant?: "default" | "registration";
};

export function FileUploader({
  imageUrl,
  onFieldChange,
  setFile,
  variant = "default",
}: FileUploaderProps) {
  const inputId = useId();
  const isRegistrationVariant = variant === "registration";
  const onDrop = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      // Validate file size (e.g., 10 MB = 10 * 1024 * 1024 bytes)
      const maxFileSize = 10 * 1024 * 1024; // 10 MB
      if (selectedFile.size > maxFileSize) {
        toast({
          title: ` އަޕްލޯޑް ކުރެއްވި ފައިލްގެ ސައިޒު 10 އެމްބީ އަށްވުރެ ބޮޑު `,
          variant: "destructive",
        });
        return; // Stop further processing
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        toast({
          title: " އަޕްލޯޑް ކުރެއްވި ފައިލް ސަޕޯޓެއް ނުކުރޭ ",
          description: " ސަޕޯޓްކުރާ ފައިލްތައް - SVG, PNG, JPG, PDF ",
          variant: "destructive",
        });
        return; // Stop further processing
      }

      setFile(selectedFile); // Update the state with the selected file

      // Create a preview URL for the file (only for images)
      if (selectedFile.type.startsWith("image/")) {
        const fileUrl = URL.createObjectURL(selectedFile);
        onFieldChange(fileUrl); // Update the form with the image URL
      } else {
        onFieldChange(selectedFile.name); // For PDFs, show the file name instead
      }
    }
  }, []);

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onDropHandler = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files && files.length > 0) {
      const selectedFile = files[0];

      // Handle file validations (size and type) here, similar to onDrop
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const fileUrl = URL.createObjectURL(selectedFile);
        onFieldChange(fileUrl);
      } else {
        onFieldChange(selectedFile.name);
      }
    }
  };

  return (
    <div
      className={cn(
        isRegistrationVariant
          ? "group flex min-h-[210px] h-auto cursor-pointer flex-col overflow-hidden rounded-[1.25rem] border-2 border-dashed border-slate-200 bg-slate-50/70 p-3 transition-all duration-300 hover:border-teal-400 hover:bg-teal-50/50 md:h-full"
          : "items-center justify-center h-64 flex p-3 cursor-pointer flex-col overflow-hidden rounded-md border-2 border-dashed border-cyan-600 bg-slate-100/50 hover:bg-cyan-600/10 transition-all duration-300"
      )}
      onDragOver={onDragOver}
      onDrop={onDropHandler}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,application/pdf" // Allow images and PDFs
        onChange={onDrop}
        className="hidden"
        id={inputId}
      />

      {imageUrl ? (
        <label
          htmlFor={inputId}
          className={cn(
            "h-full w-full flex flex-col items-center justify-center cursor-pointer gap-2",
            isRegistrationVariant && "relative rounded-2xl bg-white p-2"
          )}
        >
          {imageUrl.endsWith(".pdf") ? (
            <div
              className={cn(
                "flex items-center gap-2 text-gray-700 text-sm",
                isRegistrationVariant && "w-full flex-col p-6 text-center"
              )}
            >
              {isRegistrationVariant && (
                <FileText className="h-10 w-10 text-teal-600" />
              )}
              <span>Uploaded: {imageUrl}</span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt="Uploaded file"
              width={250}
              height={250}
              className={cn(
                "w-full object-cover object-center rounded-md",
                isRegistrationVariant && "max-h-44 rounded-xl"
              )}
            />
          )}
          <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 font-dhivehi text-sm leading-relaxed text-teal-700 hover:bg-teal-100 hover:text-teal-900">
            <CheckCircle2 className="size-4" />
            ފައިލް ނަގާފައި — ބަދަލު ކުރައްވާ
          </span>
        </label>
      ) : (
        <label
          htmlFor={inputId}
          className={cn(
            "flex flex-col items-center justify-center text-gray-500 cursor-pointer",
            isRegistrationVariant ? "h-full gap-1" : "py-5"
          )}
        >
          {isRegistrationVariant ? (
            <span className="mb-2 flex size-14 items-center justify-center rounded-2xl bg-white text-teal-600 shadow-sm ring-1 ring-slate-100 transition-all duration-300 group-hover:-translate-y-1 group-hover:text-teal-700 group-hover:shadow-md">
              <UploadCloud className="h-7 w-7" />
            </span>
          ) : (
            <Image
              src="/assets/icons/upload.svg"
              width={77}
              height={77}
              alt="file upload"
              className="invert"
            />
          )}
          <h3
            className={cn(
              "mb-2 mt-2 font-dhivehi text-lg leading-[1.8] text-gray-700",
              isRegistrationVariant && "text-center text-lg font-normal text-slate-900"
            )}
          >
            {isRegistrationVariant
              ? "ފޮޓޯ ނުވަތަ ޕީޑީއެފް ފައިލެއް ނަގާ"
              : "ފޮޓޯ ނުވަތަ ޕީޑީއެފް ފައިލް ޑްރެގް އެންޑް ޑްރޮޕް ކޮށްލާ"}
          </h3>
          <p className="mb-4 font-geist text-center text-xs text-slate-400">
            JPG, PNG, SVG, PDF · MAX 10MB
          </p>
          <Button
            type="button"
            className="h-10 rounded-xl border border-slate-200 bg-white px-5 font-dhivehi text-sm leading-relaxed text-slate-700 shadow-sm hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
            onClick={() => document.getElementById(inputId)?.click()} // Simulate click on hidden file input
          >
            {isRegistrationVariant ? "ފައިލް ހޮވާ" : "އަޕްލޯޑް ކުރައްވާ"}
          </Button>
        </label>
      )}
    </div>
  );
}
