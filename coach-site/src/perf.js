// Dev-only User Timing helpers. Measures show up in the Chrome Performance panel's Timings track.
const enabled = import.meta.env.DEV;

export function perfStart() {
    return enabled ? performance.now() : undefined;
}

export function perfEnd(name, start, detail) {
    if (enabled && start !== undefined) {
        performance.measure(name, { start, end: performance.now(), detail });
    }
}

export function perfMeasure(name, fn, detail) {
    let start = perfStart();
    try {
        return fn();
    } finally {
        perfEnd(name, start, detail);
    }
}
