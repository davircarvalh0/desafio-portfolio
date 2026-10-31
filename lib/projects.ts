import type { CardStackItem } from "@/components/ui/card-stack";
export type ProjectLink = { label: string; url: string };
export type Project = CardStackItem & { details: string; tag: string; technologies: string[]; evidence: string; configured: boolean; links: ProjectLink[] };
export const assetPath = (path: string) => path.startsWith("data:") ? path : `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${path.replace(/^\//, "")}`;
const records: Project[] = [
  {
    "id": "dados",
    "title": "Dados",
    "description": "Notebook no Google Colab e relatório da entrega",
    "details": "A entrega de Dados reúne um notebook no Google Colab e um relatório. Os dois materiais estão disponíveis nos links abaixo.",
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
    "title": "Marketing",
    "description": "Documento com a entrega do desafio",
    "details": "O documento da entrega de Marketing pode ser consultado pelo link abaixo.",
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
    "title": "Gente e Gestão",
    "description": "A entrega de Gente e Gestão ainda não foi vinculada a este portal.",
    "details": "Espaço para apresentar a proposta do desafio de Gente e Gestão, a entrega realizada e os principais aprendizados.",
    "tag": "Desafio CITi",
    "technologies": [],
    "evidence": "",
    "configured": false,
    "links": [],
    "imageSrc": "images/gente-e-gestao.jpg"
  },
  {
    "id": "produto",
    "title": "Produto",
    "description": "A entrega de Produto ainda não foi vinculada a este portal.",
    "details": "Espaço para apresentar a proposta do desafio de Produto, a entrega realizada e os principais aprendizados.",
    "tag": "Desafio CITi",
    "technologies": [],
    "evidence": "",
    "configured": false,
    "links": [],
    "imageSrc": "images/produto.jpg"
  },
  {
    "id": "comercial",
    "title": "Comercial",
    "description": "A entrega de Comercial ainda não foi vinculada a este portal.",
    "details": "Espaço para apresentar a proposta do desafio de Comercial, a entrega realizada e os principais aprendizados.",
    "tag": "Desafio CITi",
    "technologies": [],
    "evidence": "",
    "configured": false,
    "links": [],
    "imageSrc": "images/comercial.jpg"
  }
];
export const projects: Project[] = records.map(project => ({...project, imageSrc: assetPath(project.imageSrc!), href: project.links[0]?.url, links: project.links.map(link => ({...link, url: link.url.startsWith('entregas/') ? assetPath(link.url) : link.url}))}));
