import { Button } from "./button";

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeekdayPickerProps {
  selected: string[];
  onChange: (days: string[]) => void;
}

export function WeekdayPicker({ selected, onChange }: WeekdayPickerProps) {
  const toggleDay = (day: string) => {
    if (selected.includes(day)) {
      onChange(selected.filter(d => d !== day));
    } else {
      onChange([...selected, day]);
    }
  };

  return (
    <div className="flex gap-1">
      {DAYS.map(day => (
        <Button
          key={day}
          size="sm"
          variant={selected.includes(day) ? "default" : "outline"}
          onClick={() => toggleDay(day)}
        >
          {day}
        </Button>
      ))}
    </div>
  );
}
