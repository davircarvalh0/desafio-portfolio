import type { Metadata } from "next";
import Portfolio from "@/components/portfolio";

export const metadata: Metadata = { title: "Os desafios · Davi Rosendo" };

export default function Challenges() {
  return <Portfolio screen="challenges" />;
}
