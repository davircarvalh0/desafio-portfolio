import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Davi Rosendo · Desafios CITi", description: "Seis desafios, novas perspectivas. As entregas de Dados, Marketing, Desenvolvimento, Gente e Gestão, Produto e Comercial de Davi Rosendo Carvalho." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="pt-BR"><body>{children}</body></html>; }
