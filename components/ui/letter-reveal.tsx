"use client";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

type LetterRevealProps = {
  text: string;
  className?: string;
  offset?: number;
  delay?: number;
};

/** Entrada por letra sem alterar as palavras, o espaço ou o nome acessível. */
export function LetterReveal({ text, className, offset = 0, delay = 0.1 }: LetterRevealProps) {
  let index = offset;
  return <span className={cn("letter-reveal", className)} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.split(/(\s+)/).map((word, wordIndex) => {
      if (/^\s+$/.test(word)) { index += word.length; return <span key={wordIndex}>{word}</span>; }
      return <span className="letter-word" key={wordIndex}>{Array.from(word).map((letter, letterIndex) => {
        const letterOffset = index++;
        return <span key={letterIndex} className="letter-char" style={{ "--letter-index": letterOffset } as CSSProperties}>{letter}</span>;
      })}</span>;
    })}</span>
  </span>;
}
