"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useThematicAnalysis() {
  const { user } = useAuth();
  const [themes, setThemes] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchThemes = async () => {
      const response = await fetch(`/api/insights/themes?userId=${user.id}`);
      const data = await response.json();
      setThemes(data);
    };

    fetchThemes();
  }, [user]);

  return { themes };
}
