import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Search,
  ChevronRight,
  Database,
  Users,
  Sword,
  Shield,
  Map,
  Gift,
  Building2,
  Package,
  Languages,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import { MasterCatalog, MasterBookInfo, categorizeFiles, formatFileSize } from '@/hooks/useMasterData';
import { cn } from '@/lib/utils';

interface SidebarProps {
  catalog: MasterCatalog | null;
  loading: boolean;
  selectedFile: string | null;
  onSelectFile: (fileName: string) => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Character': <Users className="h-4 w-4" />,
  'Equipment': <Shield className="h-4 w-4" />,
  'Battle': <Sword className="h-4 w-4" />,
  'Quest': <Map className="h-4 w-4" />,
  'Gacha': <Gift className="h-4 w-4" />,
  'Guild': <Building2 className="h-4 w-4" />,
  'Item': <Package className="h-4 w-4" />,
  'Text': <Languages className="h-4 w-4" />,
  'Other': <MoreHorizontal className="h-4 w-4" />,
};

export function Sidebar({ catalog, loading, selectedFile, onSelectFile }: SidebarProps) {
  const [search, setSearch] = useState('');
  const [openCategories, setOpenCategories] = useState<Set<string>>(new Set(['Character']));

  const categorizedFiles = useMemo(() => {
    if (!catalog) return {};
    return categorizeFiles(catalog);
  }, [catalog]);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categorizedFiles;

    const searchLower = search.toLowerCase();
    const filtered: Record<string, MasterBookInfo[]> = {};

    Object.entries(categorizedFiles).forEach(([category, files]) => {
      const matchedFiles = files.filter((file) =>
        file.Name.toLowerCase().includes(searchLower)
      );
      if (matchedFiles.length > 0) {
        filtered[category] = matchedFiles;
      }
    });

    return filtered;
  }, [categorizedFiles, search]);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const totalFiles = catalog
    ? Object.keys(catalog.MasterBookInfoMap).length
    : 0;

  return (
    <div className="w-72 h-full flex flex-col border-r border-gold/30 bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-gold/30">
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-5 w-5 text-gold" />
          <h1 className="font-display text-lg text-gold gothic-text-glow">
            MementoMori
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Masterbook Data Viewer
        </p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/50 border-gold/30 focus:border-gold text-sm"
          />
        </div>
      </div>

      {/* File count */}
      <div className="px-4 py-2 text-xs text-muted-foreground border-b border-border/30">
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-3 w-3 animate-spin" />
            Loading catalog...
          </span>
        ) : (
          <span>{totalFiles} data files</span>
        )}
      </div>

      {/* File tree */}
      <ScrollArea className="flex-1 overflow-auto">
        <div className="p-2 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gold" />
            </div>
          ) : (
            Object.entries(filteredCategories).map(([category, files]) => (
              <Collapsible
                key={category}
                open={openCategories.has(category) || search.trim() !== ''}
                onOpenChange={() => toggleCategory(category)}
              >
                <CollapsibleTrigger className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-sidebar-accent transition-colors group">
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 text-muted-foreground transition-transform',
                      (openCategories.has(category) || search.trim() !== '') && 'rotate-90'
                    )}
                  />
                  <span className="text-gold-dim group-hover:text-gold transition-colors">
                    {categoryIcons[category]}
                  </span>
                  <span className="text-sm font-medium flex-1 text-left">
                    {category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {files.length}
                  </span>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="ml-4 pl-2 border-l border-border/30">
                    {files.map((file) => (
                      <button
                        key={file.Name}
                        onClick={() => onSelectFile(file.Name)}
                        className={cn(
                          'flex items-center justify-between w-full px-2 py-1.5 rounded text-sm transition-colors',
                          selectedFile === file.Name
                            ? 'bg-sidebar-accent text-gold'
                            : 'hover:bg-sidebar-accent/50 text-foreground/80 hover:text-foreground'
                        )}
                      >
                        <span className="truncate flex-1 text-left" title={file.Name}>
                          {file.Name.replace('MB', '')}
                        </span>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatFileSize(file.Size)}
                        </span>
                      </button>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))
          )}
          
          {!loading && Object.keys(filteredCategories).length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No files found
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-gold/30 text-xs text-muted-foreground">
        <a
          href="https://github.com/moonheart/mementomori-masterbook"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gold transition-colors"
        >
          Data source: moonheart/mementomori-masterbook
        </a>
      </div>
    </div>
  );
}
