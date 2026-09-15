"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ReactLenis } from "lenis/react";

// Buttery, inertia-based scroll for a premium feel. Skipped entirely for
// prefers-reduced-motion users, who get plain native scrolling instead.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Client-only check (SSR has no `window`), so this can't be derived
    // during render — the one-time mount effect is intentional here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis
      root
      options={{
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
