# Portfólio dos desafios — React e CardStack

O portal foi refeito com a skill **apple-design** e adaptado a partir do componente CardStack fornecido. A apresentação usa tipografia do sistema, navegação translúcida, cartões em leque, transições por molas e temas claro/escuro. Não há avanço automático. Os links reais de Dados, Marketing e Desenvolvimento foram preservados; as outras três entregas continuam aguardando os links.

## Projeto independente

```text
Dev/
├── repositorio-desafio-dev/
└── desafio-portfolio/
```

O site de testes da API continua independente e mantém seu atalho para `https://davircarvalh0.github.io/desafio-portfolio/`.

## Estrutura e dependências

O projeto anterior era HTML estático. Agora utiliza **Next.js + React + TypeScript + Tailwind CSS**, com exportação estática para o GitHub Pages e estrutura compatível com **shadcn/ui**.

```text
app/
  layout.tsx                 # Metadados e layout
  page.tsx                   # Página inicial
  globals.css                # Tailwind, tokens e estilo da interface
components/
  portfolio.tsx              # Conteúdo e seleção das seis áreas
  card-stack-demo.tsx        # Integração do CardStack com os projetos
  ui/
    card-stack.tsx           # Componente adaptado do código fornecido
    button.tsx               # Botão no padrão shadcn
lib/
  projects.ts                # Dados e links das entregas
  utils.ts                   # cn com clsx e tailwind-merge
public/
  images/                    # Seis fotos ilustrativas do Unsplash
  entregas/
    relatorio-desenvolvimento.pdf
scripts/
  serve.mjs                  # Prévia HTTP da exportação estática
  build-preview.mjs          # Prévia React independente em um HTML
  preview-entry.tsx
  preview-link.tsx
components.json              # Configuração do shadcn e aliases
playwright.config.ts
tests/portfolio.spec.ts
```

O diretório padrão dos componentes reutilizáveis é **`components/ui`**, na raiz do projeto. O alias `@/components/ui` aponta para esse diretório em `components.json` e `tsconfig.json`. Mantê-lo consistente permite importar o CardStack e adicionar componentes shadcn sem corrigir caminhos em vários arquivos. Os estilos globais ficam em **`app/globals.css`**. Não foi utilizado um diretório `src`.

As dependências incluem `next`, `react`, `react-dom`, `framer-motion`, `lucide-react`, Tailwind, TypeScript e os utilitários de estilo do shadcn. O botão usa Radix Slot. O CardStack usa hooks do React e Framer Motion, sem exigir um provider adicional. As versões resolvidas estão fixadas no `package-lock.json`.

## Executar no seu computador

Na pasta independente:

```powershell
cd "C:\Users\Davi Carvalho\Desktop\Faculdade\CITi\PTC\Dev\desafio-portfolio"
npm ci
npm run dev
```

Abra `http://localhost:3000`. Agora o projeto é React; abrir o HTML antigo não executa esta aplicação. Uma cópia do projeto anterior foi preservada em `legacy/` no seu computador, fora dos novos commits.

A instalação na Área de Trabalho encontrou uma restrição de escrita neste ambiente. As dependências, a compilação e os testes foram executados em uma cópia temporária do mesmo código. Execute `npm ci` no seu terminal para instalar as dependências na pasta definitiva.

## Verificações

```powershell
npm run build
npm run typecheck
npm run preview:html
npx playwright install chromium
npm test
```

As 12 verificações de navegador cobrem seleção das áreas, preservação dos links e PDF, teclado, arraste sem reversão por clique, ausência de rolagem horizontal, tema escuro e preferência por movimento reduzido, em desktop e celular. O teste reduzido não é um teste físico em um telefone: utiliza a emulação de dispositivo no Chromium.

Para consultar a exportação estática localmente:

```powershell
npm run preview
```

Abra o endereço mostrado no terminal, normalmente `http://localhost:4173`.

Para uma prévia independente, depois do build:

```powershell
npm run preview:html
```

Abra `preview/index.html`. Essa prévia usa os mesmos componentes React, com os estilos e imagens incorporados. Apenas `next/link` é substituído por links nativos na prévia, pois ela abre diretamente por arquivo. A versão publicada continua sendo a exportação normal do Next.js. O PDF permanece em `public/entregas` e sua localização é preservada na prévia.

## CardStack: integração e adaptações

O componente original foi colocado em `components/ui/card-stack.tsx`, mantendo sua API principal. A integração com as seis entregas fica em `components/card-stack-demo.tsx`.

Adaptações feitas:

- seleção controlada por `activeIndex`, sincronizada com os botões de área e os detalhes da entrega;
- tamanho calculado com `ResizeObserver`, três cartões visíveis no celular e até cinco na configuração desktop;
- navegação por setas, Home, End, indicadores e botões com rótulos em português;
- arraste horizontal com detecção de distância e velocidade;
- proteção para que o clique emitido após o arraste não desfaça a troca de cartão;
- profundidade aplicada pelo `z` do Motion no próprio cartão;
- respeito a menos movimento, menos transparência e mais contraste;
- autoplay disponível na API, porém desativado nesta página; quando utilizado, pausa por foco, hover e aba oculta;
- ícones do Lucide e fotos ilustrativas nas seis capas.

Se quiser acrescentar outros componentes shadcn posteriormente, o projeto já tem a estrutura necessária. Por exemplo:

```powershell
npx shadcn@latest add dialog
```

Não é preciso executar o comando para usar este portal. Faça uma revisão das alterações geradas pela CLI antes de commitar novos componentes.

## Adicionar as três entregas restantes

Edite `lib/projects.ts`. Para Gente e Gestão, Produto e Comercial, preencha a descrição real e o array `links`, e altere `configured` para `true`. Não substitua o link ausente por um endereço fictício. O campo `imageSrc` é somente uma capa ilustrativa; não representa captura da entrega.

O relatório de Desenvolvimento foi copiado do último PDF enviado, sem modificar seu conteúdo. Para atualizá-lo, substitua `public/entregas/relatorio-desenvolvimento.pdf`.

## Publicar no GitHub Pages

Crie o repositório público vazio **davircarvalh0/desafio-portfolio** e configure **Settings → Pages → Source → GitHub Actions**. O repositório local já foi inicializado, mas nenhum commit ou push foi criado automaticamente.

Sugestão de commits, para o primeiro envio:

```powershell
git add package.json package-lock.json tsconfig.json next.config.ts next-env.d.ts postcss.config.mjs components.json .gitignore lib/utils.ts
git commit -m "chore(portfolio): configura Next.js, TypeScript, Tailwind e shadcn"

git add app components lib/projects.ts public scripts
git commit -m "feat(portfolio): apresenta desafios em um CardStack com estilo Apple" -m "Integra cartoes responsivos com navegacao por teclado e arraste, temas e detalhes das entregas. Preserva os links e o relatorio PDF fornecidos."

git add tests playwright.config.ts .github/workflows/pages.yml README.md
git commit -m "test(portfolio): verifica interacoes e publica a exportacao estatica" -m "Adiciona testes de desktop e celular e configura o GitHub Pages com o caminho desafio-portfolio."
```

Antes de enviar, confira `git status`. `node_modules`, `.next`, `out`, `preview` e arquivos de teste gerados ficam fora do Git.

Se o remote ainda não existir:

```powershell
git remote add origin https://github.com/davircarvalh0/desafio-portfolio.git
git push -u origin main
```

Se já existir, confira `git remote -v` antes de alterá-lo.

O workflow usa `NEXT_PUBLIC_BASE_PATH=/desafio-portfolio`, executa `npm ci`, confere os tipos, gera o site em `out/`, executa os testes e publica esse diretório. O endereço esperado continua sendo:

https://davircarvalh0.github.io/desafio-portfolio/

Se a regra do ambiente `github-pages` restringir branches, autorize `main`. A publicação ainda depende de enviar os commits e concluir o workflow no GitHub.

## Imagens e referências

As capas são fotos ilustrativas obtidas do Unsplash; não são fotos pessoais nem capturas dos trabalhos. Arquivos usados:

- Dados: https://images.unsplash.com/photo-1460925895917-afdab827c52f
- Marketing: https://images.unsplash.com/photo-1554774853-719586f82d77
- Desenvolvimento: https://images.unsplash.com/photo-1498050108023-c5249f4df085
- Gente e Gestão: https://images.unsplash.com/photo-1522071820081-009f0129c71c
- Produto: https://images.unsplash.com/photo-1581291518857-4e27b48ff24e
- Comercial: https://images.unsplash.com/photo-1556761175-b413da4baf72

O CardStack foi adaptado do código fornecido pelo usuário. O estilo foi definido a partir da skill apple-design fornecida, sem utilizar marcas ou componentes proprietários da Apple.


## Fundo metálico

O componente fornecido foi integrado em `components/ui/shader-metal.tsx` como fundo fixo, sem interceptar cliques. O estado do tema do portal é passado explicitamente ao shader: no modo claro, usa a iluminação de estúdio clara; no escuro, usa a iluminação de palco escura. Não depende de uma classe no elemento HTML para acompanhar o botão de tema.

O fundo limita a resolução e a taxa de desenho a 24 quadros por segundo, pausa em abas ocultas e respeita a preferência por menos movimento. Em alto contraste ou com menos transparência, fica oculto para priorizar a leitura. Se WebGL não estiver disponível, o fundo estático permanece. O nome do topo foi ajustado para “Davi Rosendo”, sem ponto.

A renderização do fundo também pausa durante interações com os cartões e volta ao soltar o ponteiro. O teste de arraste confere essa pausa e a retomada, além da troca de cartão. Esse teste tem orçamento de 60 segundos para execução com GPU por software no CI; os demais mantêm 30 segundos.
