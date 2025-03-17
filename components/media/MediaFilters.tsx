"use client";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { MediaFormat, MediaSeason, MediaStatus, MediaType } from "@/types/media";
import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useState } from "react";

interface MediaFiltersProps {
  onFilterChange: (filters: MediaFilterValues) => void;
  className?: string;
}

interface MediaFilterValues {
  type?: MediaType;
  format?: MediaFormat;
  status?: MediaStatus;
  season?: MediaSeason;
  genres?: string[];
}

const mediaTypes: MediaType[] = ['ANIME', 'MANGA'];
const mediaFormats: MediaFormat[] = ['TV', 'MOVIE', 'OVA', 'MANGA', 'NOVEL'];
const mediaStatuses: MediaStatus[] = ['finished', 'releasing', 'not_yet_released', 'cancelled'];
const mediaSeasons: MediaSeason[] = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
const genres = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Thriller'
];

export function MediaFilters({ onFilterChange, className }: MediaFiltersProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<MediaFilterValues>({});
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const handleFilterChange = useCallback((key: keyof MediaFilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [filters, onFilterChange]);

  const handleGenreToggle = useCallback((genre: string) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre];
      
      handleFilterChange('genres', newGenres);
      return newGenres;
    });
  }, [handleFilterChange]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap gap-2">
        {/* Type Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[150px] justify-between"
            >
              {filters.type || "Type"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder="Search type..." />
              <CommandEmpty>No type found.</CommandEmpty>
              <CommandGroup>
                {mediaTypes.map((type) => (
                  <CommandItem
                    key={type}
                    value={type}
                    onSelect={() => handleFilterChange('type', type)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.type === type ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {type}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Format Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[150px] justify-between"
            >
              {filters.format || "Format"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder="Search format..." />
              <CommandEmpty>No format found.</CommandEmpty>
              <CommandGroup>
                {mediaFormats.map((format) => (
                  <CommandItem
                    key={format}
                    value={format}
                    onSelect={() => handleFilterChange('format', format)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.format === format ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {format}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Status Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[150px] justify-between"
            >
              {filters.status || "Status"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder="Search status..." />
              <CommandEmpty>No status found.</CommandEmpty>
              <CommandGroup>
                {mediaStatuses.map((status) => (
                  <CommandItem
                    key={status}
                    value={status}
                    onSelect={() => handleFilterChange('status', status)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.status === status ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {status}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Season Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-[150px] justify-between"
            >
              {filters.season || "Season"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[150px] p-0">
            <Command>
              <CommandInput placeholder="Search season..." />
              <CommandEmpty>No season found.</CommandEmpty>
              <CommandGroup>
                {mediaSeasons.map((season) => (
                  <CommandItem
                    key={season}
                    value={season}
                    onSelect={() => handleFilterChange('season', season)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        filters.season === season ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {season}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Separator />

      {/* Genre Tags */}
      <div className="flex flex-wrap gap-2">
        {genres.map((genre) => (
          <Button
            key={genre}
            variant={selectedGenres.includes(genre) ? "default" : "outline"}
            size="sm"
            onClick={() => handleGenreToggle(genre)}
          >
            {genre}
          </Button>
        ))}
      </div>
    </div>
  );
}
