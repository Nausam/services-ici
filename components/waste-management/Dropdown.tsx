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

const Dropdown = ({ value, onChangeHandler }: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi ">
        <SelectValue className="text-slate-100" placeholder=" ކެޓެގަރީ " />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        className="font-dhivehi  text-gray-500 text-right"
      >
        <AlertDialog>
          <SelectItem className="cursor-pointer" value="ގޭބިސީ - 150ރ">
            ގޭބިސީ - 150ރ
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="ފަޅުގޯތި / އަލަށް އިމާރާތްކޮށް ދިރިއުޅެން ނުފަށާގޯތި - 75ރ"
          >
            ފަޅުގޯތި / އަލަށް އިމާރާތްކޮށް ދިރިއުޅެން ނުފަށާގޯތި - 75ރ
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="ރަށުކައުންސިލް އިދާރާ - 500ރ"
          >
            ރަށުކައުންސިލް އިދާރާ - 500ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ވިޔަފާރި - 250ރ">
            ވިޔަފާރި - 250ރ
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="ހޮޓާ / ރެސްޓޯރެންޓް / ކެފޭ - 250ރ"
          >
            ހޮޓާ / ރެސްޓޯރެންޓް / ކެފޭ - 250ރ
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="ސިނާއީ މަސައްކަތްކުރާ ސަރަހައްދު - 750ރ"
          >
            ސިނާއީ މަސައްކަތްކުރާ ސަރަހައްދު - 750ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ވޯކްޝޮޕް - 250ރ">
            ވޯކްޝޮޕް - 250ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ވަޑާންގެ - 250ރ">
            ވަޑާންގެ - 250ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ސިއްޙީ މަރުކަޒު - 500ރ">
            ސިއްޙީ މަރުކަޒު - 500ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ދިރާގު - 250ރ">
            ދިރާގު - 250ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ފުޓްސަލް ދަނޑު - 150ރ">
            ފުޓްސަލް ދަނޑު - 150ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ޕާރކް - 150ރ">
            ޕާރކް - 150ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="މިސްކިތް - 150ރ">
            މިސްކިތް - 150ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="އުރީދޫ - 250ރ">
            އުރީދޫ - 250ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ސްކޫލް - 500ރ">
            ސްކޫލް - 500ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ކޯޓް - 500ރ">
            ކޯޓް - 500ރ
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ޕްރީ ސްކޫލް - 150ރ">
            ޕްރީ ސްކޫލް - 150ރ
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="ކަރަންޓާއި ފެނާއި ނަރުދަމާގެ ހިދުމަތްދޭ ތަންތަން - 500ރ"
          >
            ކަރަންޓާއި ފެނާއި ނަރުދަމާގެ ހިދުމަތްދޭ ތަންތަން - 500ރ
          </SelectItem>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
