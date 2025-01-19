import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

interface AssessmentCardProps {
  title: string;
  progress: number;
  status: "completed" | "in-progress" | "not-started";
  onStart: () => void;
  onViewResults: () => void;
}

function AssessmentCard({ 
  title, 
  progress, 
  status,
  onStart,
  onViewResults 
}: AssessmentCardProps) {
  return (
    <Card className="p-4 bg-[#1CAEFF] text-white">
      <h3 className="font-medium mb-2">{title}</h3>
      {status === "completed" ? (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={onViewResults}
          className="w-full"
        >
          View Results
        </Button>
      ) : status === "in-progress" ? (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm">{progress}% completed</p>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => {
              console.log('Feature coming soon');
              toast({
                title: 'Coming Soon',
                description: 'This feature is under development'
              });
            }}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      ) : (
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => {
            console.log('Feature coming soon');
            toast({
              title: 'Coming Soon',
              description: 'This feature is under development'
            });
          }}
          className="w-full"
        >
          Start Assessment
        </Button>
      )}
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

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    // Actual implementation or explicit comment
    // Intentionally empty - placeholder for future implementation
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white">Assessments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <AssessmentCard
          title="Value Assessment"
          progress={0}
          status="not-started"
          onStart={handleStart}
          onViewResults={handleViewResults}
        />
        <AssessmentCard
          title="Bartle Test"
          progress={35}
          status="in-progress"
          onStart={handleAction}
          onViewResults={handleAction}
        />
        <AssessmentCard
          title="Strengths Finder"
          progress={100}
          status="completed"
          onStart={handleAction}
          onViewResults={handleAction}
        />
        <AssessmentCard
          title="Big 5 Personality"
          progress={100}
          status="completed"
          onStart={handleAction}
          onViewResults={handleAction}
        />
        <AssessmentCard
          title="Mental Health"
          progress={0}
          status="not-started"
          onStart={handleAction}
          onViewResults={handleAction}
        />
      </div>
    </div>
  );
}