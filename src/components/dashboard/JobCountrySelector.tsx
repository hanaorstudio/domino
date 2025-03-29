
import React from 'react';
import { Globe } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  return (
    <div className="mb-4 flex items-center">
      <div className="flex items-center mr-2">
        <Globe className="h-4 w-4 mr-1 text-muted-foreground" />
        <span className="text-sm font-medium">Country:</span>
      </div>
      <Select
        value={selectedCountry}
        onValueChange={onCountryChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {COUNTRIES.map((country) => (
            <SelectItem key={country.value} value={country.value}>
              {country.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobCountrySelector;
