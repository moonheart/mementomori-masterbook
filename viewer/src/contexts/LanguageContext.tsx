/**
 * Language Context - manages language selection and text resource loading
 * 
 * Supports multiple languages from TextResource files:
 * - TextResourceJa (Japanese)
 * - TextResourceZhCn (Simplified Chinese)
 * - TextResourceZhTw (Traditional Chinese)
 * - TextResourceEn (English)
 * - TextResourceKo (Korean)
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

const PROXY_BASE = 'https://ghproxy.moonheart.dev/https://raw.githubusercontent.com/moonheart/mementomori-masterbook/master/Master';

// Available languages
export const LANGUAGES = [
  { code: 'Ja', name: '日本語', file: 'TextResourceJaJpMB.json' },
  { code: 'ZhCn', name: '简体中文', file: 'TextResourceZhCnMB.json' },
  { code: 'ZhTw', name: '繁體中文', file: 'TextResourceZhTwMB.json' },
  { code: 'En', name: 'English', file: 'TextResourceEnUsMB.json' },
  { code: 'Ko', name: '한국어', file: 'TextResourceKoKrMB.json' },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];

// Text resource entry structure
interface TextResourceEntry {
  Id: number;
  IsIgnore: boolean | null;
  Memo: string | null;
  StringKey: string;
  Text: string;
}

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  textResources: Map<string, string>;
  isLoading: boolean;
  error: string | null;
  resolveText: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('ZhCn');
  const [textResources, setTextResources] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load language file
  const loadLanguage = useCallback(async (langCode: LanguageCode) => {
    const langInfo = LANGUAGES.find(l => l.code === langCode);
    if (!langInfo) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${PROXY_BASE}/${langInfo.file}`);
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${response.status}`);
      }
      
      const data: TextResourceEntry[] = await response.json();
      
      // Build lookup map: StringKey -> Text
      // Note: StringKey in the JSON already includes brackets like "[CharacterName1]"
      const resourceMap = new Map<string, string>();
      data.forEach(entry => {
        if (entry.StringKey && entry.Text) {
          // Store with the full key including brackets
          resourceMap.set(entry.StringKey, entry.Text);
        }
      });
      
      setTextResources(resourceMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load language');
      console.error('Language load error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load language on change
  useEffect(() => {
    loadLanguage(currentLanguage);
  }, [currentLanguage, loadLanguage]);

  // Resolve text key to actual text
  const resolveText = useCallback((key: string): string => {
    // Check if it's a text key format: [KeyName]
    // The StringKey in the language file includes brackets, e.g., "[CharacterName1]"
    if (/^\[[^\]]+\]$/.test(key)) {
      const resolved = textResources.get(key);
      if (resolved) {
        return resolved;
      }
    }
    return key;
  }, [textResources]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setCurrentLanguage(lang);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        textResources,
        isLoading,
        error,
        resolveText,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
