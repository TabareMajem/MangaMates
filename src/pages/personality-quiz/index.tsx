import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { QuizLayout } from "@/components/quiz/quiz-layout";

const assessments = [
  {
    id: "values",
    title: "Values Assessment",
    description: "Discover your core values and find characters that share your principles",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    href: "/personality-quiz/values"
  },
  {
    id: "strengths",
    title: "Strengths Finder",
    description: "Identify your key strengths and match with characters who share them",
    image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516",
    href: "/personality-quiz/strengths"
  },
  {
    id: "bartle",
    title: "Bartle Test",
    description: "Learn your gamer personality type and find characters that match your style",
    image: "https://images.unsplash.com/photo-1612686635542-2244ed9f8ddc",
    href: "/personality-quiz/bartle"
  },
  {
    id: "big-five",
    title: "Big Five Personality",
    description: "Understand your personality traits through the scientific Big Five model",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113",
    href: "/personality-quiz/big-five"
  },
  {
    id: "mental-health",
    title: "Mental Health Check",
    description: "Reflect on your emotional well-being and find supportive characters",
    image: "https://images.unsplash.com/photo-1635805737707-575885ab0820",
    href: "/personality-quiz/mental-health"
  }
];

export default function PersonalityQuizPage() {
  return (
    <QuizLayout title="Choose Your Assessment">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map((assessment) => (
          <Link key={assessment.id} to={assessment.href} className="block">
            <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
              <div className="aspect-video">
                <img
                  src={assessment.image}
                  alt={assessment.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{assessment.title}</h3>
                <p className="text-muted-foreground">{assessment.description}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </QuizLayout>
  );
}
