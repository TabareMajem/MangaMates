import { Insight } from '@/types/insights';
import { toast } from 'sonner';
import { Card } from '../ui/card';
import { EmotionChart } from './EmotionChart';
import { ExportButton } from './ExportButton';
import { ProgressChart } from './ProgressChart';

interface InsightCardsProps {
  insights: Insight[];
}

export function InsightCards({ insights }: InsightCardsProps) {
  const handleEmotionClick = (emotion: string, value: number) => {
    toast.info(`${emotion}: ${(value * 100).toFixed(0)}%`);
  };

  const handleShare = async (insight: Insight) => {
    try {
      const response = await fetch('/api/insights/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insight)
      });
      
      if (response.ok) {
        const { shareUrl } = await response.json();
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className="grid gap-4">
      {insights.map(insight => (
        <Card key={insight.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)} Insight
            </h3>
            <ExportButton 
              data={insight.data}
              filename={`${insight.type}-${insight.id}`}
              onShare={() => handleShare(insight)}
            />
          </div>
          
          {insight.type === 'emotional' && (
            <EmotionChart 
              data={insight.data.emotions} 
              onEmotionClick={handleEmotionClick}
            />
          )}
          
          {insight.type === 'progress' && (
            <ProgressChart data={insight.data.progress} />
          )}
          
          {insight.type === 'behavioral' && (
            <div className="space-y-2">
              {Object.entries(insight.data.patterns).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
          
          <time className="text-sm text-gray-500 mt-2 block">
            {new Date(insight.created_at).toLocaleDateString()}
          </time>
        </Card>
      ))}
    </div>
  );
}
