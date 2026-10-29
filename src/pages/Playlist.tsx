import { useState, useRef, useCallback, useEffect } from "react";

interface Track {
  id: number;
  name: string;
  artist: string;
  duration: string;
  emoji: string;
  color: string;
}

const INITIAL_TRACKS: Track[] = [
  { id: 1,  name: "Midnight Bloom",     artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 2,  name: "Coastal Drive",      artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 3,  name: "Golden Hour",        artist: "Meridian Days",  duration: "3:58", emoji: "🌅", color: "bg-amber-900/60 text-amber-300" },
  { id: 4,  name: "Electric Rain",      artist: "Neon Static",    duration: "5:03", emoji: "⚡", color: "bg-blue-900/60 text-blue-300" },
  { id: 5,  name: "Velvet Underground", artist: "Moss & Stone",   duration: "4:29", emoji: "🌿", color: "bg-emerald-900/60 text-emerald-300" },
  { id: 6,  name: "City at 3am",        artist: "Sidewalk Ghost", duration: "3:17", emoji: "🌃", color: "bg-indigo-900/60 text-indigo-300" },
  { id: 7,  name: "Desert Song",        artist: "Dune Drift",     duration: "4:52", emoji: "🏜️", color: "bg-orange-900/60 text-orange-300" },
  { id: 8,  name: "Midnight Bloom",     artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 9,  name: "Coastal Drive",      artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 10, name: "Golden Hour",        artist: "Meridian Days",  duration: "3:58", emoji: "🌅", color: "bg-amber-900/60 text-amber-300" },
  { id: 11, name: "Electric Rain",      artist: "Neon Static",    duration: "5:03", emoji: "⚡", color: "bg-blue-900/60 text-blue-300" },
  { id: 12, name: "Velvet Underground", artist: "Moss & Stone",   duration: "4:29", emoji: "🌿", color: "bg-emerald-900/60 text-emerald-300" },
  { id: 13, name: "City at 3am",        artist: "Sidewalk Ghost", duration: "3:17", emoji: "🌃", color: "bg-indigo-900/60 text-indigo-300" },
  { id: 14, name: "Desert Song",        artist: "Dune Drift",     duration: "4:52", emoji: "🏜️", color: "bg-orange-900/60 text-orange-300" },
  { id: 15, name: "Midnight Bloom",     artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 16, name: "Coastal Drive",      artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 17, name: "Golden Hour",        artist: "Meridian Days",  duration: "3:58", emoji: "🌅", color: "bg-amber-900/60 text-amber-300" },
  { id: 18, name: "Electric Rain",      artist: "Neon Static",    duration: "5:03", emoji: "⚡", color: "bg-blue-900/60 text-blue-300" },
  { id: 19, name: "Velvet Underground", artist: "Moss & Stone",   duration: "4:29", emoji: "🌿", color: "bg-emerald-900/60 text-emerald-300" },
  { id: 20, name: "City at 3am",        artist: "Sidewalk Ghost", duration: "3:17", emoji: "🌃", color: "bg-indigo-900/60 text-indigo-300" },
  { id: 21, name: "Desert Song",        artist: "Dune Drift",     duration: "4:52", emoji: "🏜️", color: "bg-orange-900/60 text-orange-300" },
  { id: 22, name: "Midnight Bloom",     artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 23, name: "Coastal Drive",      artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 24, name: "Golden Hour",        artist: "Meridian Days",  duration: "3:58", emoji: "🌅", color: "bg-amber-900/60 text-amber-300" },
  { id: 25, name: "Electric Rain",      artist: "Neon Static",    duration: "5:03", emoji: "⚡", color: "bg-blue-900/60 text-blue-300" },
  { id: 26, name: "Velvet Underground", artist: "Moss & Stone",   duration: "4:29", emoji: "🌿", color: "bg-emerald-900/60 text-emerald-300" },
  { id: 27, name: "City at 3am",        artist: "Sidewalk Ghost", duration: "3:17", emoji: "🌃", color: "bg-indigo-900/60 text-indigo-300" },
  { id: 28, name: "Desert Song",        artist: "Dune Drift",     duration: "4:52", emoji: "🏜️", color: "bg-orange-900/60 text-orange-300" },
  { id: 29, name: "Midnight Bloom",     artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 30, name: "Coastal Drive",      artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
];

const ITEM_HEIGHT  = 64;
const SCROLL_ZONE  = 80;  // px from edge that triggers auto-scroll
const SCROLL_SPEED = 10;  // px per animation frame

const DragHandle = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"
    className="text-slate-600 group-hover:text-slate-400 transition-colors duration-150 flex-shrink-0">
    <circle cx="5"  cy="3"  r="1.3" /><circle cx="11" cy="3"  r="1.3" />
    <circle cx="5"  cy="8"  r="1.3" /><circle cx="11" cy="8"  r="1.3" />
    <circle cx="5"  cy="13" r="1.3" /><circle cx="11" cy="13" r="1.3" />
  </svg>
);

const NowPlayingBars = () => (
  <span className="flex items-end gap-[2px] h-3.5">
    {[0.6, 1, 0.75].map((h, i) => (
      <span key={i} className="w-[3px] bg-emerald-400 rounded-full"
        style={{ height: `${h * 100}%`, animation: `npulse 0.8s ease-in-out ${i * 0.18}s infinite alternate` }} />
    ))}
    <style>{`@keyframes npulse{from{transform:scaleY(0.35)}to{transform:scaleY(1)}}`}</style>
  </span>
);

interface TrackRowProps {
  track: Track;
  index: number;
  isPlaying: boolean;
  isDraggingAny: boolean;
  onPointerDown: (e: React.PointerEvent, index: number) => void;
  onClick: () => void;
}

function TrackRow({ track, index, isPlaying, isDraggingAny, onPointerDown, onClick }: TrackRowProps) {
  return (
    <div
      onPointerDown={(e) => onPointerDown(e, index)}
      onClick={onClick}
      className={[
        "group h-full flex items-center gap-3 px-3 rounded-xl cursor-grab active:cursor-grabbing",
        "transition-colors duration-150",
        isDraggingAny ? "" : isPlaying ? "bg-slate-800/70" : "hover:bg-slate-800/50",
      ].join(" ")}
    >
      <DragHandle />
      <div className="w-5 flex items-center justify-center flex-shrink-0">
        {isPlaying
          ? <NowPlayingBars />
          : <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">{index + 1}</span>
        }
      </div>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${track.color}`}>
        {track.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-colors duration-150 ${isPlaying ? "text-emerald-400" : "text-slate-200"}`}>
          {track.name}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{track.artist}</p>
      </div>
      <span className="text-xs text-slate-600 tabular-nums flex-shrink-0">{track.duration}</span>
    </div>
  );
}

export default function PlaylistDnD() {
  const [playlist, setPlaylist]     = useState<Track[]>(INITIAL_TRACKS);
  const [nowPlayingId, setNowPlayingId] = useState<number>(1);
  const [dragIdx, setDragIdx]       = useState<number | null>(null);
  const [ghostY, setGhostY]         = useState(0);
  const [hoverIdx, setHoverIdx]     = useState<number | null>(null);
useEffect(() => {

    console.log("playlist changed", playlist)
},[playlist])
  // DOM refs
  const scrollRef    = useRef<HTMLDivElement>(null); // the overflow-auto container
  const containerRef = useRef<HTMLDivElement>(null); // the absolute-positioned inner list

  // Mutable refs (no re-render needed)
  const dragIdxRef   = useRef<number | null>(null);
  const hoverIdxRef  = useRef<number | null>(null);
  const startYRef    = useRef(0);      // pageY at drag start
  const startTopRef  = useRef(0);      // item's offsetTop at drag start
  const pageYRef     = useRef(0);      // latest pageY (kept for scroll loop)
  const rafRef       = useRef(0);      // move RAF id
  const scrollRafRef = useRef(0);      // auto-scroll RAF id
  const didMoveRef   = useRef(false);

  // ─── Auto-scroll loop ────────────────────────────────────────────────────────
  // Runs independently so scrolling continues even when the pointer isn't moving.
  const autoScrollLoop = useCallback(() => {
    const scroller = scrollRef.current;
    if (!scroller || dragIdxRef.current === null) return;

    const { top: sTop, bottom: sBottom, height: sHeight } = scroller.getBoundingClientRect();
    const cursorY = pageYRef.current - window.scrollY; // convert pageY → clientY

    let delta = 0;
    if (cursorY < sTop + SCROLL_ZONE) {
      // Near top edge — scroll up, faster the closer to the edge
      const ratio = 1 - (cursorY - sTop) / SCROLL_ZONE;
      delta = -SCROLL_SPEED * Math.max(0.2, ratio);
    } else if (cursorY > sBottom - SCROLL_ZONE) {
      // Near bottom edge — scroll down
      const ratio = 1 - (sBottom - cursorY) / SCROLL_ZONE;
      delta = SCROLL_SPEED * Math.max(0.2, ratio);
    }

    if (delta !== 0) {
      scroller.scrollTop += delta;

      // After scrolling, recalculate ghost & hover based on the new scrollTop
      const scrollTop  = scroller.scrollTop;
      const rawTop     = startTopRef.current + (pageYRef.current - startYRef.current);
      // ghostY is relative to the inner container, not the viewport
      // Re-derive it from current pageY + scroll offset change
      const newGhostY  = Math.max(0, Math.min(
        rawTop + (scrollTop - (startTopRef.current - dragIdxRef.current! * ITEM_HEIGHT + scrollTop)),
        (INITIAL_TRACKS.length - 1) * ITEM_HEIGHT
      ));

      // Simpler: just clamp ghost to scrollTop-based visible range isn't needed —
      // ghost top is already in container-space, just keep updating it from pageY delta.
      const ghostTop = Math.max(0, Math.min(
        startTopRef.current + (pageYRef.current - startYRef.current) + (scroller.scrollTop - startScrollRef.current),
        (playlist.length - 1) * ITEM_HEIGHT
      ));

      setGhostY(ghostTop);

      const ghostCenter = ghostTop + ITEM_HEIGHT / 2;
      const over = Math.max(0, Math.min(
        playlist.length - 1,
        Math.floor(ghostCenter / ITEM_HEIGHT)
      ));
      if (over !== hoverIdxRef.current) {
        hoverIdxRef.current = over;
        setHoverIdx(over);
      }
    }

    scrollRafRef.current = requestAnimationFrame(autoScrollLoop);
  }, [playlist.length]);

  const startScrollRef = useRef(0); // scrollTop at drag start

  const stopAutoScroll = () => cancelAnimationFrame(scrollRafRef.current);
  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    scrollRafRef.current = requestAnimationFrame(autoScrollLoop);
  }, [autoScrollLoop]);

  // ─── Pointer handlers ────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent, index: number) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    e.currentTarget.setPointerCapture(e.pointerId);

    const scrollTop = scrollRef.current?.scrollTop ?? 0;

    dragIdxRef.current  = index;
    hoverIdxRef.current = index;
    startYRef.current   = e.pageY;
    startTopRef.current = index * ITEM_HEIGHT;
    startScrollRef.current = scrollTop;
    pageYRef.current    = e.pageY;
    didMoveRef.current  = false;

    setDragIdx(index);
    setHoverIdx(index);
    setGhostY(index * ITEM_HEIGHT);
    startAutoScroll();
  }, [startAutoScroll]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (dragIdxRef.current === null) return;
    didMoveRef.current = true;
    pageYRef.current = e.pageY;

    const scrollTop   = scrollRef.current?.scrollTop ?? 0;
    const scrollDelta = scrollTop - startScrollRef.current;

    const rawTop     = startTopRef.current + (e.pageY - startYRef.current) + scrollDelta;
    const clampedTop = Math.max(0, Math.min(rawTop, (playlist.length - 1) * ITEM_HEIGHT));

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setGhostY(clampedTop);

      const ghostCenter = clampedTop + ITEM_HEIGHT / 2;
      const over = Math.max(0, Math.min(
        playlist.length - 1,
        Math.floor(ghostCenter / ITEM_HEIGHT)
      ));
      if (over !== hoverIdxRef.current) {
        hoverIdxRef.current = over;
        setHoverIdx(over);
      }
    });
  }, [playlist.length]);

  const onPointerUp = useCallback(() => {
    if (dragIdxRef.current === null) return;
    stopAutoScroll();
    cancelAnimationFrame(rafRef.current);

    const from = dragIdxRef.current;
    const to   = hoverIdxRef.current ?? from;

    if (didMoveRef.current && from !== to) {
      setPlaylist(prev => {
        const next = [...prev];
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    }

    dragIdxRef.current  = null;
    hoverIdxRef.current = null;
    didMoveRef.current  = false;
    setDragIdx(null);
    setHoverIdx(null);
  }, []);

  // ─── Shift calculation ───────────────────────────────────────────────────────
  const getShift = (index: number): number => {
    if (dragIdx === null || hoverIdx === null || index === dragIdx) return 0;
    if (dragIdx < hoverIdx) {
      if (index > dragIdx && index <= hoverIdx) return -ITEM_HEIGHT;
    } else {
      if (index >= hoverIdx && index < dragIdx) return ITEM_HEIGHT;
    }
    return 0;
  };

  const isDragging = dragIdx !== null;

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md select-none">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-1">Your Queue</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Playlist</h1>
          <p className="text-xs text-slate-600 mt-1">{playlist.length} songs</p>
        </div>

        {/* Scrollable viewport */}
        <div
          ref={scrollRef}
          className="h-[500px] overflow-y-auto rounded-xl"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Inner absolutely-positioned list */}
          <div
            ref={containerRef}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            className="relative"
            style={{ height: playlist.length * ITEM_HEIGHT }}
          >
            {playlist.map((track, index) => {
              const shift   = getShift(index);
              const isGhost = index === dragIdx;

              return (
                <div
                  key={track.id}
                  style={{
                    position: "absolute",
                    top: index * ITEM_HEIGHT,
                    left: 0,
                    right: 0,
                    height: ITEM_HEIGHT,
                    transform: isGhost ? "none" : `translateY(${shift}px)`,
                    transition: isGhost ? "none" : "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
                    opacity: isGhost ? 0 : 1,
                    zIndex: 1,
                    pointerEvents: isGhost ? "none" : "auto",
                  }}
                >
                  <TrackRow
                    track={track}
                    index={index}
                    isPlaying={track.id === nowPlayingId}
                    isDraggingAny={isDragging}
                    onPointerDown={onPointerDown}
                    onClick={() => !isDragging && setNowPlayingId(track.id)}
                  />
                </div>
              );
            })}

            {/* Floating ghost — position is in container-space */}
            {dragIdx !== null && (
              <div
                style={{
                  position: "absolute",
                  top: ghostY,
                  left: 0,
                  right: 0,
                  height: ITEM_HEIGHT,
                  zIndex: 50,
                  pointerEvents: "none",
                }}
              >
                <div className="h-full flex items-center gap-3 px-3 rounded-xl
                  bg-slate-700 ring-1 ring-white/10 shadow-2xl shadow-black/60"
                  style={{ transform: "scale(1.03)", opacity: 0.97 }}>
                  <DragHandle />
                  <div className="w-5 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-slate-400">{(hoverIdx ?? dragIdx) + 1}</span>
                  </div>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${playlist[dragIdx].color}`}>
                    {playlist[dragIdx].emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{playlist[dragIdx].name}</p>
                    <p className="text-xs text-slate-400 truncate">{playlist[dragIdx].artist}</p>
                  </div>
                  <span className="text-xs text-slate-500 tabular-nums flex-shrink-0">{playlist[dragIdx].duration}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-4">
          Drag to reorder · Click to play
        </p>
      </div>
    </div>
  );
}