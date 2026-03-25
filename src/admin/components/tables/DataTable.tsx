import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../app/components/ui/table';

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  rows: T[];
  columns: DataTableColumn<T>[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectedRowKey?: string | null;
  /** Ex.: borda de alerta por SLA ou inadimplência */
  getRowClassName?: (row: T) => string | undefined;
};

export function DataTable<T>({ rows, columns, rowKey, onRowClick, selectedRowKey, getRowClassName }: DataTableProps<T>) {
  return (
    <div className="rounded-xl border overflow-hidden bg-white" style={{ borderColor: 'rgba(255, 165, 0, 0.2)' }}>
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow className="bg-[#FFF8E7] hover:bg-[#FFF8E7]">
            {columns.map((col) => (
              <TableHead key={col.key} className={`text-[11px] uppercase tracking-wide text-[#6B5D53] ${col.className ?? ''}`}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const extra = getRowClassName?.(row) ?? '';
            return (
            <TableRow
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={
                onRowClick
                  ? `cursor-pointer hover:bg-[#FAFAFA] ${selectedRowKey === rowKey(row) ? 'bg-[#FFF8E7]' : ''} ${extra}`.trim()
                  : extra || undefined
              }
            >
              {columns.map((col) => (
                <TableCell key={`${rowKey(row)}-${col.key}`} className={col.className}>
                  {col.render(row)}
                </TableCell>
              ))}
            </TableRow>
          );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
