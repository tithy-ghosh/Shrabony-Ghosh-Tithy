"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True after hydration — avoids SSR/client markup mismatches. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
