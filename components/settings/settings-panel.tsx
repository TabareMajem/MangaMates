"use client";

import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Bell, Shield } from "lucide-react";

export function SettingsPanel() {
  return (
    <Card className="p-6 bg-gradient-to-br from-secondary/50 to-background border-none">
      <h2 className="text-2xl font-semibold text-primary mb-6">Settings</h2>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Appearance</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-primary" />
              <Label htmlFor="theme">Dark Mode</Label>
            </div>
            <Switch id="theme" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <Label htmlFor="notifications">Daily Reminders</Label>
            </div>
            <Switch id="notifications" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Privacy</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <Label htmlFor="privacy">Enhanced Privacy Mode</Label>
            </div>
            <Switch id="privacy" />
          </div>
        </div>

        <Button className="w-full mt-6">
          Save Changes
        </Button>
      </div>
    </Card>
  );
}
