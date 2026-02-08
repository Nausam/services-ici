import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  hasError?: boolean;
};

const QKeyStageDropDown = ({
  value,
  onChangeHandler,
  hasError,
}: DropdownProps) => {
  return (
    <Select
      value={value && value.trim() !== "" ? value : undefined}
      onValueChange={onChangeHandler}
    >
      <SelectTrigger
        className={cn(
          "select-field flex justify-end font-dhivehi text-cyan-950",
          hasError && "border-red-600 focus-visible:ring-red-500"
        )}
      >
        <SelectValue className="text-slate-100" placeholder=" އުމުރުފުރާ " />
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
          <SelectItem
            className="cursor-pointer"
            value="4 އަހަރާއި 6 އަހަރާއި ދެމެދު"
          >
            4 އަހަރާއި 6 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="6 އަހަރާއި 8 އަހަރާއި ދެމެދު"
          >
            6 އަހަރާއި 8 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="8 އަހަރާއި 10 އަހަރާއި ދެމެދު"
          >
            8 އަހަރާއި 10 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="10 އަހަރާއި 12 އަހަރާއި ދެމެދު"
          >
            10 އަހަރާއި 12 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="12 އަހަރާއި 14 އަހަރާއި ދެމެދު"
          >
            12 އަހަރާއި 14 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem
            className="cursor-pointer"
            value="14 އަހަރާއި 16 އަހަރާއި ދެމެދު"
          >
            14 އަހަރާއި 16 އަހަރާއި ދެމެދު
          </SelectItem>
          <SelectItem className="cursor-pointer" value="16 އަހަރުން މަތި">
            16 އަހަރުން މަތި
          </SelectItem>
          <SelectItem className="cursor-pointer" value="ހާފިޘުންގެ ބައި">
            ހާފިޘުންގެ ބައި
          </SelectItem>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default QKeyStageDropDown;
