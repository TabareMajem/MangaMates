"use client";

import { Switch } from "../ui/switch";
import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationSettings() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Notifications</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Daily Reminders</span>
        </div>
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
    </div>
  );
}
