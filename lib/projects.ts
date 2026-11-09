import type { CardStackItem } from "@/components/ui/card-stack";
export type ProjectLink = { label: string; url: string };
export type Project = CardStackItem & { headline: string; details: string; tag: string; technologies: string[]; evidence: string; configured: boolean; links: ProjectLink[] };
export const assetPath = (path: string) => path.startsWith("data:") ? path : `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${path.replace(/^\//, "")}`;
const records: Project[] = [
  {
    "id": "dados",
    "headline": "Da análise ao relatório.",
    "title": "Dados",
    "description": "Notebook no Google Colab e relatório da entrega",
    "details": "Explore o trabalho no notebook do Google Colab ou leia o relatório que acompanha a entrega.",
    "tag": "Notebook e relatório",
    "technologies": [
      "Google Colab",
      "Relatório"
    ],
    "evidence": "",
    "configured": true,
    "links": [
      {
        "label": "Abrir notebook",
        "url": "https://colab.research.google.com/drive/1zHBnrBqeIF5LbfMF-zrAyvwLjQ4lrNGB"
      },
      {
        "label": "Ler relatório",
        "url": "https://docs.google.com/document/d/1LouRs8vvzI45_cxrQIS3-b6lm8KTXo2N_E-qdH0MK9w/edit?usp=sharing"
      }
    ],
    "imageSrc": "images/dados.jpg"
  },
  {
    "id": "marketing",
    "headline": "A proposta em um documento.",
    "title": "Marketing",
    "description": "Documento com a entrega do desafio",
    "details": "A entrega de Marketing está reunida em um documento para consulta.",
    "tag": "Documento da entrega",
    "technologies": [
      "Documento"
    ],
    "evidence": "",
    "configured": true,
    "links": [
      {
        "label": "Ver entrega",
        "url": "https://docs.google.com/document/d/1EMTog825jkrKIfZFvibSgZtaXFzx2wuvHNJQzxwwDWk/edit?usp=sharing"
      }
    ],
    "imageSrc": "images/marketing.jpg"
  },
  {
    "id": "desenvolvimento",
    "headline": "Uma API para a Folhagem & Cia.",
    "title": "Desenvolvimento",
    "description": "Folhagem & Cia · API e evidências dos testes",
    "details": "API de uma loja de plantas com cadastro, edição parcial, filtros, vendas e cálculo do estoque. A entrega inclui os quatro bônus do desafio, proteção para vendas simultâneas e uma página de evidências dos testes.",
    "tag": "API e testes",
    "technologies": [
      "Node.js",
      "Express",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Docker"
    ],
    "evidence": "94 testes aprovados na execução local registrada",
    "configured": true,
    "links": [
      {
        "label": "Ver os testes",
        "url": "https://davircarvalh0.github.io/repositorio-desafio-dev/"
      },
      {
        "label": "Ver repositório",
        "url": "https://github.com/davircarvalh0/repositorio-desafio-dev"
      },
      {
        "label": "Ler relatório em PDF",
        "url": "entregas/relatorio-desenvolvimento.pdf"
      }
    ],
    "imageSrc": "images/desenvolvimento.jpg"
  },
  {
    "id": "gente-e-gestao",
    "headline": "Do diagnóstico ao plano de ação.",
    "title": "Gente e Gestão",
    "description": "Squad Aurora · diagnóstico e plano de ação",
    "details": "Análise do clima e do impacto financeiro do projeto do Squad Aurora, com distribuição das horas extras, plano de ação e roteiro de conversas individuais. Consulte a entrega completa em PDF.",
    "tag": "Relatório em PDF",
    "technologies": ["Diagnóstico de clima", "Análise financeira", "Plano de ação"],
    "evidence": "",
    "configured": true,
    "links": [{"label": "Ler relatório em PDF", "url": "entregas/relatorio-gente-e-gestao.pdf"}],
    "imageSrc": "images/gente-e-gestao.jpg"
  },
  {
    "id": "produto",
    "headline": "A clínica que perde consultas.",
    "title": "Produto",
    "description": "Enunciado do desafio de Produto · PTC 2026.2",
    "details": "O caso da Clínica Movimento propõe investigar as faltas em sessões de fisioterapia, testar uma solução e montar uma proposta para a rede.",
    "tag": "Enunciado em PDF",
    "technologies": ["Investigação do problema", "Validação de solução", "Proposta"],
    "evidence": "",
    "configured": false,
    "links": [{"label": "Ler enunciado em PDF", "url": "entregas/enunciado-produto-clinica.pdf"}],
    "imageSrc": "images/produto.jpg"
  },
  {
    "id": "comercial",
    "headline": "Da prospecção à reunião de diagnóstico.",
    "title": "Comercial",
    "description": "Dois desafios · prospecção e diagnóstico comercial",
    "details": "O primeiro desafio avalia três empresas e formula hipóteses de fit com o CITi. O segundo aprofunda o caso da Frango Dourado com um roteiro de diagnóstico e perguntas SPIN.",
    "tag": "Duas entregas em PDF",
    "technologies": ["Prospecção", "Hipóteses de fit", "SPIN Selling"],
    "evidence": "",
    "configured": true,
    "links": [
      {"label": "Ler primeiro desafio (PDF)", "url": "entregas/desafio-comercial-1.pdf"},
      {"label": "Ler segundo desafio (PDF)", "url": "entregas/desafio-comercial-2.pdf"}
    ],
    "imageSrc": "images/comercial.jpg"
  }
];
export const projects: Project[] = records.map(project => {
  const links = project.links.map(link => ({
    ...link,
    url: link.url.startsWith("entregas/") ? assetPath(link.url) : link.url,
  }));
  return { ...project, imageSrc: assetPath(project.imageSrc!), href: links[0]?.url, links };
});
