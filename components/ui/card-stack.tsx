"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "framer-motion";
import { ArrowLeft, ArrowRight, SquareArrowOutUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LetterReveal } from "@/components/ui/letter-reveal";

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];
  initialIndex?: number;
  activeIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

export function wrapIndex(n: number, len: number) {
  return len > 0 ? ((n % len) + len) % len : 0;
}

export function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alternative = raw > 0 ? raw - len : raw + len;
  return Math.abs(alternative) < Math.abs(raw) ? alternative : raw;
}

export function CardStack<T extends CardStackItem>({
  items, initialIndex = 0, activeIndex, maxVisible = 5,
  cardWidth = 440, cardHeight = 340, overlap = 0.57, spreadDeg = 24,
  perspectivePx = 1200, depthPx = 75, tiltXDeg = 5,
  activeLiftPx = 22, activeScale = 1.02, inactiveScale = 0.96,
  springStiffness = 270, springDamping = 33,
  loop = true, autoAdvance = false, intervalMs = 4000, pauseOnHover = true,
  showDots = true, className, onChangeIndex, renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;
  const [internalIndex, setInternalIndex] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);
  const [focusWithin, setFocusWithin] = React.useState(false);
  const [documentHidden, setDocumentHidden] = React.useState(false);
  const [width, setWidth] = React.useState(1080);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const didDrag = React.useRef(false);
  const active = wrapIndex(activeIndex ?? internalIndex, len);

  React.useEffect(() => { setInternalIndex(index => wrapIndex(index, len)); }, [len]);
  React.useEffect(() => {
    const element = stageRef.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    const update = () => setDocumentHidden(document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const select = React.useCallback((index: number) => {
    if (!len) return;
    const value = loop ? wrapIndex(index, len) : Math.max(0, Math.min(index, len - 1));
    setInternalIndex(value);
    onChangeIndex?.(value, items[value]);
  }, [items, len, loop, onChangeIndex]);
  const prev = React.useCallback(() => select(active - 1), [select, active]);
  const next = React.useCallback(() => select(active + 1), [select, active]);
  const canGoPrev = len > 1 && (loop || active > 0);
  const canGoNext = len > 1 && (loop || active < len - 1);

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || len <= 1 || documentHidden || focusWithin || (pauseOnHover && hovering)) return;
    const timer = window.setInterval(() => { if (canGoNext) next(); }, Math.max(1500, intervalMs));
    return () => window.clearInterval(timer);
  }, [autoAdvance, reduceMotion, len, documentHidden, focusWithin, pauseOnHover, hovering, canGoNext, next, intervalMs]);

  if (!len) return null;
  const compact = width < 650;
  const actualWidth = Math.max(180, Math.min(cardWidth, width * (compact ? 0.77 : 0.5)));
  const actualHeight = compact ? Math.min(340, actualWidth * 1.16) : cardHeight;
  const maxOffset = Math.min(Math.floor(Math.max(1, maxVisible) / 2), compact ? 1 : 3);
  const spacing = Math.max(10, actualWidth * (1 - (compact ? 0.75 : Math.min(0.8, Math.max(0, overlap)))));
  const stepDeg = maxOffset ? (compact ? 9 : spreadDeg / maxOffset) : 0;
  const activeItem = items[active];

  return (
    <div className={cn("w-full", className)}
      onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocusWithin(false); }}>
      <div ref={stageRef} className="fan-stage relative w-full" style={{ height: Math.max(compact ? 340 : 420, actualHeight + 85) }}
        role="region" aria-roledescription="carrossel" aria-label="Os seis desafios" tabIndex={0}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); prev(); }
          if (event.key === "ArrowRight") { event.preventDefault(); next(); }
          if (event.key === "Home") { event.preventDefault(); select(0); }
          if (event.key === "End") { event.preventDefault(); select(len - 1); }
        }}>
        <div className="fan-ground pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 flex items-end justify-center" style={{ perspective: `${perspectivePx}px` }}>
          <AnimatePresence initial={false}>
            {items.map((item, index) => {
              const off = signedOffset(index, active, len, loop);
              const abs = Math.abs(off);
              if (abs > maxOffset) return null;
              const isActive = off === 0;
              return (
                <motion.div key={item.id} data-card={item.id} data-active={isActive}
                  role="button" tabIndex={isActive ? 0 : -1}
                  aria-label={`Selecionar desafio ${item.title}`} aria-pressed={isActive}
                  className={cn("fan-card absolute bottom-0 select-none overflow-hidden rounded-[1.5rem]", isActive ? "cursor-grab active:cursor-grabbing" : "cursor-pointer")}
                  style={{ width: actualWidth, height: actualHeight, zIndex: 100 - abs, transformStyle: "preserve-3d", touchAction: "pan-y" }}
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1, x: off * spacing, y: abs * 7 + (isActive ? -activeLiftPx : 0), z: reduceMotion ? 0 : -abs * depthPx,
                    rotateZ: reduceMotion ? 0 : off * stepDeg, rotateX: reduceMotion || isActive ? 0 : tiltXDeg,
                    scale: isActive ? activeScale : inactiveScale }}
                  exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12 } }}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: springStiffness, damping: springDamping }}
                  onPointerDown={() => { didDrag.current = false; }}
                  onClick={() => { if (!didDrag.current) select(index); }}
                  onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); select(index); } }}
                  drag={isActive && !reduceMotion && len > 1 ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }} dragElastic={0.2}
                  onDragStart={() => { didDrag.current = true; }}
                  onDragEnd={(_event, info: PanInfo) => {
                    const threshold = Math.min(130, actualWidth * 0.22);
                    if (info.offset.x > threshold || info.velocity.x > 650) prev();
                    else if (info.offset.x < -threshold || info.velocity.x < -650) next();
                  }}>
                  {renderCard ? renderCard(item, { active: isActive }) : <DefaultFanCard item={item} active={isActive} />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      <div className="fan-controls flex items-center justify-center gap-5">
        <button type="button" className="round-control" aria-label="Desafio anterior" onClick={prev} disabled={!canGoPrev}><ArrowLeft size={17} /></button>
        {showDots && <div className="flex items-center gap-0.5" role="group" aria-label="Selecionar desafio">
          {items.map((item, index) => <button key={item.id} type="button" onClick={() => select(index)}
            aria-label={`Ir para ${item.title}`} aria-current={index === active ? "true" : undefined} className="dot-control">
            <span className={cn("block h-1.5 rounded-full", index === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/25")} />
          </button>)}
        </div>}
        <button type="button" className="round-control" aria-label="Próximo desafio" onClick={next} disabled={!canGoNext}><ArrowRight size={17} /></button>
        {activeItem.href && <Link href={activeItem.href} target="_blank" rel="noreferrer" className="round-control" aria-label={`Abrir entrega de ${activeItem.title}`}><SquareArrowOutUpRight size={16} /></Link>}
      </div>
      <p className="sr-only" aria-live="polite">Desafio {active + 1} de {len}: {activeItem.title}</p>
    </div>
  );
}

function DefaultFanCard({ item, active }: { item: CardStackItem; active: boolean }) {
  return <div className="relative h-full w-full">
    {item.imageSrc ? <img src={item.imageSrc} alt={`Imagem ilustrativa de ${item.title}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} loading="eager" /> : <div className="absolute inset-0 bg-secondary" />}
    <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-black/5" />
    <div className="card-topline"><span>{item.tag || "Desafio CITi"}</span><span className="card-corner" aria-hidden="true"><SquareArrowOutUpRight size={15} /></span></div>
    <div className="relative z-10 flex h-full flex-col justify-end p-7 text-left">
      <h3 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-[-0.04em] text-white"><LetterReveal text={item.title} delay={0.2} /></h3>
      {item.description && <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/85">{item.description}</p>}
      <span className="sr-only">{active ? "Cartão selecionado" : "Selecione para ver os detalhes"}</span>
    </div>
  </div>;
}
