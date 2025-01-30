"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export function useRelationshipAnalysis() {
  const { user } = useAuth();
  const [relationships, setRelationships] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchRelationships = async () => {
      const response = await fetch(`/api/insights/relationships?userId=${user.id}`);
      const data = await response.json();
      setRelationships(data);
    };

    fetchRelationships();
  }, [user]);

  return { relationships };
}
