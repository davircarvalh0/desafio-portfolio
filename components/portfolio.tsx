"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, BarChart3, Check, ChevronDown, Code2,
  FileText, FlaskConical, Github, Handshake, Layers3, Megaphone, Moon, Shapes, Sun, UsersRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll } from "framer-motion";
import { AreaArtwork, resetPointer, trackPointer } from "@/components/area-artwork";
import { HeroOrbit } from "@/components/hero-orbit";
import { projects } from "@/lib/projects";

type Screen = "home" | "challenges";

const icons = [BarChart3, Megaphone, Code2, UsersRound, Shapes, Handshake];
const themeKey = "desafio-portfolio-theme";
const github = "https://github.com/davircarvalh0";
const areasWithDeliveries = projects.filter(project => project.configured).length;
const formatNumber = (number: number) => String(number).padStart(2, "0");

function usePortfolioTheme() {
  const [preference, setPreference] = useState<"light" | "dark" | null>(null);
  const [systemDark, setSystemDark] = useState<boolean | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    update();
    try {
      const stored = window.localStorage.getItem(themeKey);
      if (stored === "dark" || stored === "light") setPreference(stored);
    } catch {
      // The theme toggle remains usable without storage.
    }
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const dark = preference === null ? systemDark === true : preference === "dark";
  useEffect(() => {
    if (systemDark !== null) document.documentElement.dataset.portfolioTheme = dark ? "dark" : "light";
  }, [dark, systemDark]);

  const toggleTheme = () => {
    const next = dark ? "light" : "dark";
    setPreference(next);
    try {
      window.localStorage.setItem(themeKey, next);
    } catch {
      // This page still keeps the selected theme.
    }
  };

  return { dark, toggleTheme };
}

export default function Portfolio({ screen = "home", preview }: { screen?: Screen; preview?: { home: string } }) {
  const { dark, toggleTheme } = usePortfolioTheme();
  const [active, setActive] = useState(0);
  const [inJourney, setInJourney] = useState(false);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const homeUrl = preview ? "./" + preview.home : basePath + "/";
  const challengeUrl = preview ? "./desafios.html" : basePath + "/desafios/";
  const challengePage = screen === "challenges";
  const currentSection = challengePage ? "cases" : inJourney ? "journey" : "home";

  useEffect(() => {
    if (challengePage) {
      const chapters = Array.from(document.querySelectorAll<HTMLElement>(".area-chapter"));
      const anchored = chapters.find(chapter => "#" + chapter.id === window.location.hash);
      const frame = window.requestAnimationFrame(() => anchored?.scrollIntoView({ behavior: "instant" }));
      const observer = new IntersectionObserver(entries => {
        const visible = entries.find(entry => entry.isIntersecting);
        if (visible) setActive(chapters.indexOf(visible.target as HTMLElement));
      }, { rootMargin: "-26% 0px -52% 0px" });
      chapters.forEach(chapter => observer.observe(chapter));
      return () => {
        window.cancelAnimationFrame(frame);
        observer.disconnect();
      };
    }

    const journey = document.getElementById("jornada");
    if (!journey) return;
    const observer = new IntersectionObserver(([entry]) => setInJourney(entry.isIntersecting), {
      rootMargin: "-32% 0px -32% 0px",
    });
    observer.observe(journey);
    return () => observer.disconnect();
  }, [challengePage]);

  return (
    <div className={dark ? "portfolio dark" : "portfolio"}>
      <a className="skip-link" href="#conteudo">Ir para o conteúdo</a>
      <header className="site-header" data-area={challengePage ? projects[active].id : undefined}>
        <nav className="glass-nav liquid-glass" aria-label="Principal">
          <a href={challengePage ? homeUrl : "#conteudo"} className="brand" aria-label="Davi Rosendo">
            <span className="brand-symbol"><Layers3 size={18} strokeWidth={1.7} /></span>
            <span>Davi Rosendo</span>
          </a>
          <div className="nav-links">
            <a href={challengePage ? homeUrl : "#conteudo"} aria-current={currentSection === "home" ? "location" : undefined}>Início</a>
            <a href={challengePage ? "#conteudo" : challengeUrl} aria-current={currentSection === "cases" ? "page" : undefined}>Desafios</a>
            <a href={challengePage ? homeUrl + "#jornada" : "#jornada"} aria-current={currentSection === "journey" ? "location" : undefined}>Jornada</a>
          </div>
          <div className="nav-right">
            {challengePage && (
              <span className="nav-context" aria-hidden="true"><span />{projects[active].title}</span>
            )}
            <button className="theme-control" type="button" onClick={toggleTheme}
              aria-label={dark ? "Ativar tema claro" : "Ativar tema escuro"}
              title={dark ? "Ativar tema claro" : "Ativar tema escuro"}
            >
              {dark ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          </div>
          {!reduceMotion && <motion.span className="nav-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />}
        </nav>
      </header>

      <main id="conteudo" tabIndex={-1} className="page-arrival">
        {challengePage ? (
          <ChallengeGallery />
        ) : (
          <>
            <section className="hero content-shell" aria-labelledby="hero-title">
              <div className="hero-content pointer-surface" onPointerMove={trackPointer} onPointerLeave={resetPointer}>
                <div className="hero-copy">
                  <h1 id="hero-title">Davi Rosendo <span>Carvalho</span></h1>
                  <p>Uma coleção de desafios e entregas em seis áreas, da análise de dados ao desenvolvimento de software.</p>
                  <a className="chapter-link pointer-control" href={challengeUrl} onPointerMove={trackPointer} onPointerLeave={resetPointer}>
                    Explorar os desafios <span className="control-icon"><ArrowRight size={20} strokeWidth={1.6} /></span>
                  </a>
                </div>
                <HeroOrbit challengeUrl={challengeUrl} />
              </div>
            </section>
            <section className="home-index content-shell" aria-label="Acesso direto às áreas">
              <div className="home-index-heading"><h2>As seis áreas</h2><span>Do primeiro desafio à entrega</span></div>
              <ul>
                {projects.map((project, index) => {
                  const Icon = icons[index];
                  return (
                    <li key={project.id} data-area={project.id}>
                      <a href={challengeUrl + "#area-" + project.id}>
                        <Icon size={17} strokeWidth={1.7} /><span>{project.title}</span><ArrowUpRight size={14} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
            <Journey />
          </>
        )}
      </main>

      <footer className="site-footer content-shell">
        <span>Davi Rosendo Carvalho</span><span>Portfólio · Desafios CITi</span>
        <a href={challengePage ? homeUrl : "#conteudo"}>{challengePage ? "Voltar ao início" : "Voltar ao topo ↑"}</a>
      </footer>
    </div>
  );
}

function ChallengeGallery() {
  const [openArea, setOpenArea] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section className="gallery-section content-shell" aria-labelledby="gallery-title">
      <header className="gallery-heading">
        <div>
          <h1 id="gallery-title">Os <span>desafios</span></h1>
          <p>Seis áreas do CITi, apresentadas uma por vez. Explore cada desafio para ver a proposta e os materiais.</p>
        </div>
        <a className="gallery-start pointer-control" href="#area-dados" onPointerMove={trackPointer} onPointerLeave={resetPointer}>
          Começar por Dados <span className="control-icon"><ArrowDown size={18} /></span>
        </a>
      </header>

      <div className="chapter-sequence" aria-label="Áreas dos desafios">
        {projects.map((project, index) => {
          const Icon = icons[index];
          const next = projects[index + 1];
          const expanded = project.id === openArea;
          const detailId = "detalhes-" + project.id;
          return (
            <article className="area-chapter" id={"area-" + project.id} key={project.id} data-area={project.id} aria-labelledby={"titulo-" + project.id}>
              <motion.div className="chapter-frame liquid-glass"
                initial={reduceMotion ? false : { opacity: .8, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: .16 }}
                transition={{ duration: reduceMotion ? 0 : .5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="chapter-feature">
                  <div className="chapter-intro">
                    <p className="chapter-position"><Icon size={18} strokeWidth={1.65} /> Área {formatNumber(index + 1)} <span>/ {formatNumber(projects.length)}</span></p>
                    <h2 id={"titulo-" + project.id}>{project.title}</h2>
                    <p>{project.headline}</p>
                    <span className="chapter-tag">{project.tag}</span>
                  </div>
                  <AreaArtwork area={String(project.id)} expanded={expanded} />
                </div>

                <div className="chapter-actions">
                  <button className="explore-control pointer-control" type="button" aria-expanded={expanded}
                    aria-label={expanded ? "Fechar detalhes de " + project.title : "Explorar desafio de " + project.title}
                    aria-controls={detailId} onPointerMove={trackPointer} onPointerLeave={resetPointer}
                    onClick={() => setOpenArea(expanded ? null : String(project.id))}
                  >
                    <span>{expanded ? "Fechar detalhes" : "Explorar desafio"}</span>
                    <span className="control-icon"><ChevronDown size={20} strokeWidth={1.7} /></span>
                  </button>
                  {next && (
                    <a className="next-chapter pointer-control" href={"#area-" + next.id} aria-label={"Próxima área: " + next.title}
                      onPointerMove={trackPointer} onPointerLeave={resetPointer}
                    >
                      <span>{next.title}</span><span className="control-icon"><ArrowDown size={18} /></span>
                    </a>
                  )}
                </div>

                <div id={detailId} aria-hidden={!expanded} inert={!expanded}>
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div className="chapter-expand"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: reduceMotion ? 0 : .38, ease: [0.22, 1, 0.36, 1] }}
                        onAnimationComplete={() => {
                          const panel = document.getElementById(detailId);
                          if (panel?.getAttribute("aria-hidden") !== "false") return;
                          const top = panel.getBoundingClientRect().top;
                          if (top > window.innerHeight - 175 && top < window.innerHeight + 60) {
                            window.scrollTo({
                              top: window.scrollY + top - window.innerHeight * .58,
                              behavior: reduceMotion ? "instant" : "smooth",
                            });
                          }
                        }}
                      >
                        <div className="chapter-details">
                          <div>
                            <h3>Sobre o desafio</h3>
                            <p className="detail-description">{project.details}</p>
                            {project.technologies.length > 0 && (
                              <ul className="technology-tags" aria-label="Tópicos e ferramentas">
                                {project.technologies.map(technology => <li key={technology}>{technology}</li>)}
                              </ul>
                            )}
                            {project.evidence && <p className="evidence-note"><FlaskConical size={15} />{project.evidence}</p>}
                          </div>
                          <div className="detail-actions">
                            <p className="detail-status">
                              {project.configured ? <><Check size={14} /> Entrega vinculada</> : project.links.length ? "Enunciado disponível" : "Link a adicionar"}
                            </p>
                            {project.links.length ? project.links.map(link => (
                              <a key={link.url} className="material-link pointer-control" href={link.url} target="_blank" rel="noreferrer"
                                onPointerMove={trackPointer} onPointerLeave={resetPointer}
                              >
                                {link.label}<span className="control-icon"><ArrowUpRight size={16} /></span>
                              </a>
                            )) : (
                              <p className="detail-status"><FileText size={17} /> O link desta entrega será adicionado aqui.</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section id="jornada" className="journey-section content-shell" aria-labelledby="journey-title">
      <div className="journey liquid-glass">
        <div className="journey-copy">
          <p className="eyebrow">A jornada</p>
          <h2 id="journey-title">O que fica<br /><span>além da entrega.</span></h2>
          <p>Cada desafio abriu espaço para pensar de um jeito diferente. Este portfólio reúne os materiais do processo seletivo CITi e registra essa trajetória.</p>
          <a className="journey-link" href={github} target="_blank" rel="noreferrer">
            <Github size={17} /> Conheça meu GitHub <ArrowUpRight size={15} />
          </a>
        </div>
        <dl className="journey-metrics">
          <div><dt>Áreas do processo</dt><dd>{formatNumber(projects.length)}</dd></div>
          <div><dt>Áreas com entrega</dt><dd>{formatNumber(areasWithDeliveries)}</dd></div>
        </dl>
      </div>
    </section>
  );
}
