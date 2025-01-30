"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useGoalAnalysis() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchGoals = async () => {
      const response = await fetch(`/api/insights/goals?userId=${user.id}`);
      const data = await response.json();
      setGoals(data);
    };

    fetchGoals();
  }, [user]);

  return { goals };
}
