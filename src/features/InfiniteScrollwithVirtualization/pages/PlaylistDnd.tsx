import { useState } from "react";
import { DraggableList, DragHandle,type RenderItemParams } from "../../dragAndDropList/components/DraggableListReusableContainer";

interface Track {
  id: number;
  name: string;
  artist: string;
  duration: string;
  emoji: string;
  color: string;
}

const INITIAL_TRACKS: Track[] = [
  { id: 1,  name: "Midnight Bloom",       artist: "Luna Echo",      duration: "3:42", emoji: "🌙", color: "bg-violet-900/60 text-violet-300" },
  { id: 2,  name: "Coastal Drive",        artist: "The Wavefront",  duration: "4:11", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 3,  name: "Golden Hour",          artist: "Meridian Days",  duration: "3:58", emoji: "🌅", color: "bg-amber-900/60 text-amber-300" },
  { id: 4,  name: "Electric Rain",        artist: "Neon Static",    duration: "5:03", emoji: "⚡", color: "bg-blue-900/60 text-blue-300" },
  { id: 5,  name: "Velvet Underground",   artist: "Moss & Stone",   duration: "4:29", emoji: "🌿", color: "bg-emerald-900/60 text-emerald-300" },
  { id: 6,  name: "City at 3am",          artist: "Sidewalk Ghost", duration: "3:17", emoji: "🌃", color: "bg-indigo-900/60 text-indigo-300" },
  { id: 7,  name: "Desert Song",          artist: "Dune Drift",     duration: "4:52", emoji: "🏜️", color: "bg-orange-900/60 text-orange-300" },
  { id: 8,  name: "Neon Cathedral",       artist: "Glass Animals",  duration: "3:55", emoji: "🏙️", color: "bg-pink-900/60 text-pink-300" },
  { id: 9,  name: "Solar Winds",          artist: "Tycho",          duration: "5:21", emoji: "☀️", color: "bg-yellow-900/60 text-yellow-300" },
  { id: 10, name: "Pale Blue Dot",        artist: "Hammock",        duration: "6:04", emoji: "🌍", color: "bg-teal-900/60 text-teal-300" },
  { id: 11, name: "Cassette Dreams",      artist: "Washed Out",     duration: "3:38", emoji: "📼", color: "bg-rose-900/60 text-rose-300" },
  { id: 12, name: "Four AM",              artist: "Caribou",        duration: "4:17", emoji: "🌌", color: "bg-sky-900/60 text-sky-300" },
  { id: 13, name: "Rewild",               artist: "Jon Hopkins",    duration: "5:48", emoji: "🌲", color: "bg-lime-900/60 text-lime-300" },
  { id: 14, name: "Breathing Underwater", artist: "Metric",         duration: "4:01", emoji: "🌊", color: "bg-cyan-900/60 text-cyan-300" },
  { id: 15, name: "Holocene",             artist: "Bon Iver",       duration: "5:37", emoji: "❄️", color: "bg-slate-700/60 text-slate-300" },
];

const NowPlayingBars = () => (
  <span className="flex items-end gap-[2px] h-3.5">
    {[0.6, 1, 0.75].map((h, i) => (
      <span key={i} className="w-[3px] bg-emerald-400 rounded-full"
        style={{ height: `${h * 100}%`, animation: `npulse 0.8s ease-in-out ${i * 0.18}s infinite alternate` }} />
    ))}
    <style>{`@keyframes npulse{from{transform:scaleY(0.35)}to{transform:scaleY(1)}}`}</style>
  </span>
);

function TrackRow({
  item: track,
  index,
  isDragging,
  isDraggingAny,
  dragHandleProps,
  isPlaying,
  onPlay,
}: RenderItemParams<Track> & { isPlaying?: boolean; onPlay: (id: number) => void }) {
  return (
    <div
      // Only the NON-dragging row responds to clicks — ghost has pointerEvents:none anyway
      onClick={() => !isDraggingAny && onPlay(track.id)}
      className={[
        "group h-full flex items-center gap-3 px-3 rounded-xl transition-all duration-150",
        isDragging
          ? "bg-slate-700 ring-1 ring-white/10 shadow-2xl shadow-black/60 scale-[1.03] opacity-[0.97]"
          : isDraggingAny
          ? ""
          : isPlaying
          ? "bg-slate-800/70 cursor-pointer"
          : "hover:bg-slate-800/50 cursor-pointer",
      ].join(" ")}
    >
      {/* ← Only this element starts a drag */}
      <DragHandle
        dragHandleProps={dragHandleProps}
        className="text-slate-600 group-hover:text-slate-400 transition-colors"
      />

      <div className="w-5 flex items-center justify-center flex-shrink-0">
        {isPlaying && !isDragging
          ? <NowPlayingBars />
          : <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors tabular-nums">
              {index + 1}
            </span>
        }
      </div>

      <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${track.color}`}>
        {track.emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate transition-colors duration-150
          ${isDragging ? "text-white" : isPlaying ? "text-emerald-400" : "text-slate-200"}`}>
          {track.name}
        </p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{track.artist}</p>
      </div>

      <span className="text-xs text-slate-600 tabular-nums flex-shrink-0">{track.duration}</span>
    </div>
  );
}

export default function PlaylistPage() {
  const [tracks, setTracks] = useState<Track[]>(INITIAL_TRACKS);
  const [nowPlayingId, setNowPlayingId] = useState<number>(1);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600 mb-1">Your Queue</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Playlist</h1>
          <p className="text-xs text-slate-600 mt-1">{tracks.length} songs</p>
        </div>

        <DraggableList<Track>
          items={tracks}
          onReorder={setTracks}
          itemHeight={64}
          height={500}
          className="rounded-xl border border-blue-500"
          renderItem={(params) => (
            <TrackRow
              {...params}
              isPlaying={params.item.id === nowPlayingId}
              onPlay={setNowPlayingId}
            />
          )}
        />

        {/* <p className="text-center text-[11px] text-slate-700 mt-4">
          Drag handle to reorder · Click row to play
        </p> */}
      </div>
    </div>
  );
}