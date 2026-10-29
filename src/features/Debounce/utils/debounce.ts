export type DebounceOptions = {
    leading?: boolean;
    trailing?: boolean;
};

export type DebouncedFunction<T extends (...args: any[]) => any> = ((
    ...args: Parameters<T>
) => void) & {
    cancel: () => void;
    flush: () => void;
};

export function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number,
    options: DebounceOptions = {}
): DebouncedFunction<T> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let lastArgs: Parameters<T> | null = null;

    const { leading = false, trailing = true } = options;

    const debounced = (...args: Parameters<T>) => {
        lastArgs = args;

        const shouldCallLeading = leading && !timer;

        if (timer) {
            clearTimeout(timer);
        }

        if (shouldCallLeading) {
            fn(...args);
        }

        timer = setTimeout(() => {
            if (trailing && lastArgs) {
                fn(...lastArgs);
            }

            timer = null;
            lastArgs = null;
        }, delay);
    };

    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer);
        }

        timer = null;
        lastArgs = null;
    };

    debounced.flush = () => {
        if (timer && lastArgs) {
            clearTimeout(timer);

            fn(...lastArgs);

            timer = null;
            lastArgs = null;
        }
    };

    return debounced as DebouncedFunction<T>;
}