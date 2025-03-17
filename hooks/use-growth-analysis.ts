"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useGrowthAnalysis() {
  const { user } = useAuth();
  const [growthData, setGrowthData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchGrowthData = async () => {
      const response = await fetch(`/api/insights/growth?userId=${user.id}`);
      const data = await response.json();
      setGrowthData(data);
    };

    fetchGrowthData();
  }, [user]);

  return { growthData };
}
