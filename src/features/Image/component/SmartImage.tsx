// shared/components/SmartImage/SmartImage.tsx

import React, {
  type CSSProperties,
  type ImgHTMLAttributes,
  memo,
  useEffect,
  useRef,
  useState,
} from "react";

// ─────────────────────────────────────────────────────────────
// Shared Observer
// Single observer for ALL images
// ─────────────────────────────────────────────────────────────

const listeners = new WeakMap<Element, () => void>();

let sharedObserver: IntersectionObserver;

if (typeof window !== "undefined") {
  sharedObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          listeners.get(entry.target)?.();
          sharedObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "300px",
      threshold: 0.01,
    }
  );
}

// ─────────────────────────────────────────────────────────────
// Global Image Cache
// Prevent duplicate loading
// ─────────────────────────────────────────────────────────────

const loadedImageCache = new Set<string>();

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface SmartImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src: string;
  fallbackSrc?: string;
  aspectRatio?: string;
  lazy?: boolean;
  retryCount?: number;
  retryDelay?: number;
  objectFit?: CSSProperties["objectFit"];
  containerClassName?: string;
  skeleton?: React.ReactNode;
  showLoader?: boolean;
  freezeOnceVisible?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

function SmartImageComponent({
  src,
  alt = "",
  fallbackSrc,
  aspectRatio = "1 / 1",
  lazy = true,
  retryCount = 2,
  retryDelay = 800,
  objectFit = "cover",
  className = "",
  containerClassName = "",
  skeleton,
  showLoader = true,
  freezeOnceVisible = true,
  style,
  decoding = "async",
  loading = "lazy",
  draggable = false,
  ...props
}: SmartImageProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isVisible, setIsVisible] = useState(() => {
    if (!lazy) return true;
    return loadedImageCache.has(src);
  });

  const [isLoaded, setIsLoaded] = useState(() =>
    loadedImageCache.has(src)
  );

  const [hasError, setHasError] = useState(false);

  const [currentSrc, setCurrentSrc] = useState(() => {
    if (loadedImageCache.has(src)) return src;
    return "";
  });

  const retryRef = useRef(0);

  // ─────────────────────────────────────────────────────────────
  // Observe Visibility
  // ─────────────────────────────────────────────────────────────

useEffect(() => {
  if (!lazy || isVisible || !containerRef.current || !sharedObserver) {
    return;
  }

  const observer = sharedObserver;
  const el = containerRef.current;

  const onVisible = () => {
    setIsVisible(true);

    if (freezeOnceVisible) {
      listeners.delete(el);
    }
  };

  listeners.set(el, onVisible);

  observer.observe(el);

  return () => {
    listeners.delete(el);
    observer.unobserve(el);
  };
}, [lazy, isVisible, freezeOnceVisible]);

  // ─────────────────────────────────────────────────────────────
  // Image Loader
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isVisible) return;

    // Already Cached
    if (loadedImageCache.has(src)) {
      setCurrentSrc(src);
      setIsLoaded(true);
      return;
    }

    let cancelled = false;

    const loadImage = () => {
      const image = new Image();

      image.decoding = "async";
      image.src = src;

      image.onload = async () => {
        try {
          await image.decode?.();
        } catch {}

        if (cancelled) return;

        loadedImageCache.add(src);

        setCurrentSrc(src);
        setIsLoaded(true);
        setHasError(false);
      };

      image.onerror = () => {
        if (cancelled) return;

        // Retry Logic
        if (retryRef.current < retryCount) {
          retryRef.current += 1;

          const delay =
            retryDelay * Math.pow(2, retryRef.current - 1);

          setTimeout(loadImage, delay);

          return;
        }

        // Fallback
        if (fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        setHasError(true);
        setIsLoaded(true);
      };
    };

    loadImage();

    return () => {
      cancelled = true;
    };
  }, [
    src,
    fallbackSrc,
    retryCount,
    retryDelay,
    isVisible,
  ]);

  // ─────────────────────────────────────────────────────────────
  // Styles
  // ─────────────────────────────────────────────────────────────

  const imageStyles: CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit,
    opacity: isLoaded ? 1 : 0,
    transition: "opacity 300ms ease",
    willChange: "opacity",
    contentVisibility: "auto",
    ...style,
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-slate-800 ${containerClassName}`}
      style={{
        aspectRatio,
        contentVisibility: "auto",
      }}
    >
      {/* Skeleton */}
      {!isLoaded && showLoader && (
        skeleton || (
          <div className="absolute inset-0 animate-pulse bg-slate-700" />
        )
      )}

      {/* Main Image */}
      {isVisible && currentSrc && (
        <img
          {...props}
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding={decoding}
          draggable={draggable}
          className={`w-full h-full ${className}`}
          style={imageStyles}
        />
      )}

      {/* Error State */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
          Failed to load
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Memoized Export
// Prevent unnecessary rerenders
// ─────────────────────────────────────────────────────────────

export const SmartImage = memo(SmartImageComponent);