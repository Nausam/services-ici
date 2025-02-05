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

const BDropdown = ({ value, onChangeHandler }: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi text-cyan-950 font-semibold">
        <SelectValue className="text-slate-100" placeholder="ބޭންކް" />
      </SelectTrigger>
      <SelectContent className="font-dhivehi  text-slate-600 text-right">
        <AlertDialog>
          <SelectItem
            className="cursor-pointer font-semibold"
            value="Bank of Maldives"
          >
            Bank of Maldives
          </SelectItem>
          <SelectItem
            className="cursor-pointer font-semibold"
            value="Maldives Islamic Bank"
          >
            Maldives Islamic Bank
          </SelectItem>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default BDropdown;
