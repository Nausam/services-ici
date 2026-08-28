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
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
};

const NewDropdown = ({
  value,
  onChangeHandler,
  options,
  placeholder,
  className,
}: DropdownProps) => {
  return (
    <Select dir="rtl" onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger
        className={cn("select-field font-dhivehi text-right", className)}
      >
        <SelectValue
          className="text-right"
          placeholder={placeholder || "ނަންގަވާ"}
        />
      </SelectTrigger>
      <SelectContent
        dir="rtl"
        className="font-dhivehi text-gray-500 text-right"
      >
        {options.map((option) => (
          <SelectItem
            key={option.value}
            className="cursor-pointer text-lg"
            value={option.value}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default NewDropdown;
