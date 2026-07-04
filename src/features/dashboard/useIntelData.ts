import { useContext } from "react";
import { IntelDataContext } from "./intelDataContext";

export function useIntelData() {
  const ctx = useContext(IntelDataContext);
  if (!ctx) {
    throw new Error("useIntelData must be used within IntelDataProvider");
  }
  return ctx;
}
