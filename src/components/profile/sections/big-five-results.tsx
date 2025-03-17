"use client";


interface BigFiveScore {
  trait: string;
  score: number;
  description: string;
}

export function BigFiveResults({ scores }: { scores: BigFiveScore[] }) {
  return (
    <div className="space-y-6">
      {scores.map((item) => (
        <div key={item.trait} className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">{item.trait}</span>
            <span>{item.score}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${item.score}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
