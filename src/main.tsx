import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { UacThemeProvider } from "@buschschwick/uac-ui";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <UacThemeProvider>
      <App />
    </UacThemeProvider>
  </StrictMode>,
);
