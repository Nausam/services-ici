import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DropdownProps = {
  value?: string;
  onChangeHandler?: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
};

const NewDropdown = ({
  value,
  onChangeHandler,
  options,
  placeholder,
}: DropdownProps) => {
  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field flex justify-end font-dhivehi">
        <SelectValue
          className="text-slate-100"
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
