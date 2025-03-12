import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  allowAllLanguages?: boolean; // Prop to allow any language input
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, allowAllLanguages = false, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      let inputValue = event.target.value;

      if (!allowAllLanguages) {
        const regex = /^[ހ-ް%-. ﷲ0-9\s]+$/; // Allow Dhivehi characters, numbers, and spaces only
        inputValue = inputValue.replace(/[^ހ-ް%-. ﷲ0-9\s]/g, ""); // Remove non-Dhivehi characters
      }

      setValue(inputValue); // Update state
    };

    return (
      <textarea
        dir="rtl"
        lang={allowAllLanguages ? "en" : "dv"}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-dhivehi text-right text-cyan-950",
          className
        )}
        ref={ref}
        value={value} // Controlled value
        onChange={handleInput} // Filtering logic applied correctly
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
