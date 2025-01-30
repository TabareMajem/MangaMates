"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizLayout } from '@/components/quiz/quiz-layout';
import { QuizContainer } from '@/components/quiz/quiz-container';
import { QuizResults } from '@/components/quiz/quiz-results';
import { useQuizState } from '@/hooks/use-quiz-state';
import { 
  bartleTest,
  bigFiveAssessment,
  mentalHealthAssessment,
  strengthsFinderAssessment,
  valuesAssessment
} from '@/data/assessments';
import type { Assessment } from '@/data/assessments/types';

const assessments = {
  bartle: bartleTest,
  'big-five': bigFiveAssessment,
  'mental-health': mentalHealthAssessment,
  strengths: strengthsFinderAssessment,
  values: valuesAssessment
};

interface QuizPageProps {
  assessmentType: keyof typeof assessments;
}

export default function QuizPage({ assessmentType }: QuizPageProps) {
  const navigate = useNavigate();
  const [isComplete, setIsComplete] = useState(false);
  const [results, setResults] = useState<Record<string, number> | null>(null);
  const { reset } = useQuizState();

  const assessment = assessments[assessmentType];

  if (!assessment) {
    return <div>Assessment not found</div>;
  }

  const handleComplete = (scores: Record<string, number>) => {
    setResults(scores);
    setIsComplete(true);
  };

  const handleRetake = () => {
    reset();
    setIsComplete(false);
    setResults(null);
  };

  return (
    <QuizLayout 
      title={assessment.title}
      onBack={() => navigate('/personality-quiz')}
    >
      {isComplete && results ? (
        <QuizResults
          scores={results}
          traits={assessment.traits}
          onRetake={handleRetake}
        />
      ) : (
        <QuizContainer
          assessment={assessment}
          onComplete={handleComplete}
        />
      )}
    </QuizLayout>
  );
}
