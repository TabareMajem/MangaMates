"use client";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { AppearanceSettings } from "./appearance-settings";
import { NotificationSettings } from "./notification-settings";
import { PrivacySettings } from "./privacy-settings";
import { useToast } from "@/hooks/use-toast";

export function SettingsPanel() {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Success",
      description: "Settings saved successfully"
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/50 to-background border-none">
      <h2 className="text-2xl font-semibold text-primary mb-6">Settings</h2>
      
      <div className="space-y-6">
        <AppearanceSettings />
        <NotificationSettings />
        <PrivacySettings />

        <Button className="w-full mt-6" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
