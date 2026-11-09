import { createRoot } from "react-dom/client";
import Portfolio from "../components/portfolio";

const root = document.getElementById("root")!;
createRoot(root).render(<Portfolio screen={root.dataset.screen === "challenges" ? "challenges" : "home"} preview={{ home: root.dataset.home || "index.html" }} />);
