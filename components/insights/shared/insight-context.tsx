"use client";

import { createContext, useContext, useState } from "react";

interface InsightContextType {
  selectedDate: Date | null;
  selectedTheme: string | null;
  setSelectedDate: (date: Date | null) => void;
  setSelectedTheme: (theme: string | null) => void;
}

export const InsightContext = createContext<InsightContextType>({
  selectedDate: null,
  selectedTheme: null,
  setSelectedDate: (date: Date | null) => {
    // Implementation for setting selected date
    localStorage.setItem('selectedInsightDate', date?.toISOString() || '');
  },
  setSelectedTheme: (theme: string | null) => {
    // Implementation for setting selected theme
    localStorage.setItem('selectedInsightTheme', theme || '');
  }
});

export function InsightProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  return (
    <InsightContext.Provider value={{
      selectedDate,
      selectedTheme,
      setSelectedDate,
      setSelectedTheme
    }}>
      {children}
    </InsightContext.Provider>
  );
}

export const useInsightContext = () => useContext(InsightContext);
