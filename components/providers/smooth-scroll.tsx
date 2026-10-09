"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef } from "react";

type LenisRef = { current: Lenis | null };

const LenisContext = createContext<LenisRef>({ current: null });

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      autoRaf: true,
      anchors: true,
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    ref.current = instance;

    return () => {
      ref.current = null;
      instance.destroy();
    };
  }, []);

  return <LenisContext.Provider value={ref}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
