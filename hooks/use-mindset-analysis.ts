"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useMindsetAnalysis() {
  const { user } = useAuth();
  const [mindsetData, setMindsetData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchMindsetData = async () => {
      const response = await fetch(`/api/insights/mindset?userId=${user.id}`);
      const data = await response.json();
      setMindsetData(data);
    };

    fetchMindsetData();
  }, [user]);

  return { mindsetData };
}
