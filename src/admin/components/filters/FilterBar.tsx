import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../../../app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../app/components/ui/select';

type FilterOption = { label: string; value: string };

type FilterBarProps = {
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterLabel: string;
  options: FilterOption[];
};

export function FilterBar({
  searchPlaceholder,
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  filterLabel,
  options,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B5D53]" />
        <Input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="pl-9 border-2 bg-white"
          style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}
        />
      </div>

      <div className="w-full md:w-[220px]">
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="border-2 bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
            <SelectValue placeholder={filterLabel} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
