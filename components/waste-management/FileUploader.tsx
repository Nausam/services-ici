"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/legacy/image";
import { toast } from "@/hooks/use-toast";

type FileUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string | undefined;
  setFile: Dispatch<SetStateAction<File | null>>; // Accepts a single file
};

export function FileUploader({
  imageUrl,
  onFieldChange,
  setFile,
}: FileUploaderProps) {
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
      className="items-center justify-center h-64 flex p-3 cursor-pointer flex-col overflow-hidden rounded-md border-2 border-dashed border-cyan-600 bg-slate-100/50 hover:bg-cyan-600/10 transition-all duration-300"
      onDragOver={onDragOver}
      onDrop={onDropHandler}
    >
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,application/pdf" // Allow images and PDFs
        onChange={onDrop}
        className="hidden"
        id="file-upload"
      />

      {imageUrl ? (
        <div className="h-full w-full flex items-center justify-center">
          {imageUrl.endsWith(".pdf") ? (
            <p className="text-gray-700 text-sm">Uploaded: {imageUrl}</p>
          ) : (
            <Image
              src={imageUrl}
              alt="Uploaded file"
              width={250}
              height={250}
              className="w-full object-cover object-center rounded-md"
            />
          )}
        </div>
      ) : (
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center py-5 text-gray-500 cursor-pointer"
        >
          <Image
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
            className="invert"
          />
          <h3 className="mb-2 mt-2 font-dhivehi text-lg text-gray-700">
            ފޮޓޯ ނުވަތަ ޕީޑީއެފް ފައިލް ޑްރެގް އެންޑް ޑްރޮޕް ކޮށްލާ
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            SVG, PNG, JPG, PDF : Max 10MB
          </p>
          <Button
            type="button"
            className="rounded-full font-dhivehi text-md bg-cyan-700 hover:bg-cyan-600 text-white"
            onClick={() => document.getElementById("file-upload")?.click()} // Simulate click on hidden file input
          >
            އަޕްލޯޑް ކުރައްވާ
          </Button>
        </label>
      )}
    </div>
  );
}
