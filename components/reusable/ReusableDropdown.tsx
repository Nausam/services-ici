import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompetitionType } from "@/types";

type DropdownProps = {
  options: string[];
  placeholder?: string;
  value?: string;
  onChangeHandler?: (value: string) => void;
  onValueChange?: (value: CompetitionType) => void;
};

const ReusableDropdown = ({
  options,
  placeholder,
  value,
  onChangeHandler,
  onValueChange,
}: DropdownProps) => {
  const handleValueChange = (value: string) => {
    if (onChangeHandler) onChangeHandler(value);
    if (onValueChange) onValueChange(value as CompetitionType);
  };

  return (
    <Select onValueChange={handleValueChange} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi text-cyan-950">
        <SelectValue
          className="text-slate-100"
          placeholder={placeholder || ""}
        />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        className="font-dhivehi text-slate-600 text-right"
      >
        {options.map((option, index) => (
          <SelectItem key={index} className="cursor-pointer" value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ReusableDropdown;
