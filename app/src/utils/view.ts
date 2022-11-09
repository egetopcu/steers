import { Readable, writable } from "svelte/store";
import isEqualWith from "lodash/isEqualWith";

export function view<
    S extends Readable<any>,
    V extends S extends Readable<infer U> ? U : never,
    T
>(
    store: S,
    viewFn: (value: V) => T = (value: V) => value,
    diffFn?: (current: T, previous: T) => boolean,
    initialValue?: T
) {
    let current = initialValue;
    const proxy = writable(current);

    function handler(next) {
        const next_value = viewFn(next);
        if (!isEqualWith(next_value, current, diffFn)) {
            current = next_value;
            proxy.set(current);
        }
    }

    store.subscribe(handler);

    return proxy;
}
