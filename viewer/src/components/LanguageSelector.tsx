/**
 * Language Selector Component
 * 
 * Allows users to switch between different language files
 */

import { Languages, Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage, LANGUAGES, LanguageCode } from '@/contexts/LanguageContext';

export function LanguageSelector() {
  const { currentLanguage, setLanguage, isLoading } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gold-dim" />
      <Select
        value={currentLanguage}
        onValueChange={(value) => setLanguage(value as LanguageCode)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-32 h-8 bg-secondary/50 border-gold/30 text-sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          {LANGUAGES.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
