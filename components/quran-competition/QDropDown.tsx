import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { startTransition, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  hasError?: boolean;
};

const QDropdown = ({
  value,
  onChangeHandler,
  hasError,
}: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger
        className={cn(
          "select-field flex justify-end font-dhivehi text-cyan-950",
          hasError && "border-red-600 focus-visible:ring-red-500"
        )}
      >
        <SelectValue className="text-slate-100" placeholder=" ޖިންސު " />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        className="font-dhivehi  text-slate-600 text-right"
      >
        <AlertDialog>
          <SelectItem className="cursor-pointer" value="އަންހެން">
            އަންހެން
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ފިރިހެން">
            ފިރިހެން
          </SelectItem>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default QDropdown;
