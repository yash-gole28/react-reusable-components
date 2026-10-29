// shared/components/SmartRenderBoundary/SmartRenderBoundary.tsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
} from "react";

// ─────────────────────────────────────────────────────────────
// Shared Observer
// ─────────────────────────────────────────────────────────────

type VisibilityCallback = (
  isVisible: boolean
) => void;

const listeners = new Map<
  Element,
  VisibilityCallback
>();

const sharedObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            listeners
              .get(entry.target)
              ?.(
                entry.isIntersecting
              );
          });
        },
        {
          rootMargin: "300px",
          threshold: 0.01,
        }
      )
    : null;

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type SmartRenderMode =
  | "destroy"
  | "keep-alive"
  | "freeze";

interface SmartRenderBoundaryProps {
  children: ReactNode;

  mode?: SmartRenderMode;

  rootMargin?: string;

  unmountDelay?: number;

  placeholderHeight?: number | string;

  className?: string;

  style?: CSSProperties;

  onVisibilityChange?: (
    visible: boolean
  ) => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function SmartRenderBoundary({
  children,

  mode = "destroy",

  rootMargin = "300px",

  unmountDelay = 300,

  placeholderHeight = 0,

  className = "",

  style,

  onVisibilityChange,
}: SmartRenderBoundaryProps) {
  // ─────────────────────────────────────────────────────────────
  // Refs
  // ─────────────────────────────────────────────────────────────

  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const timeoutRef =
    useRef<number | null>(null);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────

  const [isVisible, setIsVisible] =
    useState(false);

  const [hasMounted, setHasMounted] =
    useState(false);

  const [shouldRender, setShouldRender] =
    useState(
      mode === "keep-alive"
    );

  // ─────────────────────────────────────────────────────────────
  // Observe Visibility
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (
      typeof window ===
      "undefined"
    )
      return;

    const element =
      containerRef.current;

    if (!element) return;

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              const visible =
                entry.isIntersecting;

              setIsVisible(
                visible
              );

              onVisibilityChange?.(
                visible
              );

              // ───────────────────────
              // ENTER VIEWPORT
              // ───────────────────────

              if (visible) {
                if (
                  timeoutRef.current
                ) {
                  clearTimeout(
                    timeoutRef.current
                  );
                }

                setShouldRender(
                  true
                );

                setHasMounted(
                  true
                );
              }

              // ───────────────────────
              // EXIT VIEWPORT
              // ───────────────────────

              else {
                // DESTROY MODE
                if (
                  mode ===
                  "destroy"
                ) {
                  timeoutRef.current =
                    window.setTimeout(
                      () => {
                        setShouldRender(
                          false
                        );
                      },
                      unmountDelay
                    );
                }

                // FREEZE MODE
                else if (
                  mode ===
                  "freeze"
                ) {
                  // keep mounted
                }

                // KEEP ALIVE
                else if (
                  mode ===
                  "keep-alive"
                ) {
                  // keep mounted forever
                }
              }
            }
          );
        },
        {
          rootMargin,
          threshold: 0.01,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );
      }
    };
  }, [
    mode,
    rootMargin,
    unmountDelay,
    onVisibilityChange,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Freeze Mode
  // ─────────────────────────────────────────────────────────────

  const frozenStyle =
    useMemo(() => {
      if (
        mode !== "freeze"
      )
        return {};

      return {
        visibility:
          isVisible
            ? "visible"
            : "hidden",

        pointerEvents:
          isVisible
            ? "auto"
            : "none",
      } as CSSProperties;
    }, [
      mode,
      isVisible,
    ]);

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        minHeight:
          placeholderHeight,
        ...style,
      }}
    >
      {shouldRender ||
      (mode ===
        "freeze" &&
        hasMounted) ? (
        <div
          style={
            frozenStyle
          }
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}