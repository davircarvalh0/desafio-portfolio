"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { OrbitalFigure } from "@/components/area-artwork";
import { projects } from "@/lib/projects";

const turn = 2 * Math.PI;
const tracks = [
  { rx: 163, ry: 80, tilt: -42 * Math.PI / 180, phase: .2, period: 21000 },
  { rx: 163, ry: 80, tilt: 42 * Math.PI / 180, phase: .14, period: -24600 },
  { rx: 128, ry: 128, tilt: 0, phase: .37, period: 28500 },
];

function orbitPosition(index: number, elapsed: number) {
  const { rx, ry, tilt, phase, period } = tracks[index % tracks.length];
  const angle = turn * (phase + Math.floor(index / tracks.length) / 2 + elapsed / period);
  const x = rx * Math.cos(angle);
  const y = ry * Math.sin(angle);
  return "translate(" + (195 + x * Math.cos(tilt) - y * Math.sin(tilt)) +
    " " + (195 + x * Math.sin(tilt) + y * Math.cos(tilt)) + ")";
}

export function HeroOrbit({ challengeUrl }: { challengeUrl: string }) {
  const container = useRef<HTMLElement>(null);
  const nuclei = useRef<Array<SVGGElement | null>>([]);
  const elapsed = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const inView = useInView(container, { amount: .22 });
  const active = hovered ?? focused;
  const paused = manuallyPaused || active !== null;

  useEffect(() => {
    if (!inView || reduceMotion || paused) return;
    let last: number | undefined;
    let frame = 0;

    const tick = (now: number) => {
      if (last !== undefined) elapsed.current += Math.min(now - last, 40);
      last = now;
      nuclei.current.forEach((nucleus, index) => {
        nucleus?.setAttribute("transform", orbitPosition(index, elapsed.current));
      });
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [inView, reduceMotion, paused]);

  return (
    <nav ref={container} className="hero-art" aria-label="Atalhos orbitais para as áreas">
      <OrbitalFigure className="hero-orbit-svg">
        <defs>
          <radialGradient id="hero-nucleus-shading" cx="31%" cy="24%" r="82%">
            <stop offset="0%" stopColor="#fff" stopOpacity=".8" />
            <stop offset="34%" stopColor="#fff" stopOpacity=".22" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#071410" stopOpacity=".62" />
          </radialGradient>
        </defs>
        {projects.map((project, index) => (
          <g key={project.id} ref={element => { nuclei.current[index] = element; }} transform={orbitPosition(index, 0)}>
            <a className="hero-nucleus" data-area={project.id} href={challengeUrl + "#area-" + project.id}
              aria-label={"Ir para " + project.title}
              onPointerEnter={event => { if (event.pointerType === "mouse") setHovered(index); }}
              onPointerLeave={() => setHovered(null)}
              onFocus={() => setFocused(index)} onBlur={() => setFocused(null)}
            >
              <circle className="nucleus-hit" r="28" />
              <circle className="nucleus-ring" r="17" />
              <g className="nucleus-sphere">
                <circle className="nucleus-core" r="10" />
                <circle r="9.5" fill="url(#hero-nucleus-shading)" />
              </g>
            </a>
          </g>
        ))}
      </OrbitalFigure>
      <div className="orbit-legend">
        <p className="orbit-caption">{active === null ? "Explore as áreas pelos núcleos" : projects[active].title}</p>
        {!reduceMotion && (
          <button className="orbit-toggle" type="button" onClick={() => setManuallyPaused(value => !value)}
            aria-label={manuallyPaused ? "Retomar órbitas" : "Pausar órbitas"}
          >
            {manuallyPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        )}
      </div>
    </nav>
  );
}
