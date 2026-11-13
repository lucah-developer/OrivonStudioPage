import { useEffect } from "react";
import "./cursor.css";

const OPTIONS = {
  buttons: ".btn, .btnOrange, .sbtn, .navCta, .ctaBtn, .magnet, .chip, .vbtn, .lnk, .nzBtn, .stBtn, .toTop, button, [role='button']",
  lines: ".navLinks a:not(.navCta), .lnkBig, .coInfo a, .spAlt a, .ftCol a, .tsBtn, [data-cursor='line']",
  view: "[data-cursor='view']",
  text: "input:not([type='range']):not([type='submit']):not([type='button']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']",
  links: "a, label, select, summary, [role='tab'], input[type='range'], input[type='checkbox'], input[type='radio']",
  dark: ".ftS, .svcS, .orivon-case, .spCard, .abZoomPanel, .stackCard.sc1, .ph.navy, .ph.deep, [data-cursor-theme='dark']",
  viewLabel: "Ver proyecto",
  follow: 0.18,
  magnet: 0.12,
  pad: 6,
};

export default function CursorDot() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return undefined;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;
    const layer = document.createElement("div");
    layer.className = "oc-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML = '<div class="oc-ring" data-mode="default"><span class="oc-label"></span></div><div class="oc-dot" data-mode="default"></div>';
    document.body.appendChild(layer);

    const ring = layer.querySelector(".oc-ring");
    const dot = layer.querySelector(".oc-dot");
    const label = layer.querySelector(".oc-label");
    root.classList.add("oc-active");

    const pos = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let mode = "default";
    let snapEl = null;
    let lined = null;
    let shown = false;
    let frame = 0;

    const markLine = (el) => {
      if (lined === el) return;
      lined?.classList.remove("is-cursor-line");
      lined = el;
      el?.classList.add("is-cursor-line");
    };

    const setMode = (next, el) => {
      snapEl = next === "button" || next === "line" ? el : null;
      markLine(next === "line" ? el : null);
      if (next === "view") label.textContent = el?.dataset.cursorLabel || OPTIONS.viewLabel;
      if (next === mode) return;
      mode = next;
      ring.dataset.mode = next;
      dot.dataset.mode = next;
      if (next !== "view") label.textContent = "";
    };

    const pick = (target) => {
      if (!target || !target.closest) return setMode("default");
      root.classList.toggle("oc-dark", Boolean(target.closest(OPTIONS.dark)));
      const forced = target.closest("[data-cursor]");
      if (forced && forced.dataset.cursor !== "line") return setMode(forced.dataset.cursor, forced);
      if (target.closest(OPTIONS.text)) return setMode("text");
      const line = target.closest(OPTIONS.lines) || (forced?.dataset.cursor === "line" ? forced : null);
      if (line) return setMode("line", line);
      const button = target.closest(OPTIONS.buttons);
      if (button) return setMode("button", button);
      const view = target.closest(OPTIONS.view);
      if (view) return setMode("view", view);
      if (target.closest(OPTIONS.links)) return setMode("link");
      return setMode("default");
    };

    const loop = () => {
      if (snapEl && snapEl.isConnected && mode === "line") {
        const box = snapEl.getBoundingClientRect();
        const nav = snapEl.matches(".navLinks a, .tsBtn");
        const ease = reduce ? 1 : 0.22;
        ringPos.x += (box.left + box.width / 2 - ringPos.x) * ease;
        ringPos.y += ((nav ? box.bottom - 9 : box.bottom - 1) - ringPos.y) * ease;
        ring.style.width = `${box.width}px`;
        ring.style.height = "2px";
      } else if (snapEl && snapEl.isConnected) {
        const box = snapEl.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;
        const aimX = centerX + (pos.x - centerX) * OPTIONS.magnet;
        const aimY = centerY + (pos.y - centerY) * OPTIONS.magnet;
        const ease = reduce ? 1 : 0.25;
        ringPos.x += (aimX - ringPos.x) * ease;
        ringPos.y += (aimY - ringPos.y) * ease;
        ring.style.width = `${box.width + OPTIONS.pad * 2}px`;
        ring.style.height = `${box.height + OPTIONS.pad * 2}px`;
      } else {
        const ease = reduce ? 1 : OPTIONS.follow;
        ringPos.x += (pos.x - ringPos.x) * ease;
        ringPos.y += (pos.y - ringPos.y) * ease;
        ring.style.width = "";
        ring.style.height = "";
      }
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      if (!shown) {
        shown = true;
        ringPos.x = pos.x;
        ringPos.y = pos.y;
        root.classList.add("oc-on");
      }
    };
    const onOver = (event) => pick(event.target);
    const onDown = () => root.classList.add("oc-down");
    const onUp = () => root.classList.remove("oc-down");
    const onLeave = () => {
      shown = false;
      root.classList.remove("oc-on");
    };
    const onScroll = () => pick(document.elementFromPoint(pos.x, pos.y));

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("scroll", onScroll);
      lined?.classList.remove("is-cursor-line");
      layer.remove();
      root.classList.remove("oc-active", "oc-on", "oc-down", "oc-dark");
    };
  }, []);

  return null;
}
