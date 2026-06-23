"use client";

import { useEffect, useRef } from "react";

/**
 * Adds the .in class once the wrapped element scrolls into view, which
 * triggers the fade/slide-in transition defined on .reveal / .reveal-group
 * in globals.css. Ported from the mockup's vanilla-JS IntersectionObserver.
 */
function useRevealRef() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

export function Reveal({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRevealRef();
  return (
    <Tag ref={ref} className={`reveal ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function RevealGroup({ as: Tag = "div", className = "", children, ...rest }) {
  const ref = useRevealRef();
  return (
    <Tag ref={ref} className={`reveal-group ${className}`} {...rest}>
      {children}
    </Tag>
  );
}
