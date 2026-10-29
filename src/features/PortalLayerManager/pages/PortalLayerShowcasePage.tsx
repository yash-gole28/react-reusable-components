import { useState } from "react";
import { Portal } from "./../components/Portal";

// ─────────────────────────────────────────────────────────────
// Demo Page
// ─────────────────────────────────────────────────────────────

export default function PortalLayerShowcasePage() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [nestedParentOpen, setNestedParentOpen] = useState(false);
  const [nestedChildOpen, setNestedChildOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 px-8 py-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">
          Reusable Infrastructure Component
        </p>

        <h1 className="text-4xl text-white font-bold tracking-tight">
          Portal Layer Manager Showcase
        </h1>

        <p className="text-slate-400 mt-3 max-w-3xl">
          Reusable portal system handling overlays, modals, drawers,
          nested layers, outside clicks, escape handling, body scroll lock,
          and automatic z-index stacking.
        </p>
      </div>

      {/* Demo Grid */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Basic Modal */}
        <DemoCard
          title="Basic Modal"
          description="Simple reusable modal using Portal component."
        >
          <button
            onClick={() => setBasicModalOpen(true)}
            className="demo-btn"
          >
            Open Modal
          </button>
        </DemoCard>

        {/* Nested Modal */}
        <DemoCard
          title="Nested Modals"
          description="Tests automatic z-index stacking."
        >
          <button
            onClick={() => setNestedParentOpen(true)}
            className="demo-btn"
          >
            Open Nested Flow
          </button>
        </DemoCard>

        {/* Drawer */}
        <DemoCard
          title="Right Drawer"
          description="Slide panel rendered through portal."
        >
          <button
            onClick={() => setDrawerOpen(true)}
            className="demo-btn"
          >
            Open Drawer
          </button>
        </DemoCard>

        {/* Image Preview */}
        <DemoCard
          title="Image Lightbox"
          description="Image preview overlay rendered above app."
        >
          <button
            onClick={() => setImagePreviewOpen(true)}
            className="demo-btn"
          >
            Preview Image
          </button>
        </DemoCard>

        {/* Scroll Lock */}
        <DemoCard
          title="Scroll Lock"
          description="Open modal and try scrolling background."
        >
          <button
            onClick={() => setBasicModalOpen(true)}
            className="demo-btn"
          >
            Test Scroll Lock
          </button>
        </DemoCard>

        {/* Escape Handling */}
        <DemoCard
          title="Escape Handling"
          description="Press ESC to close overlays."
        >
          <button
            onClick={() => setBasicModalOpen(true)}
            className="demo-btn"
          >
            Test ESC Close
          </button>
        </DemoCard>
      </div>

      {/* Fake Content for Scroll Testing */}
      <div className="px-8 pb-20">
        <h2 className="text-2xl text-white font-bold mb-5">
          Scroll Test Area
        </h2>

        <div className="space-y-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="
                h-28
                rounded-2xl
                bg-slate-900
                border
                border-slate-800
                flex
                items-center
                px-6
                text-slate-400
              "
            >
              Background Content Card #{i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────── */}
      {/* Basic Modal */}
      {/* ───────────────────────────────────────────── */}

      <Portal
        isOpen={basicModalOpen}
        onClose={() => setBasicModalOpen(false)}
      >
        <div
          className="
            w-[420px]
            rounded-3xl
            bg-slate-900
            border
            border-slate-800
            p-6
            shadow-2xl
          "
        >
          <div className="mb-5">
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-2">
              Modal Example
            </p>

            <h2 className="text-2xl font-bold text-white">
              Delete Project
            </h2>
          </div>

          <p className="text-slate-400 leading-relaxed">
            This modal demonstrates outside click handling,
            body scroll locking, escape key support,
            and automatic portal rendering.
          </p>

          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={() => setBasicModalOpen(false)}
              className="
                px-4 py-2 rounded-xl
                border border-slate-700
                hover:bg-slate-800 text-white
              "
            >
              Cancel
            </button>

            <button
              className="
                px-4 py-2 rounded-xl
                bg-red-500
                hover:bg-red-400
              "
            >
              Delete
            </button>
          </div>
        </div>
      </Portal>

      {/* ───────────────────────────────────────────── */}
      {/* Nested Parent Modal */}
      {/* ───────────────────────────────────────────── */}

      <Portal
        isOpen={nestedParentOpen}
        onClose={() => setNestedParentOpen(false)}
      >
        <div
          className="
            w-[500px]
            rounded-3xl
            bg-slate-900
            border border-slate-800
            p-6
          "
        >
          <h2 className="text-2xl font-bold text-white mb-3">
            Parent Modal
          </h2>

          <p className="text-white mb-6">
            Open another modal above this one.
            Z-index is handled automatically.
          </p>

          <button
            onClick={() => setNestedChildOpen(true)}
            className="
              px-4 py-2 rounded-xl
              bg-blue-500
              hover:bg-blue-400
            "
          >
            Open Child Modal
          </button>
        </div>
      </Portal>

      {/* ───────────────────────────────────────────── */}
      {/* Nested Child Modal */}
      {/* ───────────────────────────────────────────── */}

      <Portal
        isOpen={nestedChildOpen}
        onClose={() => setNestedChildOpen(false)}
      >
        <div
          className="
            w-[380px]
            rounded-3xl
            bg-slate-800
            border border-slate-700
            p-6
          "
        >
          <h2 className="text-xl text-white font-bold mb-3">
            Child Modal
          </h2>

          <p className="text-slate-400 mb-6">
            This modal appears above the parent automatically.
          </p>

          <button
            onClick={() => setNestedChildOpen(false)}
            className="
              px-4 py-2 rounded-xl
              bg-white text-slate-900
            "
          >
            Close
          </button>
        </div>
      </Portal>

      {/* ───────────────────────────────────────────── */}
      {/* Drawer */}
      {/* ───────────────────────────────────────────── */}

      <Portal
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <div
          className="
            fixed right-0 top-0
            h-screen w-[420px]
            bg-slate-900
            border-l border-slate-800
            p-6
            overflow-auto
          "
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">
              Notifications
            </h2>

            <button
              onClick={() => setDrawerOpen(false)}
              className="
                w-10 h-10 rounded-xl
                hover:bg-slate-800
              "
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="
                  p-4 rounded-2xl
                  bg-slate-800
                  border border-slate-700
                "
              >
                <p className="font-medium">
                  Notification #{i + 1}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  This is a reusable drawer rendered using the portal layer system.
                </p>
              </div>
            ))}
          </div>
        </div>
      </Portal>

      {/* ───────────────────────────────────────────── */}
      {/* Image Preview */}
      {/* ───────────────────────────────────────────── */}

      <Portal
        isOpen={imagePreviewOpen}
        onClose={() => setImagePreviewOpen(false)}
      >
        <div className="max-w-4xl p-6">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
            alt="Preview"
            className="
              rounded-3xl
              max-h-[85vh]
              object-cover
              shadow-2xl
            "
          />
        </div>
      </Portal>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Demo Card
// ─────────────────────────────────────────────────────────────

interface DemoCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function DemoCard({
  title,
  description,
  children,
}: DemoCardProps) {
  return (
    <div
      className="
        rounded-3xl
        border border-slate-800
        bg-slate-900
        p-6
      "
    >
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>

      <p className="text-slate-400 text-sm leading-relaxed mb-6">
        {description}
      </p>

      {children}
    </div>
  );
}