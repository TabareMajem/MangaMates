"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';

interface QuizResultsProps {
  scores: Record<string, number>;
  traits: string[];
  onRetake?: () => void;
}

export function QuizResults({ scores, traits, onRetake }: QuizResultsProps) {
  const navigate = useNavigate();
  
  const chartData = Object.entries(scores).map(([trait, value]) => ({
    trait,
    value
  }));

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Your Results</h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="trait" />
            <Radar
              name="Score"
              dataKey="value"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Dominant Traits</h3>
        <div className="flex flex-wrap gap-2">
          {traits.map((trait) => (
            <span
              key={trait}
              className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        {onRetake && (
          <Button variant="outline" onClick={onRetake}>
            Take Again
          </Button>
        )}
        <Button onClick={() => navigate("/profile-insights")}>
          View Full Profile
        </Button>
      </div>
    </Card>
  );
}
