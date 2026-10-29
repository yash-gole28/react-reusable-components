// features/SmartRenderBoundary/pages/SmartRenderBoundaryDemoPage.tsx

import { useEffect, useState } from "react";
import { SmartRenderBoundary } from "../components/SmartRenderBoundary";


// ─────────────────────────────────────────────────────────────
// Fake Heavy Chart
// ─────────────────────────────────────────────────────────────

function HeavyChart() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("📈 Chart Mounted");

    const interval = setInterval(() => {
      setCount((prev) => prev + 1);
    }, 1000);

    return () => {
      console.log("❌ Chart Unmounted");

      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-[400px] rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-700 p-8 text-white">
      <h2 className="text-3xl font-bold">
        Heavy Chart
      </h2>

      <p className="mt-4 text-lg">
        Updates every second:
      </p>

      <div className="mt-6 text-6xl font-black">
        {count}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Video Mock
// ─────────────────────────────────────────────────────────────

function VideoMock() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    console.log("🎥 Video Mounted");

    const interval = setInterval(() => {
      setFrame((prev) => prev + 1);
    }, 120);

    return () => {
      console.log("❌ Video Unmounted");

      clearInterval(interval);
    };
  }, []);

  return (
    <div className="h-[300px] rounded-3xl bg-slate-900 border border-slate-700 p-8 text-white">
      <h2 className="text-3xl font-bold">
        Freeze Mode Video
      </h2>

      <div className="mt-10 flex gap-2">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="w-3 rounded-full bg-emerald-400 transition-all duration-75"
            style={{
              height:
                i === frame % 25
                  ? 120
                  : 30,
            }}
          />
        ))}
      </div>

      <p className="mt-8 text-slate-400">
        Component remains mounted while offscreen.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Lazy Editor
// ─────────────────────────────────────────────────────────────

function HeavyEditor() {
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("📝 Editor Mounted");

    return () => {
      console.log("❌ Editor Unmounted");
    };
  }, []);

  return (
    <div className="rounded-3xl bg-slate-900 border border-slate-700 p-8">
      <h2 className="text-3xl font-bold text-white">
        Keep Alive Editor
      </h2>

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Type something..."
        className="mt-6 w-full h-52 rounded-2xl bg-slate-800 border border-slate-700 p-4 text-white outline-none resize-none"
      />

      <p className="mt-4 text-slate-500">
        Scroll away and back → state persists
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Heavy Cards
// ─────────────────────────────────────────────────────────────

function HeavyCard({
  index,
}: {
  index: number;
}) {
  useEffect(() => {
    console.log(
      `🔥 Card ${index} Mounted`
    );

    return () => {
      console.log(
        `❌ Card ${index} Unmounted`
      );
    };
  }, [index]);

  return (
    <div className="h-60 rounded-3xl bg-slate-900 border border-slate-700 p-6 text-white">
      <div className="text-5xl font-black text-blue-500">
        {index}
      </div>

      <h3 className="mt-4 text-xl font-bold">
        Smart Render Card
      </h3>

      <p className="mt-2 text-slate-400">
        This component mounts only when near viewport.
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────

export default function SmartRenderBoundaryDemoPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero */}
      <section className="h-screen flex flex-col items-center justify-center px-6">
        <h1 className="text-6xl font-black text-white text-center">
          Smart Render Boundary
        </h1>

        <p className="mt-6 text-xl text-slate-500 text-center max-w-2xl">
          Viewport-based rendering infrastructure for
          optimizing expensive React components.
        </p>

        <div className="mt-8 text-slate-600 text-sm">
          Open console to see mount/unmount behavior
        </div>
      </section>

      {/* Destroy Mode */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white">
            Destroy Mode
          </h2>

          <p className="mt-4 text-slate-500">
            Unmounts component when out of viewport.
          </p>
        </div>

        <SmartRenderBoundary
          mode="destroy"
          placeholderHeight={400}
          unmountDelay={1000}
        >
          <HeavyChart />
        </SmartRenderBoundary>
      </section>

      {/* Freeze Mode */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white">
            Freeze Mode
          </h2>

          <p className="mt-4 text-slate-500">
            Keeps mounted but hides when invisible.
          </p>
        </div>

        <SmartRenderBoundary
          mode="freeze"
          placeholderHeight={300}
        >
          <VideoMock />
        </SmartRenderBoundary>
      </section>

      {/* Keep Alive */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-white">
            Keep Alive Mode
          </h2>

          <p className="mt-4 text-slate-500">
            Mounts once and never unmounts.
          </p>
        </div>

        <SmartRenderBoundary
          mode="keep-alive"
          placeholderHeight={400}
        >
          <HeavyEditor />
        </SmartRenderBoundary>
      </section>

      {/* Grid Example */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white">
            Virtualized-Style Grid
          </h2>

          <p className="mt-4 text-slate-500">
            Only nearby cards exist in DOM.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from(
            { length: 40 },
            (_, i) => i + 1
          ).map((item) => (
            <SmartRenderBoundary
              key={item}
              mode="destroy"
              placeholderHeight={240}
              unmountDelay={500}
            >
              <HeavyCard index={item} />
            </SmartRenderBoundary>
          ))}
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-[40vh]" />
    </div>
  );
}