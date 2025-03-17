import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react";

const TraitSection = ({ title, icon, traits }: { 
  title: string;
  icon: string;
  traits: string[];
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <img src={icon} alt={title} className="w-5 h-5" />
      <h3 className="font-medium text-white">{title}</h3>
    </div>
    <ul className="space-y-1">
      {traits.map((trait, index) => (
        <li key={index} className="flex items-center gap-2 text-gray-300">
          <img src="/images/tick.png" alt="check" className="w-4 h-4" />
          <span className="text-sm">{trait}</span>
        </li>
      ))}
    </ul>
  </div>
);

export function ProfileSidebar() {
  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-none">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-24 h-24">
          <img src="/images/profile.jpg" alt="Profile" className="object-cover" />
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Alex Johnson</h2>
          <p className="text-gray-300">Software Developer</p>
        </div>
        <div className="flex items-center gap-2 text-gray-300">
          <User className="w-4 h-4" />
          <span>@alexj</span>
        </div>
      </div>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-6">
        <TraitSection
          title="Top Values"
          icon="/images/values.png"
          traits={["Creativity", "Independence"]}
        />
        <TraitSection
          title="Dominant Strengths"
          icon="/images/strengths.png"
          traits={["Strategic Thinking", "Adaptability"]}
        />
        <TraitSection
          title="Personality Traits"
          icon="/images/traits.png"
          traits={[
            "High Openness",
            "Moderate Conscientiousness",
            "Low Extraversion",
            "High Agreeableness"
          ]}
        />
      </div>
    </Card>
  );
}
