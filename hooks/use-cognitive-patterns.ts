"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useCognitivePatterns() {
  const { user } = useAuth();
  const [patterns, setPatterns] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchPatterns = async () => {
      const response = await fetch(`/api/insights/cognitive-patterns?userId=${user.id}`);
      const data = await response.json();
      setPatterns(data);
    };

    fetchPatterns();
  }, [user]);

  return { patterns };
}
