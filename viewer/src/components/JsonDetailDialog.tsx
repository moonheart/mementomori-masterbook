/**
 * Design Philosophy: Dark Gothic Data Cathedral
 * 
 * JSON Detail Dialog - displays nested objects and arrays in a visual format
 * - Simple arrays: displayed as a list
 * - Object arrays: displayed as a nested table (recursive)
 * - Single objects: displayed as key-value pairs
 * - Automatically resolves [xxx] text keys using language context
 */

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronRight, List, Braces, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface JsonDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data: unknown;
}

// Check if value is a primitive (not object/array)
function isPrimitive(value: unknown): boolean {
  return value === null || typeof value !== 'object';
}

// Check if array contains only primitives
function isSimpleArray(arr: unknown[]): boolean {
  return arr.every(isPrimitive);
}

// Check if array contains objects
function isObjectArray(arr: unknown[]): boolean {
  return arr.length > 0 && arr.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
}

// Format primitive value for display
function formatValue(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

// Check if string is a text key format: [xxx]
function isTextKey(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /^\[[^\]]+\]$/.test(value);
}

// Check if string contains HTML <br> tags
function containsHtmlBr(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  return /<br\s*\/?>/i.test(value);
}

// Render a clickable JSON cell with text resolution
interface JsonCellProps {
  value: unknown;
  columnName: string;
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}

function JsonCell({ value, columnName, onCellClick, resolveText }: JsonCellProps) {
  if (isPrimitive(value)) {
    const formatted = formatValue(value);
    
    // Determine display value and resolution status
    let displayValue = formatted;
    const isKey = isTextKey(value);
    let isResolved = false;

    if (isKey) {
      const resolved = resolveText(value as string);
      if (resolved !== value) {
        displayValue = resolved;
        isResolved = true;
      }
    }

    // Check if the display value (possibly resolved) contains HTML <br> tags
    if (containsHtmlBr(displayValue)) {
      const preview = displayValue.replace(/<br\s*\/?>/gi, ' ');
      const truncated = preview.length > 50 ? preview.substring(0, 47) + '...' : preview;
      
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCellClick(columnName, { __html: displayValue });
              }}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors text-left group max-w-full cursor-pointer"
            >
              <FileText className="h-3 w-3 flex-shrink-0" />
              <span className={`truncate group-hover:underline ${isResolved ? 'text-emerald-400' : ''}`}>
                {truncated}
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-md">
            <div className="text-xs">
              {isKey && <div className="text-muted-foreground mb-1">Key: {formatted}</div>}
              <div className="text-foreground">Click to view full content</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    
    // Check if it's a text key that needs resolution (no <br> found)
    if (isKey) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={isResolved ? 'text-emerald-400 cursor-help' : 'text-amber-400 cursor-help'}>
              {isResolved ? displayValue : formatted}
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-md">
            <div className="text-xs">
              <div className="text-muted-foreground">Key: {formatted}</div>
              {isResolved && <div className="text-muted-foreground mt-1">Resolved: {displayValue}</div>}
              {!isResolved && <div className="text-amber-400 mt-1">Not found in language file</div>}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    
    return <span className="text-foreground">{formatted}</span>;
  }

  const isArray = Array.isArray(value);
  const preview = JSON.stringify(value);
  const truncated = preview.length > 50 ? preview.substring(0, 47) + '...' : preview;

  return (
    <button
      onClick={() => onCellClick(columnName, value)}
      className="flex items-center gap-1 text-gold hover:text-gold-bright transition-colors text-left group"
    >
      {isArray ? (
        <List className="h-3 w-3 flex-shrink-0" />
      ) : (
        <Braces className="h-3 w-3 flex-shrink-0" />
      )}
      <span className="truncate group-hover:underline">{truncated}</span>
    </button>
  );
}

// Render simple array as a list with text resolution
function SimpleArrayView({
  data,
  onCellClick,
  resolveText
}: {
  data: unknown[];
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}) {
  return (
    <div className="space-y-1">
      {data.map((item, index) => {
        return (
          <div
            key={index}
            className="px-3 py-2 bg-secondary/30 rounded border border-gold/20 font-mono text-sm"
          >
            <JsonCell value={item} columnName={`[${index}]`} onCellClick={onCellClick} resolveText={resolveText} />
          </div>
        );
      })}
    </div>
  );
}

// Render object as key-value pairs
function ObjectView({ 
  data, 
  onCellClick,
  resolveText 
}: { 
  data: Record<string, unknown>; 
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}) {
  const entries = Object.entries(data);

  return (
    <div className="space-y-1">
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="flex border border-gold/20 rounded overflow-hidden"
        >
          <div className="w-1/3 px-3 py-2 bg-secondary/50 font-medium text-gold border-r border-gold/20 truncate" title={key}>
            {key}
          </div>
          <div className="w-2/3 px-3 py-2 bg-secondary/20 font-mono text-sm overflow-hidden">
            <JsonCell value={value} columnName={key} onCellClick={onCellClick} resolveText={resolveText} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Render array of objects as a table
function ObjectArrayView({ 
  data, 
  onCellClick,
  resolveText 
}: { 
  data: Record<string, unknown>[]; 
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}) {
  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  data.forEach(obj => {
    Object.keys(obj).forEach(key => allKeys.add(key));
  });
  const columns = Array.from(allKeys);

  return (
    <div className="min-w-full border border-gold/20 rounded-md bg-secondary/10">
      <table className="w-max min-w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col}
                className="px-3 py-2 text-left bg-secondary/50 border border-gold/20 text-gold font-medium text-sm whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-secondary/20'}>
              {columns.map(col => (
                <td
                  key={col}
                  className="px-3 py-2 border border-gold/20 text-sm font-mono"
                >
                  <div className="max-w-[300px] overflow-hidden whitespace-nowrap">
                    <JsonCell value={row[col]} columnName={col} onCellClick={onCellClick} resolveText={resolveText} />
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Check if data is HTML content (from DataTable with __html property)
function isHtmlContent(data: unknown): data is { __html: string } {
  return typeof data === 'object' && data !== null && '__html' in data;
}

// Render HTML content view - converts <br> tags to proper line breaks
function HtmlContentView({ html }: { html: string }) {
  // Convert <br> tags to actual HTML line breaks and wrap in paragraphs
  const processedHtml = html
    .replace(/<br\s*\/?>/gi, '<br/>')
    .split(/<br\/>/)
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('<br/>');
  
  return (
    <div 
      className="px-4 py-3 bg-secondary/30 rounded border border-gold/20 text-foreground leading-relaxed whitespace-pre-wrap"
      style={{ lineHeight: '1.8' }}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}

// Main content renderer with recursive support
function JsonContent({ 
  data, 
  onCellClick,
  resolveText 
}: { 
  data: unknown; 
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}) {
  // Check for HTML content first
  if (isHtmlContent(data)) {
    return <HtmlContentView html={data.__html} />;
  }

  if (isPrimitive(data)) {
    return (
      <div className="px-3 py-2 bg-secondary/30 rounded border border-gold/20 font-mono text-sm">
        <JsonCell value={data} columnName="Value" onCellClick={onCellClick} resolveText={resolveText} />
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return (
        <div className="text-muted-foreground text-center py-4">
          Empty array
        </div>
      );
    }

    if (isSimpleArray(data)) {
      return <SimpleArrayView data={data} onCellClick={onCellClick} resolveText={resolveText} />;
    }

    if (isObjectArray(data)) {
      return <ObjectArrayView data={data as Record<string, unknown>[]} onCellClick={onCellClick} resolveText={resolveText} />;
    }

    // Mixed array - show as list with clickable items
    return (
      <div className="space-y-1">
        {data.map((item, index) => (
          <div
            key={index}
            className="px-3 py-2 bg-secondary/30 rounded border border-gold/20 font-mono text-sm"
          >
            <JsonCell value={item} columnName={`[${index}]`} onCellClick={onCellClick} resolveText={resolveText} />
          </div>
        ))}
      </div>
    );
  }

  // Object
  return <ObjectView data={data as Record<string, unknown>} onCellClick={onCellClick} resolveText={resolveText} />;
}

// Breadcrumb navigation for nested views
interface BreadcrumbItem {
  title: string;
  data: unknown;
}

export function JsonDetailDialog({ open, onOpenChange, title, data }: JsonDetailDialogProps) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  const { resolveText } = useLanguage();

  // Reset breadcrumbs when dialog opens with new data
  useEffect(() => {
    if (open && data !== null && data !== undefined) {
      setBreadcrumbs([{ title, data }]);
    }
  }, [open, title, data]);

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
  };

  const currentItem = breadcrumbs[breadcrumbs.length - 1];

  // Don't render content if no breadcrumbs yet
  if (!currentItem) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[80vh] bg-card border-gold/30 overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-gold font-display gothic-text-glow">
              Loading...
            </DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const handleCellClick = (cellTitle: string, cellData: unknown) => {
    setBreadcrumbs(prev => [...prev, { title: cellTitle, data: cellData }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    setBreadcrumbs(prev => prev.slice(0, index + 1));
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] bg-card border-gold/30 overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gold font-display gothic-text-glow">
            {/* Breadcrumb navigation */}
            <div className="flex items-center gap-1 flex-wrap">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  <button
                    onClick={() => handleBreadcrumbClick(index)}
                    className={`hover:underline ${
                      index === breadcrumbs.length - 1
                        ? 'text-gold'
                        : 'text-muted-foreground hover:text-gold'
                    }`}
                  >
                    {item.title}
                  </button>
                </div>
              ))}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh] w-full min-w-0 flex-1">
          <div className="pr-4 pb-4">
            <JsonContent data={currentItem.data} onCellClick={handleCellClick} resolveText={resolveText} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

// Export helper components for use in DataTable
export { formatValue, isPrimitive };
