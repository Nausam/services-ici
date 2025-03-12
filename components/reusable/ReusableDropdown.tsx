import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DropdownProps = {
  options: string[]; // List of dropdown options
  placeholder?: string; // Placeholder text
  value?: string;
  onChangeHandler?: (value: string) => void;
};

const ReusableDropdown = ({
  options,
  placeholder,
  value,
  onChangeHandler,
}: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi text-cyan-950">
        <SelectValue
          className="text-slate-100"
          placeholder={placeholder || "ނަތީޖާ"}
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
