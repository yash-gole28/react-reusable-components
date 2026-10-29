// shared/components/PortalLayerManager/Portal.tsx

import {
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ─────────────────────────────────────────────────────────────
// Global Layer Counter
// Handles stacking order automatically
// ─────────────────────────────────────────────────────────────

let layerCounter = 1000;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface PortalProps {
  children: ReactNode;
  isOpen?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsideClick?: boolean;
  lockScroll?: boolean;
  onClose?: () => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────
// Portal Component
// ─────────────────────────────────────────────────────────────

export function Portal({
  children,
  isOpen = true,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  lockScroll = true,
  onClose,
  className = "",
}: PortalProps) {
  const [mounted, setMounted] = useState(false);
  const [zIndex] = useState(() => ++layerCounter);

  const contentRef = useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Mount Safety
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Body Scroll Lock
  // ─────────────────────────────────────────────────────────────

  let scrollLockCount = 0;

useEffect(() => {
  if (!isOpen || !lockScroll) return;

  scrollLockCount++;

  if (scrollLockCount === 1) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    scrollLockCount--;

    if (scrollLockCount <= 0) {
      document.body.style.overflow = "";
      scrollLockCount = 0;
    }
  };
}, [isOpen, lockScroll]);

  // ─────────────────────────────────────────────────────────────
  // Escape Key Handling
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  // ─────────────────────────────────────────────────────────────
  // Outside Click
  // ─────────────────────────────────────────────────────────────

  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!closeOnOutsideClick) return;

    if (e.target === e.currentTarget) {
      onClose?.();
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Guard
  // ─────────────────────────────────────────────────────────────

  if (!mounted || !isOpen) return null;

  // ─────────────────────────────────────────────────────────────
  // Render Portal
  // ─────────────────────────────────────────────────────────────

  return createPortal(
    <div
      onClick={handleBackdropClick}
      className={`
        fixed inset-0
        flex items-center justify-center
        bg-black/50
        backdrop-blur-sm
        ${className}
      `}
      style={{
        zIndex,
      }}
    >
      <div
        ref={contentRef}
        className="
          relative
          max-h-[90vh]
          overflow-auto
        "
      >
        {children}
      </div>
    </div>,
    document.body
  );
}