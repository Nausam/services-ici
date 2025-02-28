// hooks/use-mobile.ts
import { useEffect, useState } from "react";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    updateSize(); // Run on mount
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
}
