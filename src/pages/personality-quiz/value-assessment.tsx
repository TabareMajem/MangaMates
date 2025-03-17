"use client";

import { useState } from "react";
import { QuizLayout } from "@/components/quiz/quiz-layout";
import { QuestionCard } from "@/components/quiz/question-card";
import { QuizNavigation } from "@/components/quiz/quiz-navigation";
import { useNavigate } from "react-router-dom";

const QUESTIONS = [
  {
    id: 1,
    title: "Question 1 - The Choice of Leadership",
    scenario: "In the bustling city of Sakura Town, Hiro, the confident leader of the group, is organizing a community event. However, unexpected obstacles arise.",
    image: "/images/quiz/leadership.jpg",
    options: [
      {
        text: "Take charge, delegate tasks, and motivate everyone to push through.",
        value: "leadership"
      },
      {
        text: "Encourage the team to brainstorm creative solutions together.",
        value: "collaboration"
      },
      {
        text: "Seek advice from a mentor to find the best course of action.",
        value: "wisdom"
      },
      {
        text: "Work individually to solve the issues quietly behind the scenes.",
        value: "independence"
      }
    ]
  }
  // Add more questions here
];

export default function ValueAssessment() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleSelect = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestion === QUESTIONS.length - 1) {
      // Submit answers and navigate to results
      navigate("/personality-quiz/results");
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const question = QUESTIONS[currentQuestion];

  return (
    <QuizLayout 
      title="Value Assessment"
      onBack={() => navigate("/personality-quiz")}
    >
      <QuestionCard
        question={question}
        selectedOption={answers[currentQuestion]}
        onSelect={handleSelect}
      />
      <QuizNavigation
        onPrevious={currentQuestion > 0 ? handlePrevious : undefined}
        onNext={handleNext}
        canGoNext={!!answers[currentQuestion]}
        isLastQuestion={currentQuestion === QUESTIONS.length - 1}
      />
    </QuizLayout>
  );
}
