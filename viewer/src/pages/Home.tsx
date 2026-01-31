import { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { DataTable } from '@/components/DataTable';
import { LoadingState, ErrorState, EmptyState } from '@/components/LoadingState';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useMasterCatalog, useMasterData } from '@/hooks/useMasterData';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader2 } from 'lucide-react';

/**
 * Design Philosophy: Dark Gothic Data Cathedral
 * 
 * Deep purple-black tones with golden accents create a mysterious,
 * solemn data browsing experience that matches MementoMori's death aesthetics.
 */
export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  
  const { catalog, loading: catalogLoading, error: catalogError } = useMasterCatalog();
  const { data, loading: dataLoading, error: dataError } = useMasterData(selectedFile);
  const { isLoading: langLoading } = useLanguage();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        catalog={catalog}
        loading={catalogLoading}
        selectedFile={selectedFile}
        onSelectFile={setSelectedFile}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with language selector */}
        <div className="flex items-center justify-end gap-4 px-4 py-2 border-b border-gold/20 bg-card/50">
          {langLoading && (
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Loading language...
            </span>
          )}
          <LanguageSelector />
        </div>

        {/* Error states */}
        {catalogError && (
          <ErrorState message={`Failed to load catalog: ${catalogError}`} />
        )}
        
        {dataError && (
          <ErrorState message={`Failed to load data: ${dataError}`} />
        )}

        {/* Loading state */}
        {!catalogError && !dataError && dataLoading && (
          <LoadingState message={`Loading ${selectedFile}...`} />
        )}

        {/* Empty state - no file selected */}
        {!catalogError && !dataError && !dataLoading && !selectedFile && (
          <EmptyState />
        )}

        {/* Data table */}
        {!catalogError && !dataError && !dataLoading && selectedFile && data && (
          <DataTable data={data} fileName={selectedFile} />
        )}
      </main>
    </div>
  );
}
