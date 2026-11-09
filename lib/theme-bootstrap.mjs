export const themeBootstrap = `(() => {
  let theme;
  try { theme = localStorage.getItem("desafio-portfolio-theme"); } catch {}
  if (theme !== "dark" && theme !== "light") {
    theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.dataset.portfolioTheme = theme;
})();`;
