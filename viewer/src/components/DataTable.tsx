/**
 * Design Philosophy: Dark Gothic Data Cathedral
 * 
 * DataTable component - displays JSON data in a table format
 * - Does NOT flatten nested objects/arrays
 * - Shows JSON strings for complex values
 * - Click to open detail dialog for nested data
 * - Automatically resolves [xxx] text keys using language context
 */

import { useState, useMemo, useEffect } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
  ColumnDef,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  X,
  List,
  Braces,
  FileText,
  Info,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { JsonDetailDialog, isPrimitive, formatValue } from './JsonDetailDialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMasterData } from '@/hooks/useMasterData';

interface DataTableProps {
  data: unknown[];
  fileName: string;
}

interface ItemMbEntry {
  ItemId: number;
  ItemType: number;
  NameKey: string;
  DisplayName?: string;
  Memo?: string;
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

// Cell renderer component with text key resolution
interface CellRendererProps {
  value: unknown;
  columnName: string;
  onCellClick: (title: string, data: unknown) => void;
  resolveText: (key: string) => string;
}

function CellRenderer({ value, columnName, onCellClick, resolveText }: CellRendererProps) {
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
      const truncated = preview.length > 60 ? preview.substring(0, 57) + '...' : preview;
      
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
              <div className="text-muted-foreground">Click to view full content</div>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
    
    // If it was a Key but no <br> found, show resolution status with tooltip
    if (isKey) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={isResolved ? 'text-emerald-400 cursor-help' : 'text-amber-400 cursor-help'}>
              {displayValue}
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
    
    return <span>{formatted}</span>;
  }

  const isArray = Array.isArray(value);
  const preview = JSON.stringify(value);
  const truncated = preview.length > 60 ? preview.substring(0, 57) + '...' : preview;

  return (
    <button
      onClick={() => onCellClick(columnName, value)}
      className="flex items-center gap-1 text-gold hover:text-gold-bright transition-colors text-left group max-w-full"
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

export function DataTable({ data, fileName }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  
  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogData, setDialogData] = useState<unknown>(null);

  // Language context for text resolution
  const { resolveText } = useLanguage();

  // Load ItemMb for name resolution
  const { data: itemMbData } = useMasterData('ItemMB');

  // Create a memoized lookup map for ItemMb
  const itemMap = useMemo(() => {
    const map = new Map<string, ItemMbEntry>();
    if (itemMbData && Array.isArray(itemMbData)) {
      itemMbData.forEach((item: any) => {
        if (item.ItemId !== undefined && item.ItemType !== undefined) {
          const key = `${item.ItemId}-${item.ItemType}`;
          map.set(key, item);
        }
      });
    }
    return map;
  }, [itemMbData]);

  // Process data to inject _ItemName
  const processedData = useMemo(() => {
    if (!data || data.length === 0 || fileName === 'ItemMB') return data;

    // Recursive function to inject _ItemName into any object containing ItemId & ItemType
    const injectNames = (val: any): any => {
      if (!val || typeof val !== 'object') return val;

      if (Array.isArray(val)) {
        return val.map(injectNames);
      }

      // Process current object
      const result: any = { ...val };
      if (result.ItemId !== undefined && result.ItemType !== undefined) {
        const key = `${result.ItemId}-${result.ItemType}`;
        const itemInfo = itemMap.get(key);
        if (itemInfo) {
          // Priority: DisplayName > NameKey > Memo
          const itemName = itemInfo.DisplayName || itemInfo.NameKey || itemInfo.Memo;
          if (itemName) {
            result._ItemName = itemName;
          }
        }
      }

      // Recursively process all properties
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key) && key !== '_ItemName') {
          result[key] = injectNames(result[key]);
        }
      }

      return result;
    };

    return data.map(injectNames);
  }, [data, itemMap, fileName]);

  const handleCellClick = (title: string, cellData: unknown) => {
    setDialogTitle(title);
    setDialogData(cellData);
    setDialogOpen(true);
  };

  // Extract columns from first-level keys only (no flattening)
  const columns = useMemo(() => {
    if (!processedData || processedData.length === 0) {
      return [];
    }

    // Get all unique keys from all rows (first level only)
    const allKeys = new Set<string>();
    processedData.forEach((row) => {
      if (row && typeof row === 'object' && !Array.isArray(row)) {
        Object.keys(row as Record<string, unknown>).forEach((key) => allKeys.add(key));
      }
    });

    // Ensure _ItemName is near ItemId/ItemType if it exists
    const keysArray = Array.from(allKeys);
    if (allKeys.has('_ItemName')) {
      const index = keysArray.indexOf('_ItemName');
      keysArray.splice(index, 1);
      
      // Find a good place to insert it (after ItemId or ItemType)
      const insertIndex = Math.max(
        keysArray.indexOf('ItemId'),
        keysArray.indexOf('ItemType')
      ) + 1;
      
      if (insertIndex > 0) {
        keysArray.splice(insertIndex, 0, '_ItemName');
      } else {
        keysArray.unshift('_ItemName');
      }
    }

    // Create columns
    const columnHelper = createColumnHelper<Record<string, unknown>>();
    const cols: ColumnDef<Record<string, unknown>, unknown>[] = keysArray.map((key) =>
      columnHelper.accessor(key, {
        header: () => (
          <div className="flex items-center gap-1">
            {key === '_ItemName' && <Info className="h-3 w-3 text-emerald-400" />}
            <span>{key}</span>
          </div>
        ),
        cell: (info) => {
          const value = info.getValue();
          return (
            <CellRenderer
              value={value}
              columnName={key}
              onCellClick={handleCellClick}
              resolveText={resolveText}
            />
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const value = row.getValue(columnId);
          let stringValue = isPrimitive(value) 
            ? formatValue(value) 
            : JSON.stringify(value);
          
          // Also search in resolved text (only for Key columns)
          if (isTextKey(value)) {
            const resolved = resolveText(value as string);
            stringValue = `${stringValue} ${resolved}`;
          }
          
          return stringValue.toLowerCase().includes(filterValue.toLowerCase());
        },
      })
    );

    return cols;
  }, [processedData, resolveText]);

  const table = useReactTable({
    data: processedData as Record<string, unknown>[],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase();
      // Search through all columns
      const rowData = row.original;
      for (const key of Object.keys(rowData)) {
        const value = rowData[key];
        let stringValue = isPrimitive(value) 
          ? formatValue(value) 
          : JSON.stringify(value);
        
        // Also search in resolved text (only for Key columns)
        if (isTextKey(value)) {
          const resolved = resolveText(value as string);
          stringValue = `${stringValue} ${resolved}`;
        }
        
        if (stringValue.toLowerCase().includes(searchValue)) {
          return true;
        }
      }
      return false;
    },
    initialState: {
      pagination: {
        pageSize: 50,
      },
    },
  });

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and info */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gold/30">
        <div className="flex items-center gap-4 min-w-0">
          <h2 className="font-display text-xl text-gold gothic-text-glow truncate" title={fileName}>
            {fileName}
          </h2>
          <span className="text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} / {data.length} rows
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 w-64 bg-secondary/50 border-gold/30 focus:border-gold"
            />
            {globalFilter && (
              <button
                onClick={() => setGlobalFilter('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-max min-w-full data-table border-collapse">
          <thead className="sticky top-0 bg-card z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSorted = header.column.getIsSorted();
                  const isFiltered = activeFilterColumn === header.id;
                  const filterValue = header.column.getFilterValue() as string;
                  
                  return (
                    <th
                      key={header.id}
                      className="px-3 py-2 text-left border-b border-gold/30 bg-card"
                    >
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => header.column.toggleSorting()}
                          className="flex items-center gap-1 hover:text-gold-bright transition-colors group"
                        >
                          <span className="truncate max-w-[180px]" title={header.column.id}>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          <span className="opacity-50 group-hover:opacity-100">
                            {isSorted === 'asc' ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : isSorted === 'desc' ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-3 w-3" />
                            )}
                          </span>
                        </button>
                        
                        {/* Column filter */}
                        <div className="flex items-center gap-1">
                          {isFiltered ? (
                            <div className="flex items-center gap-1">
                              <Input
                                placeholder="Filter..."
                                value={filterValue || ''}
                                onChange={(e) => header.column.setFilterValue(e.target.value)}
                                className="h-6 text-xs bg-secondary/50 border-gold/30 w-full"
                                autoFocus
                              />
                              <button
                                onClick={() => {
                                  header.column.setFilterValue('');
                                  setActiveFilterColumn(null);
                                }}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setActiveFilterColumn(header.id)}
                              className="text-xs text-muted-foreground hover:text-gold transition-colors"
                            >
                              {filterValue ? `Filter: ${filterValue}` : 'Filter'}
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row, index) => (
              <tr
                key={row.id}
                className={`
                  border-b border-border/30 transition-colors
                  hover:bg-secondary/50
                  ${index % 2 === 0 ? 'bg-transparent' : 'bg-secondary/20'}
                `}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-3 py-2 text-sm font-mono whitespace-nowrap"
                  >
                    <div className="max-w-[400px] overflow-hidden">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between gap-4 p-4 border-t border-gold/30 bg-card">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => table.setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20 h-8 bg-secondary/50 border-gold/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[25, 50, 100, 200].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gold/30"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gold/30"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gold/30"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 border-gold/30"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* JSON Detail Dialog */}
      <JsonDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={dialogTitle}
        data={dialogData}
      />
    </div>
  );
}
