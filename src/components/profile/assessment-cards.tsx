"use client";

import * as React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AssessmentCardProps {
  title: string;
  description: string;
  progress: number;
  onStart: () => void;
}

export function AssessmentCard({ title, description, progress, onStart }: AssessmentCardProps) {
  const { toast } = useToast();

  const handleAction = () => {
    if (progress === 100) {
      toast({
        title: "Assessment Complete",
        description: "You have already completed this assessment.",
      });
      return;
    }
    onStart();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={progress} />
        <Button 
          onClick={handleAction}
          className="w-full"
          variant={progress === 100 ? "secondary" : "default"}
        >
          {progress === 100 ? "Completed" : "Start Assessment"}
        </Button>
      </CardContent>
    </Card>
  );
}

export function AssessmentCards() {
  const { toast } = useToast();

  const handleStart = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!"
    });
  };

  const handleViewResults = () => {
    toast({
      title: "Coming Soon",
      description: "Results viewing will be available soon!"
    });
  };

  const handleAction = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available soon!"
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <AssessmentCard
          title="Value Assessment"
          description="Description of Value Assessment"
          progress={0}
          onStart={handleStart}
        />
        <AssessmentCard
          title="Bartle Test"
          description="Description of Bartle Test"
          progress={35}
          onStart={handleAction}
        />
        <AssessmentCard
          title="Strengths Finder"
          description="Description of Strengths Finder"
          progress={100}
          onStart={handleAction}
        />
        <AssessmentCard
          title="Big 5 Personality"
          description="Description of Big 5 Personality"
          progress={100}
          onStart={handleAction}
        />
        <AssessmentCard
          title="Mental Health"
          description="Description of Mental Health"
          progress={0}
          onStart={handleAction}
        />
      </div>
    </div>
  );
}
