import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./cursor.css";

export default function CursorDot() {
  const dotRef = useRef(null);
  const puckRef = useRef(null);

  useLayoutEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const puck = puckRef.current;
    if (!dot || !puck) return undefined;

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let tiltX = 0;
    let tiltY = 0;
    let targetTiltX = 0;
    let targetTiltY = 0;
    let scale = 1;
    let targetScale = 1;
    let frame = 0;
    let active = false;

    const paint = () => {
      dot.style.left = `${currentX}px`;
      dot.style.top = `${currentY}px`;
      puck.style.transform = `perspective(280px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`;
    };

    const render = () => {
      const ease = reduce ? 1 : 0.28;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      tiltX += (targetTiltX - tiltX) * 0.18;
      tiltY += (targetTiltY - tiltY) * 0.18;
      scale += (targetScale - scale) * 0.2;
      paint();
      frame = requestAnimationFrame(render);
    };

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      const dx = event.clientX - targetX;
      const dy = event.clientY - targetY;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!active) {
        active = true;
        currentX = targetX;
        currentY = targetY;
        document.documentElement.classList.add("orivon-dot");
        dot.classList.add("is-on");
      }
      targetTiltY = Math.max(-16, Math.min(16, dx * 0.4));
      targetTiltX = Math.max(-14, Math.min(14, -dy * 0.35));
      paint();
    };

    const onOver = (event) => {
      const node = event.target instanceof Element ? event.target : null;
      targetScale = node?.closest("a, button") ? 1.15 : 1;
    };

    frame = requestAnimationFrame(render);
    window.addEventListener("pointermove", onMove, { capture: true, passive: true });
    window.addEventListener("pointerover", onOver, { capture: true });
    return () => {
      document.documentElement.classList.remove("orivon-dot");
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove, { capture: true });
      window.removeEventListener("pointerover", onOver, { capture: true });
    };
  }, []);

  return createPortal(
    <div className="orivon-cursor" ref={dotRef} aria-hidden="true">
      <span className="orivon-cursor__puck" ref={puckRef} />
    </div>,
    document.body
  );
}
