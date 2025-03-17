"use client";

import { Switch } from "../ui/switch";
import { Shield } from "lucide-react";
import { useState } from "react";

export function PrivacySettings() {
  const [enabled, setEnabled] = useState(true);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Privacy</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Enhanced Privacy Mode</span>
        </div>
        <Switch 
          checked={enabled}
          onCheckedChange={setEnabled}
        />
      </div>
    </div>
  );
}
