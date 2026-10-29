import { useEffect, useMemo } from "react";

import {
    debounce,
    type DebounceOptions,
} from "../utils/debounce";

export function useDebouncedCallback<
    T extends (...args: any[]) => any
>(
    callback: T,
    delay: number,
    options?: DebounceOptions
) {
    const debouncedFn = useMemo(() => {
        return debounce(callback, delay, options);
    }, [callback, delay, options]);

    useEffect(() => {
        return () => {
            debouncedFn.cancel();
        };
    }, [debouncedFn]);

    return debouncedFn;
}