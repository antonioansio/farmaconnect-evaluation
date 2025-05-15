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
          {
            column.key.split(".").reduce<unknown>((obj, key) => {
              if (obj && typeof obj === "object" && key in obj) {
                return (obj as Record<string, unknown>)[key];
              }
              return undefined;
            }, row as unknown) as ReactNode
          }
        </div>
      ))}
    </div>
  )
);

TableRow.displayName = "TableRow";

export default TableRow;
