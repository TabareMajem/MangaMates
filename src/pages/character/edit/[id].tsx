"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { getCharacterById } from "@/lib/data/characters";
import { Share2, Save } from "lucide-react";

export default function CharacterEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [character, setCharacter] = useState(getCharacterById(id!));
  const [shareUrl, setShareUrl] = useState("");

  const [formData, setFormData] = useState({
    goals: "",
    customPrompt: "",
    notes: ""
  });

  useEffect(() => {
    if (!character) {
      navigate('/character/list');
    }
  }, [character, navigate]);

  const handleSave = () => {
    // Save character customizations
    toast({
      title: "Success",
      description: "Character customizations saved!"
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/character/${id}?customization=${btoa(JSON.stringify(formData))}`;
    await navigator.clipboard.writeText(url);
    setShareUrl(url);
    
    toast({
      title: "Success",
      description: "Share URL copied to clipboard!"
    });
  };

  if (!character) return null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1a0f1f] to-[#150c2e] py-16">
      <div className="container mx-auto px-4">
        <Card className="p-8 bg-black/20 backdrop-blur-sm border-none">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <img
                src={character.imageUrl}
                alt={character.name}
                className="w-full rounded-lg object-cover aspect-square mb-4"
              />
              <h1 className="text-2xl font-bold mb-2">{character.name}</h1>
              <p className="text-muted-foreground mb-4">{character.series}</p>
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">Character Goals</label>
                <Textarea
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                  placeholder="Set goals for this character..."
                  className="h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Custom Prompt</label>
                <Textarea
                  value={formData.customPrompt}
                  onChange={(e) => setFormData({ ...formData, customPrompt: e.target.value })}
                  placeholder="Customize how the character responds..."
                  className="h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Personal Notes</label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add your personal notes about this character..."
                  className="h-32"
                />
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleShare} variant="outline" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Character
                </Button>
              </div>

              {shareUrl && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">Share URL:</p>
                  <code className="text-xs break-all">{shareUrl}</code>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
