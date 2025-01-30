import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InsightsHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Discover patterns in your journal entries</p>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue="30">
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Calendar className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
