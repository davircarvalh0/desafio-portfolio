import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir } from "node:fs/promises";
const preview = pathToFileURL(resolve("preview/index.html")).href;

test.beforeEach(async ({ page }) => {
  await page.goto(preview);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Davi Rosendo");
});

test("seleciona desafios e preserva links e PDF", async ({ page }, info) => {
  const areas = page.getByRole("group", { name: "Áreas dos desafios" });
  await expect(areas.getByRole("button")).toHaveCount(6);
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Dados", exact: true, level: 3 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Explorar a jornada" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Explore os testes da API" })).toHaveCount(0);
  await expect(page.getByText("Processo seletivo CITi", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Abrir notebook", exact: true })).toHaveAttribute("href", /colab\.research\.google\.com/);
  if (process.env.SCREENSHOT_DIR) {
    await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
    await expect.poll(() => page.locator("[data-card] img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBeTruthy();
    await page.screenshot({ path: resolve(process.env.SCREENSHOT_DIR, `portfolio-cardstack-${info.project.name}.png`), fullPage: true });
  }
  await areas.getByRole("button", { name: "Desenvolvimento", exact: true }).click();
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Desenvolvimento", exact: true, level: 3 })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ler relatório em PDF", exact: true })).toHaveAttribute("href", /relatorio-desenvolvimento\.pdf$/);
  await expect(page.getByRole("link", { name: "Ver repositório", exact: true })).toHaveAttribute("href", "https://github.com/davircarvalh0/repositorio-desafio-dev");
});

test("navega por teclado e pelos indicadores", async ({ page }) => {
  const carousel = page.getByRole("region", { name: "Os seis desafios" });
  await carousel.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Marketing", exact: true, level: 3 })).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Comercial", exact: true, level: 3 })).toBeVisible();
  await page.keyboard.press("Home");
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Dados", exact: true, level: 3 })).toBeVisible();
  await page.getByRole("button", { name: "Ir para Produto", exact: true }).click();
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Produto", exact: true, level: 3 })).toBeVisible();
});

test("arraste troca o cartão sem o clique desfazer a seleção", async ({ page }) => {
  // Orçamento próprio para o Chromium com renderização por software no CI.
  test.setTimeout(60_000);
  const card = page.locator('[data-card="dados"][data-active="true"]');
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeVisible();
  await page.waitForTimeout(500);
  const box = await card.boundingBox();
  if (!box) throw new Error("Cartão ativo não encontrado");
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  const background = page.locator('[data-slot="shader-metal"] canvas');
  await expect(background).toHaveAttribute("data-shader-paused", "true");
  await page.mouse.move(start.x - Math.min(190, box.width * 0.7), start.y, { steps: 6 });
  await page.mouse.up();
  await expect(background).toHaveAttribute("data-shader-paused", "false");
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Marketing", exact: true, level: 3 })).toBeVisible();
  await page.waitForTimeout(400);
  await expect(page.locator('[data-card="marketing"][data-active="true"]')).toHaveCount(1);
});

test("layout não cria rolagem horizontal e não inventa links pendentes", async ({ page }) => {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  await page.getByRole("group", { name: "Áreas dos desafios" }).getByRole("button", { name: "Gente e Gestão", exact: true }).click();
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Gente e Gestão", exact: true, level: 3 })).toBeVisible();
  await expect(page.locator(".pending-delivery")).toBeVisible();
  await expect(page.locator(".detail-actions a")).toHaveCount(0);
});

test("tema escuro e movimento reduzido mantêm a navegação", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: "Ativar tema escuro", exact: true }).click();
  await expect(page.locator(".portfolio")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Próximo desafio", exact: true }).click();
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Marketing", exact: true, level: 3 })).toBeVisible();
  await page.waitForTimeout(800);
  await expect(page.locator(".project-detail").getByRole("heading", { name: "Marketing", exact: true, level: 3 })).toBeVisible();
});


test("fundo metálico acompanha o tema e nome do topo fica sem ponto", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Davi Rosendo", exact: true })).toBeVisible();
  await expect(page.locator(".brand-dot")).toHaveCount(0);
  const canvas = page.locator('[data-slot="shader-metal"] canvas');
  await expect(canvas).toHaveAttribute("data-renderer", "webgl");
  await expect(canvas).toHaveAttribute("data-shader-theme", "light");
  await page.getByRole("button", { name: "Ativar tema escuro", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-shader-theme", "dark");
  await page.getByRole("button", { name: "Ativar tema claro", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-shader-theme", "light");
});
