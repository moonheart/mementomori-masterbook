import { useState, useEffect, useCallback } from 'react';

const PROXY_BASE = 'https://ghproxy.moonheart.dev/https://raw.githubusercontent.com/moonheart/mementomori-masterbook/master/Master';

export interface MasterBookInfo {
  Hash: string;
  Name: string;
  Size: number;
}

export interface MasterCatalog {
  MasterBookInfoMap: Record<string, MasterBookInfo>;
}

export function useMasterCatalog() {
  const [catalog, setCatalog] = useState<MasterCatalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${PROXY_BASE}/master-catalog.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch catalog: ${response.status}`);
        }
        const data = await response.json();
        setCatalog(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catalog');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  return { catalog, loading, error };
}

export function useMasterData(fileName: string | null) {
  const [data, setData] = useState<unknown[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!fileName) {
      setData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${PROXY_BASE}/${fileName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      const jsonData = await response.json();
      
      // Handle both array and object data
      if (Array.isArray(jsonData)) {
        setData(jsonData);
      } else if (typeof jsonData === 'object' && jsonData !== null) {
        // If it's an object, wrap it in an array
        setData([jsonData]);
      } else {
        setData([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fileName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Helper to categorize data files
export function categorizeFiles(catalog: MasterCatalog): Record<string, MasterBookInfo[]> {
  const categories: Record<string, MasterBookInfo[]> = {
    'Character': [],
    'Equipment': [],
    'Battle': [],
    'Quest': [],
    'Gacha': [],
    'Guild': [],
    'Item': [],
    'Text': [],
    'Other': [],
  };

  Object.values(catalog.MasterBookInfoMap).forEach((info) => {
    const name = info.Name;
    if (name.startsWith('Character') || name.includes('Character')) {
      categories['Character'].push(info);
    } else if (name.startsWith('Equipment') || name.includes('Equipment')) {
      categories['Equipment'].push(info);
    } else if (name.includes('Battle') || name.includes('Enemy') || name.includes('Skill')) {
      categories['Battle'].push(info);
    } else if (name.includes('Quest') || name.includes('Chapter') || name.includes('Tower')) {
      categories['Quest'].push(info);
    } else if (name.includes('Gacha')) {
      categories['Gacha'].push(info);
    } else if (name.includes('Guild')) {
      categories['Guild'].push(info);
    } else if (name.includes('Item') || name.includes('Treasure') || name.includes('Trade')) {
      categories['Item'].push(info);
    } else if (name.startsWith('TextResource')) {
      categories['Text'].push(info);
    } else {
      categories['Other'].push(info);
    }
  });

  // Sort each category alphabetically
  Object.keys(categories).forEach((key) => {
    categories[key].sort((a, b) => a.Name.localeCompare(b.Name));
  });

  return categories;
}
