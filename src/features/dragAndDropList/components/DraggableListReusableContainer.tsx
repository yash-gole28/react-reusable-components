import { useState, useRef, useCallback,type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DraggableItem {
  id: string | number;
}

export interface RenderItemParams<T> {
  item: T;
  index: number;
  isDragging: boolean;
  isDraggingAny: boolean;
  /** Spread or call this on your drag handle's onPointerDown — drag only starts from here */
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    style: React.CSSProperties;
  };
}

export interface DraggableListProps<T extends DraggableItem> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (params: RenderItemParams<T>) => ReactNode;
  itemHeight: number;
  height?: number | string;
  scrollZone?: number;
  scrollSpeed?: number;
  className?: string;
}

// ─── DragHandle ───────────────────────────────────────────────────────────────
// Accepts dragHandleProps from renderItem and wires them up automatically.

interface DragHandleProps {
  dragHandleProps: RenderItemParams<DraggableItem>["dragHandleProps"];
  className?: string;
}

export const DragHandle = ({ dragHandleProps, className = "" }: DragHandleProps) => (
  <div
    {...dragHandleProps}
    className={`flex-shrink-0 flex items-center justify-center ${className}`}
  >
    <svg
      width="14" height="14" viewBox="0 0 16 16" fill="currentColor"
      className="cursor-grab active:cursor-grabbing"
    >
      <circle cx="5"  cy="3"  r="1.3" /><circle cx="11" cy="3"  r="1.3" />
      <circle cx="5"  cy="8"  r="1.3" /><circle cx="11" cy="8"  r="1.3" />
      <circle cx="5"  cy="13" r="1.3" /><circle cx="11" cy="13" r="1.3" />
    </svg>
  </div>
);

// ─── DraggableList ────────────────────────────────────────────────────────────

export function DraggableList<T extends DraggableItem>({
  items,
  onReorder,
  renderItem,
  itemHeight,
  height = "auto",
  scrollZone = 80,
  scrollSpeed = 10,
  className = "",
}: DraggableListProps<T>) {

  const [dragIdx, setDragIdx]   = useState<number | null>(null);
  const [ghostY, setGhostY]     = useState(0);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const scrollRef      = useRef<HTMLDivElement>(null);
  const dragIdxRef     = useRef<number | null>(null);
  const hoverIdxRef    = useRef<number | null>(null);
  const startYRef      = useRef(0);
  const startTopRef    = useRef(0);
  const startScrollRef = useRef(0);
  const pageYRef       = useRef(0);
  const rafRef         = useRef(0);
  const scrollRafRef   = useRef(0);
  const didMoveRef     = useRef(false);
  const itemsLenRef    = useRef(items.length);
  itemsLenRef.current  = items.length;

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  const autoScrollLoop = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller || dragIdxRef.current === null) return;

    const { top: sTop, bottom: sBottom } = scroller.getBoundingClientRect();
    const cursorY = pageYRef.current - window.scrollY;

    let delta = 0;
    if (cursorY < sTop + scrollZone)
      delta = -scrollSpeed * Math.max(0.2, 1 - (cursorY - sTop) / scrollZone);
    else if (cursorY > sBottom - scrollZone)
      delta = scrollSpeed * Math.max(0.2, 1 - (sBottom - cursorY) / scrollZone);

    if (delta !== 0) {
      scroller.scrollTop += delta;
      const ghostTop = Math.max(0, Math.min(
        startTopRef.current + (pageYRef.current - startYRef.current) + (scroller.scrollTop - startScrollRef.current),
        (itemsLenRef.current - 1) * itemHeight,
      ));
      setGhostY(ghostTop);
      const over = Math.max(0, Math.min(
        itemsLenRef.current - 1,
        Math.floor((ghostTop + itemHeight / 2) / itemHeight),
      ));
      if (over !== hoverIdxRef.current) {
        hoverIdxRef.current = over;
        setHoverIdx(over);
      }
    }
    scrollRafRef.current = requestAnimationFrame(autoScrollLoop);
  }, [itemHeight, scrollZone, scrollSpeed]);

  const stopAutoScroll  = () => cancelAnimationFrame(scrollRafRef.current);
  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    scrollRafRef.current = requestAnimationFrame(autoScrollLoop);
  }, [autoScrollLoop]);

  // ── Drag start — only called from the handle ──────────────────────────────
  const onHandlePointerDown = useCallback((e: React.PointerEvent<HTMLElement>, index: number) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    // Capture on the handle element itself so pointermove/up follow the pointer
    e.currentTarget.setPointerCapture(e.pointerId);
    // Prevent the click from also firing on the row (e.g. play handler)
    e.stopPropagation();

    const scrollTop = scrollRef.current?.scrollTop ?? 0;
    dragIdxRef.current     = index;
    hoverIdxRef.current    = index;
    startYRef.current      = e.pageY;
    startTopRef.current    = index * itemHeight;
    startScrollRef.current = scrollTop;
    pageYRef.current       = e.pageY;
    didMoveRef.current     = false;

    setDragIdx(index);
    setHoverIdx(index);
    setGhostY(index * itemHeight);
    startAutoScroll();
  }, [itemHeight, startAutoScroll]);

  // ── Pointer move / up — on the container ─────────────────────────────────
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragIdxRef.current === null) return;
    didMoveRef.current = true;
    pageYRef.current = e.pageY;

    const scrollDelta = (scrollRef.current?.scrollTop ?? 0) - startScrollRef.current;
    const rawTop  = startTopRef.current + (e.pageY - startYRef.current) + scrollDelta;
    const clamped = Math.max(0, Math.min(rawTop, (itemsLenRef.current - 1) * itemHeight));

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGhostY(clamped);
      const over = Math.max(0, Math.min(
        itemsLenRef.current - 1,
        Math.floor((clamped + itemHeight / 2) / itemHeight),
      ));
      if (over !== hoverIdxRef.current) {
        hoverIdxRef.current = over;
        setHoverIdx(over);
      }
    });
  }, [itemHeight]);

  const onPointerUp = useCallback(() => {
    if (dragIdxRef.current === null) return;
    stopAutoScroll();
    cancelAnimationFrame(rafRef.current);

    const from = dragIdxRef.current;
    const to   = hoverIdxRef.current ?? from;

    if (didMoveRef.current && from !== to) {
      const next = [...items];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      onReorder(next);
    }

    dragIdxRef.current  = null;
    hoverIdxRef.current = null;
    didMoveRef.current  = false;
    setDragIdx(null);
    setHoverIdx(null);
  }, [items, onReorder]);

  // ── Shift helper ──────────────────────────────────────────────────────────
  const getShift = (index: number): number => {
    if (dragIdx === null || hoverIdx === null || index === dragIdx) return 0;
    if (dragIdx < hoverIdx) {
      if (index > dragIdx && index <= hoverIdx) return -itemHeight;
    } else {
      if (index >= hoverIdx && index < dragIdx) return itemHeight;
    }
    return 0;
  };

  const isDraggingAny = dragIdx !== null;

  // ── Render ────────────────────────────────────────────────────────────────
  const innerList = (
    <div
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className="relative select-none"
      style={{ height: items.length * itemHeight }}
    >
      {items.map((item, index) => {
        const isThisGhost = index === dragIdx;

        // dragHandleProps is passed into renderItem so only the handle triggers drag
        const dragHandleProps: RenderItemParams<T>["dragHandleProps"] = {
          onPointerDown: (e) => onHandlePointerDown(e, index),
          style: { touchAction: "none" }, // required for pointer capture on touch
        };

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
              transform: isThisGhost ? "none" : `translateY(${getShift(index)}px)`,
              transition: isThisGhost ? "none" : "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
              opacity: isThisGhost ? 0 : 1,
              zIndex: 1,
              pointerEvents: isThisGhost ? "none" : "auto",
            }}
          >
            {renderItem({ item, index, isDragging: false, isDraggingAny, dragHandleProps })}
          </div>
        );
      })}

      {/* Ghost */}
      {dragIdx !== null && (
        <div
          style={{
            position: "absolute",
            top: ghostY,
            left: 0,
            right: 0,
            height: itemHeight,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {renderItem({
            item: items[dragIdx],
            index: hoverIdx ?? dragIdx,
            isDragging: true,
            isDraggingAny: true,
            dragHandleProps: { onPointerDown: () => {}, style: {} },
          })}
        </div>
      )}
    </div>
  );

  if (height === "auto") {
    return <div className={className}>{innerList}</div>;
  }

  return (
    <div
      ref={scrollRef}
      className={className}
      style={{ height, overflowY: "auto", scrollbarWidth: "none" }}
    >
      {innerList}
    </div>
  );
}