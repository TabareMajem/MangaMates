"use client";

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizLayout } from '@/components/quiz/quiz-layout';
import { QuizContainer } from '@/components/quiz/quiz-container';
import { useQuizState } from '@/hooks/use-quiz-state';
import { useAuth } from '@/lib/auth/context';
import { 
  bartleTest,
  bigFiveAssessment,
  mentalHealthAssessment,
  strengthsFinderAssessment,
  valuesAssessment
} from '@/data/assessments';

const assessments = {
  bartle: bartleTest,
  'big-five': bigFiveAssessment,
  'mental-health': mentalHealthAssessment,
  strengths: strengthsFinderAssessment,
  values: valuesAssessment
};

export default function AssessmentPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setAssessment } = useQuizState();

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin?redirect=/personality-quiz/' + type);
      return;
    }

    if (!type || !assessments[type as keyof typeof assessments]) {
      navigate('/personality-quiz');
      return;
    }

    setAssessment(assessments[type as keyof typeof assessments]);
  }, [type, user, navigate, setAssessment]);

  const assessment = type ? assessments[type as keyof typeof assessments] : null;

  if (!assessment || !user) {
    return null;
  }

  const handleComplete = (results: Record<string, number>) => {
    navigate(`/personality-quiz/${type}/results`, { 
      state: { results } 
    });
  };

  return (
    <QuizLayout 
      title={assessment.title}
      onBack={() => navigate('/personality-quiz')}
    >
      <QuizContainer
        assessment={assessment}
        onComplete={handleComplete}
      />
    </QuizLayout>
  );
}
