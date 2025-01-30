import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  progress: number;
  unlocked: boolean;
  points: number;
}

export function AchievementCard({
  title,
  description,
  icon: Icon,
  progress,
  unlocked,
  points
}: AchievementCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all",
      unlocked ? "bg-primary/10" : "bg-secondary/50"
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "rounded-full p-2",
          unlocked ? "bg-primary/20" : "bg-secondary"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            unlocked ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          
          <div className="mt-4 space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs">
              <span>{Math.round(progress)}% Complete</span>
              <span>{points} Points</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
