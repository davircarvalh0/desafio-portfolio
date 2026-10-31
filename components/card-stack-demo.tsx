"use client";
import { CardStack } from "@/components/ui/card-stack";
import { projects, type Project } from "@/lib/projects";
export default function CardStackDemo({ activeIndex, onChangeIndex }: { activeIndex: number; onChangeIndex: (index: number, item: Project) => void }) {
  return <CardStack items={projects} activeIndex={activeIndex} onChangeIndex={onChangeIndex}
    cardWidth={440} cardHeight={340} overlap={0.57} spreadDeg={24} maxVisible={5}
    autoAdvance={false} pauseOnHover showDots />;
}
