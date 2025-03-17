import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Speedometer } from "@/components/charts/speedometer";

interface InsightCardProps {
  title: string;
  children: React.ReactNode;
}

function InsightCard({ title, children }: InsightCardProps) {
  return (
    <Card className="p-6 bg-black/30 backdrop-blur-sm border-none">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </Card>
  );
}

function ValueAssessment() {
  const values = [
    { name: "Creativity", value: 80 },
    { name: "Independence", value: 75 },
    { name: "Achievements", value: 70 },
    { name: "Relationships", value: 85 },
    { name: "Security", value: 65 }
  ];

  return (
    <InsightCard title="Value Assessment">
      <div className="space-y-4">
        {values.map(value => (
          <div key={value.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{value.name}</span>
              <span className="text-white/80">{value.value}%</span>
            </div>
            <Progress value={value.value} className="h-2" />
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

function BartleTest() {
  const traits = [
    { name: "Achiever", value: 85 },
    { name: "Explorer", value: 70 },
    { name: "Socialiser", value: 60 },
    { name: "Killer", value: 45 }
  ];

  return (
    <InsightCard title="Bartle Test">
      <div className="space-y-4">
        {traits.map(trait => (
          <div key={trait.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{trait.name}</span>
              <span className="text-white/80">{trait.value}%</span>
            </div>
            <Progress value={trait.value} className="h-2" />
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

function StrengthsFinder() {
  const strengths = [
    { name: "Leadership", value: 90 },
    { name: "Empathy", value: 85 },
    { name: "Strategic Thinking", value: 75 },
    { name: "Communication", value: 80 }
  ];

  return (
    <InsightCard title="Strengths Finder">
      <div className="space-y-4">
        {strengths.map(strength => (
          <div key={strength.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{strength.name}</span>
              <span className="text-white/80">{strength.value}%</span>
            </div>
            <Progress value={strength.value} className="h-2" />
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

function BigFivePersonality() {
  const traits = [
    { name: "Openness to Experience", value: 85 },
    { name: "Conscientiousness", value: 60 },
    { name: "Extraversion", value: 45 },
    { name: "Agreeableness", value: 75 },
    { name: "Neuroticism", value: 30 }
  ];

  return (
    <InsightCard title="Big 5 Personality Traits">
      <div className="space-y-4">
        {traits.map(trait => (
          <div key={trait.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white">{trait.name}</span>
              <span className="text-white/80">{trait.value}%</span>
            </div>
            <Progress value={trait.value} className="h-2" />
          </div>
        ))}
      </div>
    </InsightCard>
  );
}

function MentalHealth() {
  return (
    <InsightCard title="Mental Health Personality">
      <div className="flex justify-center">
        <Speedometer value={75} />
      </div>
    </InsightCard>
  );
}

function MangaStory() {
  return (
    <Card className="relative h-[170px] overflow-hidden bg-black/30 backdrop-blur-sm border-none">
      <img
        src="/images/manga-story-bg.jpg"
        alt="Manga Story"
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />
      <div className="relative h-full flex items-center justify-center">
        <button className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors">
          View My Manga Story
        </button>
      </div>
    </Card>
  );
}

export function InsightsDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ValueAssessment />
      <MentalHealth />
      <BigFivePersonality />
      <BartleTest />
      <StrengthsFinder />
      <MangaStory />
    </div>
  );
}
