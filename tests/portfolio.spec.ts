import { test, expect } from "@playwright/test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mkdir } from "node:fs/promises";

const home = pathToFileURL(resolve("preview/index.html")).href;
const gallery = pathToFileURL(resolve("preview/desafios.html")).href;

test("a abertura navega para a página de desafios e permite voltar", async ({ page }) => {
  await page.goto(home);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Davi Rosendo");
  await page.getByRole("link", { name: "Explorar os desafios" }).click();
  await expect(page).toHaveURL(gallery);
  await expect(page.getByRole("heading", { name: "Os desafios", level: 1 })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Principal" }).getByRole("link", { name: "Desafios" })).toHaveAttribute("aria-current", "page");
  await page.goBack();
  await expect(page).toHaveURL(home);
});

test("seis núcleos coloridos orbitam e funcionam como atalhos", async ({ page }) => {
  await page.goto(home);
  const orbit = page.getByRole("navigation", { name: "Atalhos orbitais para as áreas" });
  const links = orbit.getByRole("link");
  await expect(links).toHaveCount(6);
  const colors = await orbit.locator(".nucleus-core").evaluateAll(nodes => nodes.map(node => getComputedStyle(node).fill));
  expect(new Set(colors).size).toBe(6);

  const track = orbit.locator(".hero-nucleus").first().locator("..");
  await orbit.scrollIntoViewIfNeeded();
  const initial = await track.getAttribute("transform");
  await expect.poll(() => track.getAttribute("transform")).not.toBe(initial);

  const shortcut = orbit.getByRole("link", { name: "Ir para Produto" });
  await shortcut.focus();
  await expect(orbit.locator(".orbit-caption")).toHaveText("Produto");
  const paused = await track.getAttribute("transform");
  await page.waitForTimeout(180);
  await expect(track).toHaveAttribute("transform", paused!);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(gallery + "#area-produto");
  await expect(page.getByRole("heading", { name: "Produto", exact: true })).toBeInViewport();
});

test("as seis áreas são capítulos sem fotos ou rolagem lateral", async ({ page }, info) => {
  await page.goto(gallery);
  await expect(page.locator(".area-chapter")).toHaveCount(6);
  await expect(page.locator(".chapter-graphic")).toHaveCount(6);
  await expect(page.locator(".chapter-orbit")).toHaveCount(6);
  await expect(page.locator(".chapter-orbit .orbit-trace").first()).toHaveCSS("animation-name", "orbit-draw");
  await expect(page.locator("img")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBeTruthy();
  if (process.env.SCREENSHOT_DIR) {
    await mkdir(process.env.SCREENSHOT_DIR, { recursive: true });
    await page.screenshot({ path: resolve(process.env.SCREENSHOT_DIR, "capitulos-" + info.project.name + ".png") });
  }
});

test("cada capítulo abre os materiais corretos e fecha o anterior", async ({ page }) => {
  await page.goto(gallery);
  await page.getByRole("button", { name: "Explorar desafio de Dados" }).click();
  await expect(page.locator("#area-dados .orbit-response")).toHaveCSS("animation-name", "orbit-response");
  await expect(page.locator("#detalhes-dados")).toBeInViewport({ ratio: 0.25 });
  await expect(page.getByRole("link", { name: "Abrir notebook" })).toHaveAttribute("href", /colab\.research\.google\.com/);
  await page.getByRole("button", { name: "Explorar desafio de Marketing" }).click();
  await expect(page.getByRole("link", { name: "Abrir notebook" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Ver entrega" })).toHaveAttribute("href", /docs\.google\.com/);
  await page.getByRole("button", { name: "Explorar desafio de Desenvolvimento" }).click();
  await expect(page.getByRole("link", { name: "Ler relatório em PDF" })).toHaveAttribute("href", /relatorio-desenvolvimento\.pdf$/);
  await page.getByRole("button", { name: "Explorar desafio de Gente e Gestão" }).click();
  await expect(page.getByRole("link", { name: "Ler relatório em PDF" })).toHaveAttribute("href", /relatorio-gente-e-gestao\.pdf$/);
  await page.getByRole("button", { name: "Explorar desafio de Produto" }).click();
  await expect(page.getByText("Enunciado disponível", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Ler enunciado em PDF" })).toHaveAttribute("href", /enunciado-produto-clinica\.pdf$/);
  await page.getByRole("button", { name: "Explorar desafio de Comercial" }).click();
  await expect(page.getByRole("link", { name: "Ler primeiro desafio (PDF)" })).toHaveAttribute("href", /desafio-comercial-1\.pdf$/);
  await expect(page.getByRole("link", { name: "Ler segundo desafio (PDF)" })).toHaveAttribute("href", /desafio-comercial-2\.pdf$/);
});

test("o acesso direto posiciona o capítulo e o controle funciona pelo teclado", async ({ page }) => {
  await page.goto(home);
  await page.getByRole("link", { name: "Comercial", exact: true }).click();
  await expect(page).toHaveURL(gallery + "#area-comercial");
  await expect(page.getByRole("heading", { name: "Comercial", level: 2 })).toBeInViewport();
  const control = page.getByRole("button", { name: "Explorar desafio de Comercial" });
  await control.focus();
  await page.keyboard.press("Enter");
  const close = page.getByRole("button", { name: "Fechar detalhes de Comercial" });
  await expect(close).toBeFocused();
  await expect(close).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Space");
  await expect(control).toHaveAttribute("aria-expanded", "false");
});

test("o cursor desloca o grafismo e movimento reduzido preserva a leitura", async ({ page }, info) => {
  await page.goto(gallery);
  const art = page.locator(".chapter-art").first();
  if (info.project.name === "desktop") {
    await art.hover({ position: { x: 40, y: 50 } });
    await expect.poll(() => art.evaluate(element => element.style.getPropertyValue("--drift-x"))).not.toBe("");
    await page.locator("h1").hover();
    await expect.poll(() => art.evaluate(element => element.style.getPropertyValue("--drift-x"))).toBe("");
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page.getByRole("button", { name: "Ativar tema escuro" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-portfolio-theme", "dark");
  await expect(page.locator(".nav-progress")).toHaveCount(0);
  await expect(art.locator(".orbit-trace").first()).toHaveCSS("stroke-dashoffset", "0px");
  await page.getByRole("button", { name: "Explorar desafio de Dados" }).click();
  await expect(page.getByRole("link", { name: "Abrir notebook" })).toBeVisible();
});
