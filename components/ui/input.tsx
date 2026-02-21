import { cn } from "@/lib/utils";
import * as React from "react";

interface InputProps extends React.ComponentProps<"input"> {
  allowAllLanguages?: boolean; // New prop to allow any language
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, allowAllLanguages = false, ...props }, ref) => {
    // Function to restrict input to Dhivehi characters unless allowAllLanguages is true
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!allowAllLanguages) {
        const regex = /^[ހ-ް%-. ﷲ0-9]+$/; // Allow Dhivehi characters and numbers
        if (!regex.test(event.target.value)) {
          event.target.value = event.target.value.replace(
            /[^ހ-ް%-. ﷲ0-9]/g,
            "",
          ); // Remove non-Dhivehi characters
        }
      }
    };

    return (
      <input
        type={type}
        dir="rtl" // Set text direction to right-to-left
        lang={allowAllLanguages ? "en" : "dv"} // Switch language based on the prop
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-dhivehi text-right text-cyan-950",
          className,
        )}
        ref={ref}
        onInput={handleInput}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";

export { Input };
