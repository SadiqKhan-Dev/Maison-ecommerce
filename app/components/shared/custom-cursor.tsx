"use client";

import * as React from "react";
import { ShoppingBag } from "lucide-react";

export function CustomCursor() {
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const bagRef = React.useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = React.useState(false);
  const [isBagActive, setIsBagActive] = React.useState(false);
  const pos = React.useRef({ x: 0, y: 0 });
  const ringPos = React.useRef({ x: 0, y: 0 });

  React.useEffect(() => {
    const isMobile =
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0);
    if (isMobile) return;

    document.body.classList.add("cursor-bag");

    const onMouseMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        setIsHovering(true);
      }
      if (target.closest("[data-cursor='bag']")) {
        setIsBagActive(true);
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        setIsHovering(false);
      }
      if (target.closest("[data-cursor='bag']")) {
        setIsBagActive(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    let raf: number;
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`;
        dotRef.current.style.top = `${pos.current.y}px`;
      }

      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;

      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      if (bagRef.current) {
        bagRef.current.style.left = `${ringPos.current.x}px`;
        bagRef.current.style.top = `${ringPos.current.y}px`;
      }

      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("cursor-bag");
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`cursor-dot ${isHovering ? "cursor-hover" : ""} ${isBagActive ? "cursor-bag-active" : ""}`}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? "cursor-hover" : ""} ${isBagActive ? "cursor-bag-active" : ""}`}
      />
      <div
        ref={bagRef}
        className={`cursor-bag-icon ${isBagActive ? "visible" : ""}`}
      >
        <ShoppingBag className="h-6 w-6" strokeWidth={1.5} />
      </div>
    </>
  );
}
