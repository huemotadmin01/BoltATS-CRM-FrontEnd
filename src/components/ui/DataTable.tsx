import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Search, Download, Settings } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { clsx } from 'clsx';

export interface Column<T> {
  id: keyof T;
  header: string;
  cell?: (value: T[keyof T], row: T) => React.ReactNode;
  sortable?: boolean;
  searchable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  exportable?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  searchable = true,
  exportable = true,
  className,
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Set<keyof T>>(new Set());

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;

    return data.filter((row) =>
      columns
        .filter((col) => col.searchable !== false)
        .some((col) => {
          const value = row[col.id];
          return String(value).toLowerCase().includes(searchQuery.toLowerCase());
        })
    );
  }, [data, searchQuery, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const visibleColumns = columns.filter((col) => !hiddenColumns.has(col.id));

  const handleSort = (columnId: keyof T) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    setSortConfig((current) => {
      if (current?.key === columnId) {
        return current.direction === 'asc'
          ? { key: columnId, direction: 'desc' }
          : null;
      }
      return { key: columnId, direction: 'asc' };
    });
  };

  const exportToCsv = () => {
    const csvContent = [
      visibleColumns.map((col) => col.header).join(','),
      ...sortedData.map((row) =>
        visibleColumns
          .map((col) => {
            const value = row[col.id];
            return typeof value === 'string' && value.includes(',')
              ? `"${value}"`
              : value;
          })
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const toggleColumnVisibility = (columnId: keyof T) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  return (
    <div className={clsx('bg-white rounded-lg shadow', className)}>
      {(searchable || exportable) && (
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {exportable && (
              <Button variant="outline" size="sm" onClick={exportToCsv}>
                <Download size={16} className="mr-2" />
                Export CSV
              </Button>
            )}
            <div className="relative">
              <Button variant="outline" size="sm">
                <Settings size={16} className="mr-2" />
                Columns
              </Button>
              {/* Column visibility toggle would go here */}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={String(column.id)}
                  className={clsx(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && 'cursor-pointer hover:bg-gray-100',
                    column.width && `w-${column.width}`
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sortConfig?.key === column.id && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr
                key={index}
                className={clsx(
                  'hover:bg-gray-50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row)}
              >
                {visibleColumns.map((column) => (
                  <td
                    key={String(column.id)}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {column.cell
                      ? column.cell(row[column.id], row)
                      : String(row[column.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  );
}