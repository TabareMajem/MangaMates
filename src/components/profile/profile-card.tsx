"use client";

import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { User } from "lucide-react"; // Changed from Line to User
import type { PersonalityProfile } from "@/types/profile";

interface ProfileCardProps {
  profile: PersonalityProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-none p-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="w-32 h-32" />
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">{profile.name}</h2>
          <p className="text-sm text-gray-300">{profile.occupation}</p>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4" />
          <span className="text-sm">@{profile.username}</span>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <TraitSection 
          title="Top Values" 
          traits={profile.topValues} 
          icon="/images/values.png"
        />
        <TraitSection 
          title="Dominant Strengths" 
          traits={profile.dominantStrengths}
          icon="/images/strengths.png"
        />
        <TraitSection 
          title="Personality Traits" 
          traits={profile.personalityTraits}
          icon="/images/traits.png"
        />
      </div>
    </Card>
  );
}

interface TraitSectionProps {
  title: string;
  traits: string[];
  icon: string;
}

function TraitSection({ title, traits, icon }: TraitSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <img src={icon} alt={title} className="w-5 h-5" />
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <ul className="space-y-1">
        {traits.map((trait, index) => (
          <li key={index} className="text-sm text-gray-300">
            • {trait}
          </li>
        ))}
      </ul>
    </div>
  );
}
