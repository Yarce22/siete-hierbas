"use client";

import { useEffect, useRef } from "react";

export function SiteCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.body.classList.add("sh-cursor-active");

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const animate = () => {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.12);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = pos.current.x + "px";
        ringRef.current.style.top = pos.current.y + "px";
      }
      raf.current = requestAnimationFrame(animate);
    };

    const onEnter = () => ringRef.current?.classList.add("sh-hovering");
    const onLeave = () => ringRef.current?.classList.remove("sh-hovering");

    const addHoverListeners = () => {
      document.querySelectorAll("a, button, [data-hover]").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    document.addEventListener("mousemove", onMove);
    addHoverListeners();
    raf.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.body.classList.remove("sh-cursor-active");
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div id="sh-cursor-ring" ref={ringRef} aria-hidden="true" />
      <div id="sh-cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}
