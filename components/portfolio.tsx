"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Github, FileText, FlaskConical, Layers3, BarChart3, Megaphone, Code2, UsersRound, Shapes, Handshake, Moon, Sun, Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import CardStackDemo from "@/components/card-stack-demo";
import { ShaderMetal } from "@/components/ui/shader-metal";
import { Button } from "@/components/ui/button";
import { projects, type Project } from "@/lib/projects";

const icons = [BarChart3, Megaphone, Code2, UsersRound, Shapes, Handshake];

export default function Portfolio() {
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const reduceMotion = useReducedMotion();
  const selected = projects[active];
  const Icon = icons[active];
  const changeIndex = useCallback((index: number, _item: Project) => setActive(index), []);

  return <div className={dark ? "portfolio dark" : "portfolio"}>
    <div className="ambient" aria-hidden="true" />
    <div className="metal-background" aria-hidden="true" data-theme={dark ? "dark" : "light"}>
      <ShaderMetal metal="chrome" theme={dark ? "dark" : "light"} ribbons={3} speed={reduceMotion ? 0 : 0.18} iridescence={0.16} interactive={!reduceMotion} />
    </div>
    <a className="skip-link" href="#desafios">Ir para os desafios</a>
    <header className="site-header">
      <nav className="glass-nav" aria-label="Principal">
        <Link href="#inicio" className="brand"><span className="brand-symbol"><Layers3 size={19} strokeWidth={1.6} /></span><span>Davi Rosendo</span></Link>
        <div className="nav-links"><Link href="#desafios">Os desafios</Link><Link href="#jornada">A jornada</Link></div>
        <div className="nav-right"><a className="github-nav" href="https://github.com/davircarvalh0" target="_blank" rel="noreferrer"><Github size={15} /><span>GitHub</span><ArrowUpRight size={12} /></a><button className="theme-control" type="button" onClick={() => setDark(value => !value)} aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}>{dark ? <Sun size={16} /> : <Moon size={16} />}</button></div>
      </nav>
    </header>
    <main id="inicio">
      <section className="hero content-shell" aria-labelledby="hero-title">
        <h1 id="hero-title" className="hero-signature">Por Davi Rosendo Carvalho</h1>
      </section>
      <section id="desafios" className="challenge-section" aria-labelledby="challenge-title">
        <div className="section-intro content-shell"><div><h2 id="challenge-title">Cada área, uma descoberta.</h2></div></div>
        <div className="cardstage-shell"><CardStackDemo activeIndex={active} onChangeIndex={changeIndex} /></div>
        <div className="challenge-tabs content-shell" role="group" aria-label="Áreas dos desafios">
          {projects.map((project, index) => { const TabIcon = icons[index]; return <button key={project.id} type="button" aria-pressed={active === index} onClick={() => setActive(index)} className={active === index ? "challenge-tab selected" : "challenge-tab"}><TabIcon size={14} /><span>{project.title}</span></button>; })}
        </div>
        <div className="content-shell">
          <div className="project-detail-shell" aria-live="polite" aria-atomic="true">
            <AnimatePresence mode="wait" initial={false}>
              <motion.article key={selected.id} className="project-detail" initial={{ opacity: reduceMotion ? 1 : 0 }} animate={{ opacity: 1 }} exit={{ opacity: reduceMotion ? 1 : 0 }} transition={{ duration: reduceMotion ? 0 : 0.13 }} aria-labelledby="project-title">
                <div className="detail-heading"><div className="detail-icon"><Icon size={20} strokeWidth={1.7} /></div><div><span className="detail-label">DESAFIO {String(active + 1).padStart(2, "0")} / 06</span><h3 id="project-title">{selected.title}</h3></div><span className="detail-tag">{selected.configured ? <><Check size={12} /> Entrega vinculada</> : "Link a adicionar"}</span></div>
                <div className="detail-body"><div><p className="detail-description">{selected.details}</p>{selected.technologies.length > 0 && <div className="technology-tags">{selected.technologies.map(technology => <span key={technology}>{technology}</span>)}</div>}{selected.evidence && <p className="evidence-note"><FlaskConical size={13} />{selected.evidence}</p>}</div>
                  <div className="detail-actions">{selected.links.length ? selected.links.map((link, index) => <Button key={link.url} asChild variant={index === 0 ? "default" : "outline"}><a href={link.url} target="_blank" rel="noreferrer">{link.label.toLowerCase().includes("relatório") ? <FileText size={14} /> : null}{link.label}<ArrowUpRight size={14} /></a></Button>) : <div className="pending-delivery"><FileText size={20} strokeWidth={1.5} /><p>O link desta entrega<br />será adicionado aqui.</p></div>}</div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </section>
      <section id="jornada" className="journey-section content-shell" aria-labelledby="journey-title"><div className="journey journey-glass"><div className="journey-heading"><h2 id="journey-title">O que fica<br /><span>além da entrega.</span></h2></div><div className="journey-copy"><p>Cada desafio abriu espaço para pensar de um jeito diferente. Este portfólio reúne as entregas das seis áreas do processo seletivo CITi e conecta os materiais que fazem parte dessa trajetória.</p><div className="journey-links"><a href="https://github.com/davircarvalh0" target="_blank" rel="noreferrer"><Github size={16} />Conheça meu GitHub<ArrowUpRight size={14} /></a></div></div></div></section>
    </main>
    <footer className="site-footer content-shell"><span>Davi Rosendo Carvalho</span><span>Portfólio · Desafios CITi</span><a href="#inicio">Voltar ao início ↑</a></footer>
  </div>;
}
