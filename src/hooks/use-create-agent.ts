"use client";

import { useState } from "react";
import { createAgent } from "@/lib/api/agents";
import type { AgentPersonality, AgentGoal } from "@/types/agent";
import type { MessagingProvider } from "@/types/messaging";
import { useAuth } from "@/lib/auth/context";

export function useCreateAgent() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const create = async (
    personality: AgentPersonality, 
    goals: AgentGoal[],
    messaging?: MessagingProvider | null
  ) => {
    if (!user) throw new Error("User not authenticated");
    
    setLoading(true);
    try {
      const agent = await createAgent(user.id, personality, goals, messaging);
      return agent;
    } finally {
      setLoading(false);
    }
  };

  return {
    create,
    loading
  };
}
