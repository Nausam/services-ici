import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
};

const QDropdown = ({ value, onChangeHandler }: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi ">
        <SelectValue className="text-slate-100" placeholder=" ޖިންސު " />
      </SelectTrigger>
      <SelectContent className="font-dhivehi  text-gray-500 text-right">
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
