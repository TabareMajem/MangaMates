"use client";

interface CharacterFiltersProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export function CharacterFilters({ selectedType, onTypeChange }: CharacterFiltersProps) {
  return (
    <select
      value={selectedType}
      onChange={(e) => onTypeChange(e.target.value)}
      className="rounded-md border border-input bg-background px-3 py-2"
    >
      <option value="all">All Types</option>
      <option value="anime">Anime</option>
      <option value="manhwa">Manhwa</option>
      <option value="idol">K-pop</option>
    </select>
  );
}
