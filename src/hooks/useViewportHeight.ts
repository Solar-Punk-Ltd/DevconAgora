import { useEffect } from "react";

export const useViewportHeight = () => {
  useEffect(() => {
    const setVhVariable = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVhVariable();
    window.addEventListener("resize", setVhVariable);
    return () => {
      window.removeEventListener("resize", setVhVariable);
    };
  }, []);
};
