import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

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
  bufferSize?: number;
};

export default function VirtualizedTable<
  T extends Record<string, ReactNode> & { id: number }
>({ data, columns, rowHeight = 40, height = 400, bufferSize = 20 }: Props<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const totalRows = data.length;
  const totalHeight = totalRows * rowHeight;
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 0), 0);

  const viewportHeight = height;
  const viewportStart = scrollTop;
  const viewportEnd = viewportStart + viewportHeight;

  const startIndex = Math.max(
    0,
    Math.floor(viewportStart / rowHeight) - bufferSize
  );
  const endIndex = Math.min(
    Math.ceil(viewportEnd / rowHeight) + bufferSize,
    totalRows
  );

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
            minWidth: isMobile ? totalWidth : "auto",
          }}
        >
          {columns.map((column) => (
            <div
              key={column.key}
              style={{
                width: isMobile
                  ? column.width
                  : `${(column.width / totalWidth) * 100}%`,
                minWidth: column.minWidth || column.width,
                padding: "12px 10px",
                fontWeight: 600,
                fontSize: "14px",
                color: "#495057",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
            fontFamily: "sans-serif",
            scrollBehavior: isScrolling ? "auto" : "smooth",
            minWidth: isMobile ? totalWidth : "auto",
          }}
        >
          <div style={{ height: totalHeight, position: "relative" }}>
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
                transition: isScrolling ? "none" : "transform 0.05s ease-out",
                willChange: "transform",
              }}
            >
              {visibleRows.map((row, i) => (
                <div
                  key={startIndex + i}
                  style={{
                    height: rowHeight,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 10px",
                    borderBottom: "1px solid #eee",
                    opacity: isScrolling ? 0.8 : 1,
                    transition: "opacity 0.1s ease-out",
                  }}
                >
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      style={{
                        width: isMobile
                          ? column.width
                          : `${(column.width / totalWidth) * 100}%`,
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
                      {column.key
                        .split(".")
                        .reduce((obj: any, key) => obj?.[key], row)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
