"use client";

import { Switch } from "../ui/switch";
import { useTheme } from "../theme-provider";
import { Moon, Sun } from "lucide-react";

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Appearance</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {theme === 'dark' ? (
            <Moon className="h-4 w-4 text-primary" />
          ) : (
            <Sun className="h-4 w-4 text-primary" />
          )}
          <span className="text-sm font-medium">Dark Mode</span>
        </div>
        <Switch 
          checked={theme === 'dark'}
          onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>
    </div>
  );
}
