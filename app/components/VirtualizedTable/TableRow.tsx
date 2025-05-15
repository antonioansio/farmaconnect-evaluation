import React, { memo, ReactNode } from "react";

type Column<T> = {
  key: Extract<keyof T, string>;
  label: string;
  width: number;
  minWidth?: number;
};

type TableRowProps<T extends Record<string, ReactNode>> = {
  row: T;
  columns: Column<T>[];
  totalWidth: number;
  rowHeight: number;
  index: number;
};

const TableRow = memo(
  <T extends Record<string, ReactNode>>({
    row,
    columns,
    totalWidth,
    rowHeight,
  }: TableRowProps<T>) => (
    <div
      style={{
        height: rowHeight,
        display: "flex",
        alignItems: "center",
        padding: "0 10px",
        borderBottom: "1px solid #eee",
      }}
    >
      {columns.map((column: Column<T>) => (
        <div
          key={column.key}
          style={{
            width: `${(column.width / totalWidth) * 100}%`,
            minWidth: column.minWidth || column.width,
            padding: "0 10px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          {column.key.split(".").reduce((obj: any, key) => obj?.[key], row)}
        </div>
      ))}
    </div>
  )
);

TableRow.displayName = "TableRow";

export default TableRow;
