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

const QKeyStageDropDown = ({ value, onChangeHandler }: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi text-cyan-950">
        <SelectValue className="text-slate-100" placeholder=" ކީސްޓޭޖް " />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        className="font-dhivehi  text-slate-600 text-right"
      >
        <AlertDialog>
          <SelectItem
            className="cursor-pointer"
            value="ޚާއްޞައެހީއަށް ބޭނުންވާ ފަރާތްތައް"
          >
            ޚާއްޞައެހީއަށް ބޭނުންވާ ފަރާތްތައް
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ބޭބީ ނާސަރީ، ނާސަރީ">
            ބޭބީ ނާސަރީ، ނާސަރީ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ފައުންޑޭޝަން">
            ފައުންޑޭޝަން
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކީ ސްޓޭޖް 1">
            ކީ ސްޓޭޖް 1
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކީ ސްޓޭޖް 2">
            ކީ ސްޓޭޖް 2
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކީ ސްޓޭޖް 3">
            ކީ ސްޓޭޖް 3
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކީ ސްޓޭޖް 4">
            ކީ ސްޓޭޖް 4
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކީ ސްޓޭޖް 5">
            ކީ ސްޓޭޖް 5
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="18އަހަރުން މަތި (އާއްމުންގެ ބައި) "
          >
            18 އަހަރުން މަތި (އާންމުންގެ ބައި)
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ޙާފިޡުންގެ ބައި">
            ޙާފިޡުންގެ ބައި
          </SelectItem>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default QKeyStageDropDown;
