
import React, { useState } from 'react';
import { Globe, Search } from 'lucide-react';
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

// Country code mapping for the most common countries worldwide
// This list includes ISO 3166-1 alpha-2 country codes
const COUNTRIES = [
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'es', label: 'Spain' },
  { value: 'it', label: 'Italy' },
  { value: 'nl', label: 'Netherlands' },
  { value: 'pl', label: 'Poland' },
  { value: 'ru', label: 'Russia' },
  { value: 'se', label: 'Sweden' },
  { value: 'no', label: 'Norway' },
  { value: 'fi', label: 'Finland' },
  { value: 'dk', label: 'Denmark' },
  { value: 'ch', label: 'Switzerland' },
  { value: 'at', label: 'Austria' },
  { value: 'be', label: 'Belgium' },
  { value: 'ie', label: 'Ireland' },
  { value: 'br', label: 'Brazil' },
  { value: 'mx', label: 'Mexico' },
  { value: 'ar', label: 'Argentina' },
  { value: 'cl', label: 'Chile' },
  { value: 'co', label: 'Colombia' },
  { value: 'pe', label: 'Peru' },
  { value: 'za', label: 'South Africa' },
  { value: 'ng', label: 'Nigeria' },
  { value: 'eg', label: 'Egypt' },
  { value: 'ma', label: 'Morocco' },
  { value: 'ke', label: 'Kenya' },
  { value: 'gh', label: 'Ghana' },
  { value: 'tn', label: 'Tunisia' },
  { value: 'in', label: 'India' },
  { value: 'cn', label: 'China' },
  { value: 'jp', label: 'Japan' },
  { value: 'kr', label: 'South Korea' },
  { value: 'sg', label: 'Singapore' },
  { value: 'my', label: 'Malaysia' },
  { value: 'ph', label: 'Philippines' },
  { value: 'id', label: 'Indonesia' },
  { value: 'th', label: 'Thailand' },
  { value: 'vn', label: 'Vietnam' },
  { value: 'ae', label: 'United Arab Emirates' },
  { value: 'sa', label: 'Saudi Arabia' },
  { value: 'qa', label: 'Qatar' },
  { value: 'tr', label: 'Turkey' },
  { value: 'il', label: 'Israel' },
  { value: 'nz', label: 'New Zealand' },
  { value: 'pt', label: 'Portugal' },
  { value: 'gr', label: 'Greece' },
  { value: 'cz', label: 'Czech Republic' },
  { value: 'hu', label: 'Hungary' },
  { value: 'ro', label: 'Romania' },
  { value: 'bg', label: 'Bulgaria' },
  { value: 'hr', label: 'Croatia' },
  { value: 'si', label: 'Slovenia' },
  { value: 'sk', label: 'Slovakia' },
  { value: 'ee', label: 'Estonia' },
  { value: 'lv', label: 'Latvia' },
  { value: 'lt', label: 'Lithuania' }
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
  const [searchQuery, setSearchQuery] = useState("");
  const selectedCountryName = getCountryName(selectedCountry);

  const filteredCountries = COUNTRIES.filter(country =>
    country.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <CommandInput 
              placeholder="Search country..." 
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-9" 
            />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountries.map((country) => (
                  <CommandItem
                    key={country.value}
                    value={country.value}
                    onSelect={(currentValue) => {
                      onCountryChange(currentValue);
                      setOpen(false);
                      setSearchQuery("");
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
      <div className="ml-2 text-xs text-muted-foreground">
        <span>Showing supported countries</span>
      </div>
    </div>
  );
};

export default JobCountrySelector;
