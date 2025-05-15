import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import TableRow from "./TableRow";

type Column<T> = {
  key: Extract<keyof T, string>;
  label: string;
  width: number;
  minWidth?: number;
};

type Props<T extends Record<string, ReactNode>> = {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  height?: number;
};

export default function VirtualizedTable<
  T extends Record<string, ReactNode> & { id: number }
>({ data, columns, rowHeight = 40, height = 400 }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const totalRows = data.length;
  const totalHeight = Math.max(totalRows * rowHeight, height);
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 0), 0);

  const viewportHeight = height;
  const viewportStart = scrollTop;
  const viewportEnd = viewportStart + viewportHeight;

  const startIndex = Math.max(0, Math.floor(viewportStart / rowHeight));
  const endIndex = Math.min(Math.ceil(viewportEnd / rowHeight), totalRows);

  const offsetY = startIndex * rowHeight;

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 50);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => {
        container.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }
  }, [handleScroll]);

  const visibleRows = data.slice(startIndex, endIndex);

  console.log(visibleRows);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <div
          style={{
            display: "flex",
            backgroundColor: "#f8f9fa",
            borderBottom: "2px solid #e9ecef",
            position: "sticky",
            top: 0,
            zIndex: 1,
            minWidth: totalWidth,
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              style={{
                width: `${(column.width / totalWidth) * 100}%`,
                minWidth: column.minWidth || column.width,
                padding: "12px 10px",
                fontWeight: 600,
                fontSize: "14px",
                color: "#495057",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              {column.label}
            </div>
          ))}
        </div>

        <div
          ref={containerRef}
          style={{
            height,
            overflowY: "auto",
            overflowX: "auto",
            fontFamily: "sans-serif",
            scrollBehavior: isScrolling ? "auto" : "smooth",
            minWidth: totalWidth,
          }}
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                transition: isScrolling ? "none" : "transform 0.01s ease-out",
                willChange: "transform",
              }}
            >
              {visibleRows.map((row) => (
                <TableRow
                  key={row.id}
                  row={row}
                  columns={columns}
                  totalWidth={totalWidth}
                  rowHeight={rowHeight}
                  index={startIndex + visibleRows.indexOf(row)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
