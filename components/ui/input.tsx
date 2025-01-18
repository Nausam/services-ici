import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // Function to restrict input to Dhivehi characters
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const regex = /^[ހ-ް 0-9]+$/; // Allow Dhivehi characters and spaces
      if (!regex.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^ހ-ް 0-9]/g, ""); // Remove non-Dhivehi characters
      }
    };

    return (
      <input
        type={type}
        dir="rtl" // Set text direction to right-to-left
        lang="dv" // Specify Dhivehi language
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-dhivehi text-right", // Add Dhivehi font and right alignment
          className
        )}
        ref={ref}
        onInput={handleInput} // Add input restriction logic
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
