import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const WORDS = ["carácter.", "estilo.", "intención.", "oficio."];

export default function CyclingWord() {
  const wordRef = useRef(null);
  const ruleRef = useRef(null);

  useLayoutEffect(() => {
    const word = wordRef.current;
    const rule = ruleRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!word || !rule || reduce) return undefined;

    const paint = (progress) => {
      gsap.set(word, { clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` });
      gsap.set(rule, {
        left: `${progress * 100}%`,
        autoAlpha: progress < 0.995 ? 1 : 0,
      });
    };

    let index = 0;
    const state = { progress: 1 };
    paint(1);

    const tl = gsap.timeline({ repeat: -1, delay: 1.8 });
    tl.to(state, {
      progress: 0,
      duration: 1.55,
      ease: "sine.inOut",
      onUpdate: () => paint(state.progress),
    })
      .call(() => {
        index = (index + 1) % WORDS.length;
        word.textContent = WORDS[index];
      })
      .to(state, {
        progress: 1,
        duration: 1.85,
        ease: "sine.inOut",
        onUpdate: () => paint(state.progress),
      })
      .to({}, { duration: 1.45 });

    return () => tl.kill();
  }, []);

  return (
    <em className="serif wipe">
      <span className="wipe__layer" ref={wordRef}>
        {WORDS[0]}
      </span>
      <span className="wipe__rule" ref={ruleRef} aria-hidden="true" />
    </em>
  );
}
