// shared/components/Dropdown/Dropdown.tsx

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from "react";

import { createPortal } from "react-dom";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface DropdownItem {
    label: string;
    value: string | number;
    disabled?: boolean;
}

export interface RenderTriggerParams<T> {
    selectedItem: T | null;
    isOpen: boolean;
    focused: boolean;
}

export interface RenderItemParams<T> {
    item: T;
    index: number;
    isSelected: boolean;
    isFocused: boolean;
}

interface DropdownProps<T extends DropdownItem> {
    items: T[];
    value: T | null;
    onChange: (item: T) => void;

    renderTrigger?: (
        params: RenderTriggerParams<T>
    ) => ReactNode;

    renderItem?: (
        params: RenderItemParams<T>
    ) => ReactNode;

    placeholder?: string;

    disabled?: boolean;

    className?: string;
    dropdownClassName?: string;

    portal?: boolean;
    closeOnSelect?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function Dropdown<T extends DropdownItem>({
    items,
    value,
    onChange,

    renderTrigger,
    renderItem,

    placeholder = "Select option",

    disabled = false,

    className = "",
    dropdownClassName = "",

    portal = true,
    closeOnSelect = true,
}: DropdownProps<T>) {
    // ─────────────────────────────────────────────────────────────
    // State
    // ─────────────────────────────────────────────────────────────

    const [isOpen, setIsOpen] = useState(false);

    const [focusedIndex, setFocusedIndex] = useState(() => {
        if (!value) return -1;

        return items.findIndex(
            (item) => item.value === value.value
        );
    });

    const [triggerFocused, setTriggerFocused] =
        useState(false);

    // ─────────────────────────────────────────────────────────────
    // Refs
    // ─────────────────────────────────────────────────────────────

    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const triggerRef =
        useRef<HTMLButtonElement | null>(null);

    const listRef = useRef<HTMLDivElement | null>(null);

    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    // ─────────────────────────────────────────────────────────────
    // Position
    // ─────────────────────────────────────────────────────────────

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const updatePosition = useCallback(() => {
        if (!triggerRef.current) return;

        const rect =
            triggerRef.current.getBoundingClientRect();

        setPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width,
        });
    }, []);

    // ─────────────────────────────────────────────────────────────
    // Open / Close
    // ─────────────────────────────────────────────────────────────

    const openDropdown = useCallback(() => {
        if (disabled) return;

        updatePosition();

        setIsOpen(true);
    }, [disabled, updatePosition]);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);

        triggerRef.current?.focus();
    }, []);

    const toggleDropdown = () => {
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    };

    // ─────────────────────────────────────────────────────────────
    // Outside Click
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;

        const handleClick = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(
                    e.target as Node
                )
            ) {
                closeDropdown();
            }
        };

        document.addEventListener(
            "mousedown",
            handleClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClick
            );
        };
    }, [isOpen, closeDropdown]);

    // ─────────────────────────────────────────────────────────────
    // Position Updates
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;

        const handler = () => updatePosition();

        window.addEventListener("resize", handler);
        window.addEventListener("scroll", handler);

        return () => {
            window.removeEventListener(
                "resize",
                handler
            );

            window.removeEventListener(
                "scroll",
                handler
            );
        };
    }, [isOpen, updatePosition]);

    // ─────────────────────────────────────────────────────────────
    // Scroll Focused Item Into View
    // ─────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!isOpen) return;

        itemRefs.current[
            focusedIndex
        ]?.scrollIntoView({
            block: "nearest",
        });
    }, [focusedIndex, isOpen]);

    // ─────────────────────────────────────────────────────────────
    // Keyboard Navigation
    // ─────────────────────────────────────────────────────────────

   const handleKeyDown = (
  e: React.KeyboardEvent
) => {
  switch (e.key) {
    // ─────────────────────────────────────────
    // ENTER / SPACE
    // ─────────────────────────────────────────

    case "Enter":
    case " ": {
      e.preventDefault();

      // OPEN DROPDOWN
      if (!isOpen) {
        openDropdown();
        return;
      }

      // SELECT FOCUSED ITEM
      if (focusedIndex >= 0) {
        const item = items[focusedIndex];

        if (item && !item.disabled) {
          selectItem(item);
        }
      }

      break;
    }

    // ─────────────────────────────────────────
    // DOWN
    // ─────────────────────────────────────────

    case "ArrowDown": {
      e.preventDefault();

      if (!isOpen) {
        openDropdown();

        // focus first item immediately
        setFocusedIndex(0);

        return;
      }

      setFocusedIndex((prev) =>
        Math.min(prev + 1, items.length - 1)
      );

      break;
    }

    // ─────────────────────────────────────────
    // UP
    // ─────────────────────────────────────────

    case "ArrowUp": {
      e.preventDefault();

      if (!isOpen) {
        openDropdown();

        setFocusedIndex(items.length - 1);

        return;
      }

      setFocusedIndex((prev) =>
        Math.max(prev - 1, 0)
      );

      break;
    }

    // ─────────────────────────────────────────
    // ESC
    // ─────────────────────────────────────────

    case "Escape": {
      e.preventDefault();

      closeDropdown();

      break;
    }

    // ─────────────────────────────────────────
    // TAB
    // ─────────────────────────────────────────

    case "Tab": {
      closeDropdown();
      break;
    }
  }
};
    // ─────────────────────────────────────────────────────────────
    // Select Item
    // ─────────────────────────────────────────────────────────────

    const selectItem = useCallback(
        (item: T) => {
            if (item.disabled) return;

            onChange(item);

            if (closeOnSelect) {
                closeDropdown();
            }
        },
        [onChange, closeOnSelect, closeDropdown]
    );

    // ─────────────────────────────────────────────────────────────
    // Default Trigger
    // ─────────────────────────────────────────────────────────────

    const defaultTrigger = (
        <button
            ref={triggerRef}
            type="button"
            disabled={disabled}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            onFocus={() => setTriggerFocused(true)}
            onBlur={() => setTriggerFocused(false)}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className={`
        h-11 w-full
        px-4
        rounded-xl
        border
        flex items-center justify-between
        bg-slate-900
        border-slate-700
        text-white
        outline-none
        transition-all
        ${triggerFocused
                    ? "ring-2 ring-blue-500"
                    : ""}
        ${className}
      `}
        >
            <span>
                {value?.label ?? placeholder}
            </span>

            <span
                className={`
          transition-transform
          ${isOpen ? "rotate-180" : ""}
        `}
            >
                ▼
            </span>
        </button>
    );

    // ─────────────────────────────────────────────────────────────
    // Dropdown Content
    // ─────────────────────────────────────────────────────────────

    const dropdownContent = (
        <div
            ref={listRef}
            role="listbox"
            tabIndex={-1}
            className={`
        overflow-auto
        max-h-72
        ${dropdownClassName}
         rounded-2xl
        border border-slate-700
        bg-slate-900
        shadow-2xl
        p-1
      `}
            style={{
                position: portal ? "fixed" : "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 9999,
            }}
        >
            {items.map((item, index) => {
                const isSelected =
                    value?.value === item.value;

                const isFocused =
                    focusedIndex === index;

                return (
                    <div
                        key={item.value}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        role="option"
                        aria-selected={isSelected}
                        onMouseEnter={() =>
                            setFocusedIndex(index)
                        }
                        onMouseDown={(e) => {
                            // Prevent blur before click
                            e.preventDefault();
                        }}
                        onClick={() => selectItem(item)}
                        className={`
              px-3 py-2.5
              rounded-xl
              cursor-pointer
              transition-colors
              outline-none

              ${item.disabled
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }

              ${isFocused
                                ? "bg-blue-500 text-white"
                                : isSelected
                                    ? "bg-slate-800 text-white"
                                    : "text-slate-300 hover:bg-slate-800"
                            }
            `}
                    >
                        {renderItem ? (
                            renderItem({
                                item,
                                index,
                                isSelected,
                                isFocused,
                            })
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </div>
                );
            })}
        </div>
    );

    return (
        <div
            ref={wrapperRef}
            className="relative"
        >
            {renderTrigger ? (
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setTriggerFocused(true)}
                    onBlur={() => setTriggerFocused(false)}
                    role="combobox"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                    className="w-full outline-none"
                >
                    {renderTrigger({
                        selectedItem: value,
                        isOpen,
                        focused: triggerFocused,
                    })}
                </button>
            ) : (
                defaultTrigger
            )}

            {isOpen &&
                (portal
                    ? createPortal(
                        dropdownContent,
                        document.body
                    )
                    : dropdownContent)}
        </div>
    );
}