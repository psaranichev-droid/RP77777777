import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./assets/fonts.css";
import "./index.css";
import { App } from "./App";
import { registerServiceWorker } from "./utils/serviceWorker";

// Регистрируем Service Worker для кэширования и offline поддержки
registerServiceWorker();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);