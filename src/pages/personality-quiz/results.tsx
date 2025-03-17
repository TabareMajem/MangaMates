"use client";

import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { QuizLayout } from '@/components/quiz/quiz-layout';
import { QuizResults } from '@/components/quiz/quiz-results';
import { useQuizState } from '@/hooks/use-quiz-state';
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

export default function PersonalityQuizResultsPage() {
  const { type } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { reset } = useQuizState();

  const results = location.state?.results;
  const assessment = type ? assessments[type as keyof typeof assessments] : null;

  if (!assessment || !results) {
    navigate('/personality-quiz');
    return null;
  }

  const handleRetake = () => {
    reset();
    navigate(`/personality-quiz/${type}`);
  };

  return (
    <QuizLayout 
      title={`${assessment.title} Results`}
      onBack={() => navigate('/personality-quiz')}
    >
      <QuizResults
        scores={results}
        traits={assessment.traits}
        onRetake={handleRetake}
      />
    </QuizLayout>
  );
}
