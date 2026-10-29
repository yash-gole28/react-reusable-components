// shared/components/ScrollMotion/ScrollMotion.tsx

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

// ─────────────────────────────────────────────────────────────
// Shared Observer
// ─────────────────────────────────────────────────────────────

type ObserverCallback = (
  entry: IntersectionObserverEntry
) => void;

const listeners = new Map<
  Element,
  ObserverCallback
>();

const sharedObserver =
  typeof window !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            listeners
              .get(entry.target)
              ?.(
                entry
              );
          });
        },
        {
          threshold: buildThresholdList(),
        }
      )
    : null;

function buildThresholdList() {
  const thresholds: number[] = [];

  for (let i = 0; i <= 1; i += 0.01) {
    thresholds.push(i);
  }

  return thresholds;
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ScrollMotionEffect =
  | "fade"
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "scale"
  | "blur";

interface ScrollMotionProps {
  children: ReactNode;

  effect?: ScrollMotionEffect;

  duration?: number;
  delay?: number;

  distance?: number;
  scale?: number;
  blur?: number;

  threshold?: number;

  once?: boolean;

  easing?: string;

  className?: string;

  style?: CSSProperties;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function ScrollMotion({
  children,

  effect = "fade-up",

  duration = 700,
  delay = 0,

  distance = 40,
  scale = 0.92,
  blur = 10,

  threshold = 0.15,

  once = true,

  easing = "cubic-bezier(0.22, 1, 0.36, 1)",

  className = "",

  style,
}: ScrollMotionProps) {
  // ─────────────────────────────────────────────────────────────
  // Refs
  // ─────────────────────────────────────────────────────────────

  const elementRef =
    useRef<HTMLDivElement | null>(null);

  // ─────────────────────────────────────────────────────────────
  // State
  // ─────────────────────────────────────────────────────────────

  const [visibleRatio, setVisibleRatio] =
    useState(0);

  const [hasAnimated, setHasAnimated] =
    useState(false);

  // ─────────────────────────────────────────────────────────────
  // Observe
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!sharedObserver) return;

    const element = elementRef.current;

    if (!element) return;

    const callback: ObserverCallback = (
      entry
    ) => {
      const ratio =
        entry.intersectionRatio;

      if (
        once &&
        hasAnimated
      ) {
        return;
      }

      setVisibleRatio(ratio);

      if (ratio >= threshold) {
        setHasAnimated(true);
      }
    };

    listeners.set(element, callback);

    sharedObserver.observe(element);

    return () => {
      listeners.delete(element);

      sharedObserver.unobserve(element);
    };
  }, [
    threshold,
    once,
    hasAnimated,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Progress
  // ─────────────────────────────────────────────────────────────

  const progress = useMemo(() => {
    if (
      once &&
      hasAnimated
    ) {
      return 1;
    }

    return Math.min(
      Math.max(
        visibleRatio / threshold,
        0
      ),
      1
    );
  }, [
    visibleRatio,
    threshold,
    once,
    hasAnimated,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Transform Builder
  // ─────────────────────────────────────────────────────────────

  const transform =
    useMemo(() => {
      const transforms: string[] = [];

      switch (effect) {
        case "fade-up":
          transforms.push(
            `translate3d(0, ${
              (1 - progress) *
              distance
            }px, 0)`
          );
          break;

        case "fade-down":
          transforms.push(
            `translate3d(0, -${
              (1 - progress) *
              distance
            }px, 0)`
          );
          break;

        case "fade-left":
          transforms.push(
            `translate3d(${
              (1 - progress) *
              distance
            }px, 0, 0)`
          );
          break;

        case "fade-right":
          transforms.push(
            `translate3d(-${
              (1 - progress) *
              distance
            }px, 0, 0)`
          );
          break;

        case "scale":
          transforms.push(
            `scale(${
              scale +
              (1 - scale) *
                progress
            })`
          );
          break;
      }

      return transforms.join(" ");
    }, [
      effect,
      progress,
      distance,
      scale,
    ]);

  // ─────────────────────────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────────────────────────

  const computedStyle: CSSProperties = {
    opacity:
      effect === "fade" ||
      effect.startsWith("fade")
        ? progress
        : 1,

    transform,

    filter:
      effect === "blur"
        ? `blur(${
            (1 - progress) *
            blur
          }px)`
        : undefined,

    transition: `
      transform ${duration}ms ${easing} ${delay}ms,
      opacity ${duration}ms ${easing} ${delay}ms,
      filter ${duration}ms ${easing} ${delay}ms
    `,

    willChange:
      "transform, opacity, filter",

    backfaceVisibility: "hidden",

    ...style,
  };

  // ─────────────────────────────────────────────────────────────
  // Reduced Motion
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    if (mediaQuery.matches) {
      setHasAnimated(true);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={elementRef}
      className={className}
      style={computedStyle}
    >
      {children}
    </div>
  );
}