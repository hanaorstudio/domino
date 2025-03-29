
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, X } from 'lucide-react';
import { 
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

// Country options for the selector
const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'in', label: 'India' },
  { value: 'sg', label: 'Singapore' },
  { value: 'jp', label: 'Japan' },
  { value: 'nl', label: 'Netherlands' },
];

interface JobCountrySelectorProps {
  selectedCountry: string;
  onCountryChange: (value: string) => void;
}

export const getCountryCode = (countryName: string): string => {
  const country = COUNTRIES.find(c => c.label === countryName);
  return country ? country.value : 'us'; // Default to US
};

export const getCountryName = (countryCode: string): string => {
  const country = COUNTRIES.find(c => c.value === countryCode);
  return country ? country.label : 'United States'; // Default to United States
};

const JobCountrySelector: React.FC<JobCountrySelectorProps> = ({ 
  selectedCountry, 
  onCountryChange 
}) => {
  const [open, setOpen] = useState(false);
  const selectedCountryName = getCountryName(selectedCountry);

  return (
    <div className="mb-4 flex items-center">
      <div className="flex items-center mr-2">
        <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-sm font-medium">Country:</span>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {selectedCountryName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." className="h-9" />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      onCountryChange(currentValue);
                      setOpen(false);
                    }}
                  >
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default JobCountrySelector;
