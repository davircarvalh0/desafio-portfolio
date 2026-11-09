"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useInView } from "framer-motion";

export function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const element = event.currentTarget;
  const bounds = element.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width;
  const y = (event.clientY - bounds.top) / bounds.height;
  element.style.setProperty("--pointer-x", (x * 100) + "%");
  element.style.setProperty("--pointer-y", (y * 100) + "%");
  element.style.setProperty("--drift-x", ((x - .5) * 18) + "px");
  element.style.setProperty("--drift-y", ((y - .5) * 18) + "px");
}

export function resetPointer(event: PointerEvent<HTMLElement>) {
  for (const property of ["--pointer-x", "--pointer-y", "--drift-x", "--drift-y"]) {
    event.currentTarget.style.removeProperty(property);
  }
}

const artwork = {
  dados: (
    <>
      <path className="art-guide" d="M74 57v178h270M74 93h270M74 128h270M74 163h270M74 198h270" />
      <g className="art-fill">
        <rect x="102" y="170" width="26" height="65" rx="4" /><rect x="151" y="146" width="26" height="89" rx="4" />
        <rect x="200" y="160" width="26" height="75" rx="4" /><rect x="249" y="115" width="26" height="120" rx="4" />
        <rect x="298" y="89" width="26" height="146" rx="4" />
      </g>
      <path className="art-main" d="m115 151 49-28 49 12 49-49 49-26" />
      <g className="art-points"><circle cx="115" cy="151" r="4" /><circle cx="164" cy="123" r="4" /><circle cx="213" cy="135" r="4" /><circle cx="262" cy="86" r="4" /><circle cx="311" cy="60" r="5" /></g>
    </>
  ),
  marketing: (
    <>
      <circle className="art-guide" cx="209" cy="148" r="105" />
      <circle className="art-guide" cx="209" cy="148" r="84" />
      <path className="art-fill" d="M169 128h36l46-24v83l-46-24h-36z" />
      <path className="art-main" d="M169 128h36l46-24v83l-46-24h-36zM181 163l12 32h22l-10-32m62-37a35 35 0 0 1 0 39m15-51a55 55 0 0 1 0 63" />
      <g className="art-points"><circle cx="209" cy="43" r="5" /><circle cx="135" cy="222" r="4" /><circle cx="293" cy="148" r="4" /></g>
    </>
  ),
  desenvolvimento: (
    <>
      <path className="art-guide" d="M44 73h42l25 24m197 0 24-24h45M44 217h42l25-24m197 0 24 24h45M210 20v39m0 182v34" />
      <rect className="art-fill" x="96" y="62" width="228" height="177" rx="19" />
      <rect className="art-main" x="96" y="62" width="228" height="177" rx="19" />
      <path className="art-guide" d="M97 104h225" />
      <path className="art-main" d="m171 138-27 23 27 23m78-46 27 23-27 23m-29-55-21 66" />
      <g className="art-points"><circle cx="118" cy="83" r="3" /><circle cx="132" cy="83" r="3" /><circle cx="146" cy="83" r="3" /><circle cx="44" cy="73" r="4" /><circle cx="377" cy="217" r="4" /></g>
    </>
  ),
  "gente-e-gestao": (
    <>
      <path className="art-guide" d="M209 47 92 111v99l117 47 119-47v-99zM92 111l117 39 119-39m-119 39v107M92 210l117-60 119 60" />
      <g className="art-fill"><circle cx="209" cy="143" r="51" /><circle cx="92" cy="111" r="27" /><circle cx="328" cy="111" r="27" /></g>
      <path className="art-main" d="M184 171v-5a25 25 0 0 1 50 0v5m-25-38a13 13 0 1 0 0-26 13 13 0 0 0 0 26zM79 122a13 13 0 0 1 26 0m210 0a13 13 0 0 1 26 0" />
      <g className="art-points"><circle cx="92" cy="105" r="4" /><circle cx="328" cy="105" r="4" /><circle cx="209" cy="47" r="5" /><circle cx="92" cy="210" r="5" /><circle cx="328" cy="210" r="5" /><circle cx="209" cy="257" r="5" /></g>
    </>
  ),
  produto: (
    <>
      <path className="art-guide" d="M209 28v239M61 150h298m-249-79 198 157M308 71 110 228" />
      <path className="art-fill" d="m209 53 115 60-115 60-115-60z" />
      <path className="art-main" d="m209 53 115 60-115 60-115-60zm-115 92 115 60 115-60m-230 33 115 60 115-60" />
      <path className="art-guide" d="m156 113 53-28 53 28-53 28z" />
      <g className="art-points"><circle cx="209" cy="53" r="5" /><circle cx="324" cy="113" r="4" /><circle cx="209" cy="238" r="5" /><circle cx="94" cy="113" r="4" /></g>
    </>
  ),
  comercial: (
    <>
      <path className="art-guide" d="M79 69h262M79 115h262M79 161h262M79 207h262M125 46v190m57-190v190m57-190v190m57-190v190" />
      <path className="art-fill" d="M69 178h62c31 0 39-62 78-62h135v24H212c-27 0-38 62-78 62H69z" />
      <path className="art-main" d="M69 190h62c39 0 42-62 78-62h135m-275-31h62c39 0 42 62 78 62h93m18-53 24 22-24 22" />
      <g className="art-points"><circle cx="69" cy="190" r="6" /><circle cx="69" cy="97" r="6" /><circle cx="209" cy="128" r="5" /><circle cx="302" cy="159" r="5" /></g>
    </>
  ),
};

export function OrbitalFigure({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <svg className={className} viewBox="0 0 390 390" fill="none" aria-hidden={children ? undefined : true}>
      <g className="orbit-rings">
        <circle className="orbit-trace" cx="195" cy="195" r="162" pathLength="1" />
        <circle className="orbit-trace" cx="195" cy="195" r="128" pathLength="1" />
        <circle className="orbit-trace" cx="195" cy="195" r="94" pathLength="1" />
        <ellipse className="orbit-trace" cx="195" cy="195" rx="163" ry="80" transform="rotate(-42 195 195)" pathLength="1" />
        <ellipse className="orbit-trace" cx="195" cy="195" rx="163" ry="80" transform="rotate(42 195 195)" pathLength="1" />
        <path className="orbit-axis" d="M195 22v346M22 195h346" />
        {!children && (
          <>
            <circle className="art-node" cx="195" cy="101" r="6" />
            <circle className="art-node" cx="323" cy="195" r="4" />
            <circle className="art-node" cx="101" cy="195" r="4" />
          </>
        )}
      </g>
      <ellipse className="orbit-response" cx="195" cy="195" rx="163" ry="80" transform="rotate(-42 195 195)" pathLength="1" />
      {children}
    </svg>
  );
}

export function AreaArtwork({ area, expanded }: { area: string; expanded: boolean }) {
  const artworkRef = useRef<HTMLDivElement>(null);
  const inView = useInView(artworkRef, { amount: .3 });
  return (
    <div ref={artworkRef} className="chapter-art pointer-surface" aria-hidden="true"
      data-orbit={inView} data-expanded={expanded} onPointerMove={trackPointer} onPointerLeave={resetPointer}
    >
      <OrbitalFigure className="chapter-orbit" />
      <svg className="chapter-graphic" viewBox="0 0 420 290" fill="none">
        {artwork[area as keyof typeof artwork]}
      </svg>
    </div>
  );
}
