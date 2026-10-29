import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer, type VirtualItem } from "@tanstack/react-virtual";
import type { ReactNode } from "react";
import type {
    UseInfiniteQueryResult,
    InfiniteData,
} from "@tanstack/react-query";

// ---- Correct Page Type ----
type Page<T> = {
    data: T[];
    nextPage: number;
    hasMore: boolean;
    total: number;
};

type Breakpoints = {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
};

type Props<T> = {
    query: UseInfiniteQueryResult<InfiniteData<Page<T>>>;
    renderCard: (item: T) => ReactNode;
    estimateHeight?: number;
    gap?: number;
    breakpoints?: Breakpoints;
};

const getColumns = (breakpoints: Breakpoints) => {
    const width = window.innerWidth;

    if (width < 640) return breakpoints.xs ?? 1;
    if (width < 768) return breakpoints.sm ?? 2;
    if (width < 1024) return breakpoints.md ?? 3;
    return breakpoints.lg ?? 4;
};

export function InfiniteScroll<T>({
    query,
    renderCard,
    estimateHeight = 320,
    gap = 20,
    breakpoints = { xs: 1, sm: 2, md: 3, lg: 4 },
}: Props<T>) {
    const parentRef = useRef<HTMLDivElement | null>(null);
    const [columns, setColumns] = useState(() => getColumns(breakpoints));

    useEffect(() => {
        const handleResize = () => {
            setColumns(getColumns(breakpoints));
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoints]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = query;

    // ✅ FIX: correctly typed pages
    const allItems = useMemo(() => {
        return data?.pages.flatMap((p: Page<T>) => p.data) ?? [];
    }, [data]);

    const rowCount = Math.ceil(allItems.length / columns);

    const rowVirtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => parentRef.current,
        estimateSize: () => estimateHeight + gap,
        overscan: 5,
    });

    useEffect(() => {
        rowVirtualizer.measure();
    }, [columns]);

    useEffect(() => {
        const virtualItems = rowVirtualizer.getVirtualItems();
        const lastItem = virtualItems[virtualItems.length - 1];

        if (!lastItem) return;

        if (
            lastItem.index >= rowCount - 1 &&
            hasNextPage &&
            !isFetchingNextPage
        ) {
            fetchNextPage();
        }
    }, [
        rowVirtualizer.getVirtualItems(),
        rowCount,
        hasNextPage,
        isFetchingNextPage,
    ]);


    const gridColsClass = {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
    }[columns as 1 | 2 | 3 | 4];

    if (isLoading) return (
        <div className={`grid ${gridColsClass} gap-5`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse bg-white rounded-2xl border border-slate-300 overflow-hidden"
                    style={{ height: estimateHeight }}
                >
                    {/* Image skeleton */}
                    {/* <div className="h-30 bg-slate-200" /> */}

                    {/* Content skeleton */}
                    <div className="p-4 space-y-3">
                        <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
                        <div className="h-4 w-2/3 bg-slate-200 rounded" />
                        <div className="h-3 w-full bg-slate-200 rounded" />
                        <div className="h-3 w-5/6 bg-slate-200 rounded" />
                        <div className="h-8 w-full bg-slate-200 rounded mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div className="h-full flex flex-col">
            <div ref={parentRef} className="flex-1 overflow-auto">
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: "relative",
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow: VirtualItem) => {
                        const startIndex = virtualRow.index * columns;
                        const rowItems = allItems.slice(
                            startIndex,
                            startIndex + columns
                        );

                        return (
                            <div
                                key={virtualRow.key}
                                className={`grid ${gridColsClass}`}
                                style={{
                                    gap: `${gap}px`,
                                    padding: "16px",
                                    position: "absolute",
                                    transform: `translateY(${virtualRow.start}px)`,
                                    width: "100%",
                                }}
                            >
                                {rowItems.map((item: T, idx: number) => (
                                    <div key={idx}>{renderCard(item)}</div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* {isFetchingNextPage && (
          <p className="text-center py-4">Loading more...</p>
        )} */}

                {isFetchingNextPage && (
                    <div
                        className={`grid ${gridColsClass}`}
                        style={{ gap: `${gap}px`, padding: "16px" }}
                    >
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-white rounded-2xl border border-slate-400 overflow-hidden"
                                style={{ height: estimateHeight }}
                            >
                                {/* Image skeleton */}
                                <div className="h-40 bg-slate-200" />

                                {/* Content skeleton */}
                                <div className="p-4 space-y-3">
                                    <div className="h-3 w-1/3 bg-slate-200 rounded animate-pulse" />
                                    <div className="h-4 w-2/3 bg-slate-200 rounded" />
                                    <div className="h-3 w-full bg-slate-200 rounded" />
                                    <div className="h-3 w-5/6 bg-slate-200 rounded" />
                                    <div className="h-8 w-full bg-slate-200 rounded mt-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!hasNextPage && (
                    <p className="text-center py-4">No more data</p>
                )}
            </div>
        </div>
    );
}